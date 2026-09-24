import * as WebBrowser from 'expo-web-browser';

/**
 * One policy and one set of terms for the site, the quiz and the app (docs/LEGAL-brief.md). The
 * app links to the site's pages rather than carrying its own copy, so there is only ever one
 * version of either, and it is the one the stores list.
 */
export const LEGAL_URLS = {
  privacy: 'https://iskraclub.com/privatnost',
  terms: 'https://iskraclub.com/uslovi',
} as const;

/** Opens in an in-app browser sheet, so reading the policy never leaves the consent screen. */
export function openLegal(page: keyof typeof LEGAL_URLS): void {
  void WebBrowser.openBrowserAsync(LEGAL_URLS[page], {
    presentationStyle: WebBrowser.WebBrowserPresentationStyle.PAGE_SHEET,
  });
}
