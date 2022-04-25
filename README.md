# Chrome Extension `fetch()` bridge

Newest versions of Chrome don't allow `fetch` to be called within content scripts, it does throw a CORS error.

To manage this all the API calls of a Chrome Extension needs to be made in the service worker, my problem was that I was reusing libraries that I cannot rewrite that were using the `fetch` method to call my API, so here is a workaround.


## How does it work?

We override the `fetch()` method in a content script to send a message to the service worker if it is trying to fetch our API calls. Then, in our service worker, when we got the fetch message we do the call to the API and return the response to the content script.

