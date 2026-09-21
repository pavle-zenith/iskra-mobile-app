# Supabase

Project `aaknvhlirztdglxsnbho`, eu-west-1. **This repo owns the schema.**

`migrations/` is the complete history for the project. The website repo
(`iskra-website-final`) never held migration files: the first five were applied straight to the
project, and their bodies were recovered from `supabase_migrations.schema_migrations` on
21.09.2026 and written here verbatim. A note in that repo's `CLAUDE.md` says schema changes
happen here now.

Filenames match the versions the project recorded, so the two histories line up.

| Version | What it did |
|---|---|
| 20260606171127 | `quiz_submissions` (the website's lead table) |
| 20260606172340 | Added its public UPDATE policy |
| 20260606173608 | `quiz_submissions.name` |
| 20260606193359 | `quiz_submissions.gender` |
| 20260607142701 | The five app tables, RLS and the `updated_at` trigger |
| 20260918170648 | `cravings.tool_used`: the six current tools (M1) |
| 20260918170650 | `profiles.quit_time_zone` (M1) |
| 20260921092805 | Dropped both public policies on `quiz_submissions` (M2) |
| 20260921092811 | One trigger vocabulary, checked on cravings, slips and profiles (M2) |

## Rules

- A value list in `src/lib/vocab.ts` with a server CHECK is changed in both places, in one
  change. The migration comment names the file, and the file's comment names the migration
- `quiz_submissions` has no policies. It is default-deny and only the website's server routes
  reach it, with the service role. The app must never read it: if pre-fill from the quiz is
  built (M2 Task 4), the only door is a `security definer` function keyed on a **verified**
  email
- The service role key never appears in this repo. Migrations are applied with an admin
  connection, not from the app

## Applying

Migrations here were applied through the Supabase MCP. With the CLI instead:

```
npx supabase link --project-ref aaknvhlirztdglxsnbho
npx supabase db push
npm run gen:types
```
