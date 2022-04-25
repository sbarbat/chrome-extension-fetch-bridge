import {MessagesType} from '.';

console.debug(' Running content script for all websites');

const API_URL = 'https://your.api.com';
const CHROME_EXTENSION_ID = 'your chrome extension id';

/**
 * Override the fetch method so that if it's a call to our API,
 * we redirect the call to the service worker.
 */
const { fetch: originalFetch } = window;
window.fetch = (...args) => {
  const [req, options] = args;
  const url = req.toString();

  if (url.startsWith(API_URL)) {
    return new Promise<Response>((resolve) => {
      chrome.runtime.sendMessage(
        CHROME_EXTENSION_ID,
        {
          type: MessagesType.FETCH,
          url,
          options,
        },
        (r: any) => {
          // Rebuild the response object, since fetch resolves a Response
          const blob = new Blob([JSON.stringify(r.data, null, 2)], {type : 'application/json'});
          const response = new Response(blob, r);
          resolve(response);
        }
      );
    });
  }
  return originalFetch(...args);
};
