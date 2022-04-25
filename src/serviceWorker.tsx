import {MessageHandler, MessagesType} from '.';

/**
 * MESSAGES HANDLERS
 */
const messagesHandlers: MessageHandler[] = [
  {
    type: MessagesType.FETCH,
    callback: ({ message, sendResponse }) => {
      const { url, options = {} } = message;
      let response: any = { ok: false, url };

      if (!url)
        return sendResponse({
          ...response,
          json: { message: "URL not defined for fetch()" },
        });

      const abortController = new AbortController();
      options.signal = abortController.signal;
      options.headers = {
        ...options.headers,
        "Content-Type": "application/json",
      };

      fetch(url, options)
        .then((r) => {
          response = {
            headers: r.headers,
            ok: r.ok,
            redirected: r.redirected,
            status: r.status,
            statusText: r.statusText,
            type: r.type,
            url: url,
          };
          return r.json();
        })
        .then((data) => {
          sendResponse({ ...response, data });
        })
        .catch(() => {
          sendResponse(response);
        });
    },
  },
];

/**
 * When a message is received, it will forward it to the message handlers.
 */
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.debug('Got message: ', message, 'from', sender);
    if (typeof message.type === 'string') {
      messagesHandlers
        .filter((handler) => handler.type.toLowerCase() === message.type.toLowerCase())
        .forEach((handler) => handler.callback({ message, sender, sendResponse }));
  
      return true;
    }
  });
  