import { kvGet, kvSet } from './db';

/**
 * Saznaj's index: the website's live blog, read straight from its public Sanity dataset
 * (docs/M5-brief.md Task 2). Project `dix3dmqg`, dataset `production`, the published perspective,
 * no token: the site's own client uses none, because the dataset is public.
 *
 * `LISTED` is the site's filter from `iskra-website-final/src/sanity/queries.ts`, verbatim,
 * `publishedAt <= now()` included, so a scheduled post never reaches the app before the site.
 * Reading time is the site's own rule: 200 words a minute from the body text, never under one.
 *
 * The index is cached in SQLite, so the tab renders offline and on a cold start without signal.
 * It refreshes on pull, and on foreground at most every six hours.
 */

const PROJECT_ID = 'dix3dmqg';
const DATASET = 'production';
const API_VERSION = '2026-09-01';

const LISTED = `_type == "post" && defined(slug.current) && defined(category) && defined(publishedAt) && publishedAt <= now()`;

const POSTS_QUERY = `*[${LISTED}] | order(publishedAt desc) {
  _id, title, "slug": slug.current, excerpt, publishedAt,
  "category": category->{ title, "slug": slug.current },
  "text": pt::text(body)
}`;

/** Only topics that have at least one listed post, with their real counts. */
const CATEGORIES_QUERY = `*[_type == "category" && defined(slug.current) && count(*[${LISTED} && references(^._id)]) > 0]
  | order(title asc) { _id, title, "slug": slug.current, "count": count(*[${LISTED} && references(^._id)]) }`;

const CACHE_KEY = 'saznaj.index';
const REFRESH_EVERY_MS = 6 * 60 * 60 * 1000;
const WORDS_PER_MINUTE = 200;

export type SaznajPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  publishedAt: string;
  category: { title: string; slug: string } | null;
  minutes: number;
};

export type SaznajCategory = { id: string; title: string; slug: string; count: number };

export type SaznajIndex = {
  posts: SaznajPost[];
  categories: SaznajCategory[];
  fetchedAt: string;
};

type RawPost = {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  publishedAt: string;
  category?: { title: string; slug: string } | null;
  text?: string | null;
};

/** The site's rule: words over 200, rounded, never less than a minute. */
export function readingMinutes(text?: string | null): number {
  const words = text?.trim().split(/\s+/).filter(Boolean).length ?? 0;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

async function query<T>(groq: string): Promise<T> {
  const url =
    `https://${PROJECT_ID}.apicdn.sanity.io/v${API_VERSION}/data/query/${DATASET}` +
    `?query=${encodeURIComponent(groq)}&perspective=published`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Sanity ${response.status}`);
  const body = (await response.json()) as { result: T };
  return body.result;
}

/** The cached index, or null before the first successful fetch. Never touches the network. */
export async function readSaznaj(): Promise<SaznajIndex | null> {
  const raw = await kvGet(CACHE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SaznajIndex;
  } catch {
    return null;
  }
}

/**
 * Fetches and caches a fresh index. Unless `force`, it does nothing when the cache is younger
 * than six hours. Resolves to the index on the phone afterwards, fresh or not; a failed fetch
 * leaves the cache as it was.
 */
export async function refreshSaznaj(
  options: { force?: boolean } = {},
): Promise<SaznajIndex | null> {
  const cached = await readSaznaj();
  const age = cached ? Date.now() - new Date(cached.fetchedAt).getTime() : Infinity;
  if (!options.force && age < REFRESH_EVERY_MS) return cached;

  try {
    const [posts, categories] = await Promise.all([
      query<RawPost[]>(POSTS_QUERY),
      query<(SaznajCategory & { _id: string })[]>(CATEGORIES_QUERY),
    ]);
    const index: SaznajIndex = {
      posts: posts.map((post) => ({
        id: post._id,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt ?? null,
        publishedAt: post.publishedAt,
        category: post.category ?? null,
        minutes: readingMinutes(post.text),
      })),
      categories: categories.map((category) => ({
        id: category._id,
        title: category.title,
        slug: category.slug,
        count: category.count,
      })),
      fetchedAt: new Date().toISOString(),
    };
    await kvSet(CACHE_KEY, JSON.stringify(index));
    return index;
  } catch {
    return cached;
  }
}

/** Where a post opens, tagged so the site can tell the app's readers apart. */
export function articleUrl(slug: string): string {
  return `https://www.iskraclub.com/blog/${slug}?utm_source=app&utm_medium=saznaj`;
}
