import * as Network from 'expo-network';
import * as WebBrowser from 'expo-web-browser';

import { articleUrl, type SaznajPost } from '@/data/saznaj';
import { color } from '@/theme';

/**
 * Opens a post in the in-app browser, or reports that there is no signal, so the caller shows
 * the offline line instead of a browser that cannot load anything.
 */
export async function openArticle(post: Pick<SaznajPost, 'slug'>): Promise<'opened' | 'offline'> {
  const network = await Network.getNetworkStateAsync();
  if (!network.isConnected || network.isInternetReachable === false) return 'offline';
  await WebBrowser.openBrowserAsync(articleUrl(post.slug), {
    controlsColor: color.accent,
    toolbarColor: color.bg,
  });
  return 'opened';
}
