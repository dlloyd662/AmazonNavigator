This extension is used to make amazon search more user friendly and allow additional sorting features.

Notes:
See following for explanation of what different scripts do:
https://mattfrisbie.substack.com/p/spy-chrome-extension

From above article

-Background Service Worker
Event driven. Can be used as a “persistent” container for running JavaScript
Can access all\* of the WebExtensions API
Cannot access DOM APIs
Cannot directly access pages

- Popup Page
  Only opens after user interaction
  Can access all\* of the WebExtensions API
  Can access DOM APIs
  Cannot directly access pages

- Content Script
  Has direct and full access to all pages and the DOM
  Can run JavaScript in page, but in sandboxed runtime
  Can only use a subset of the WebExtensions API
  Subject to same restrictions as page (CORS, etc)
