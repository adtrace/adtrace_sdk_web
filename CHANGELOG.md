### Version 2.0.0 (1th August 2022)
#### Fixed
- Fixed top-level Typescript declarations.
- Added Typescript support.
- Added URL strategy with retries when request are being blocked by firewall.
- Added custom storage namespace.
- Fixed issue with using IndexedDb in cross-origin iframe in Safari.
- Added `warning` log level to make non-critical issues look less frightening.
- Fixed state synchronization issues between multiple tabs.
- Fixed issue with switching the SDK offline and online which could cause requests loss.
- Added external device ID support.
- Fixed SDK initialization in IE11.
- Added SDK exposure under all module definitions, so it works under **CommonJS** and **AMD** environments.
- Added attribution callback support.
- Added retry mechanism for failed attribution requests.
- Added HTTP request queueing with retry mechanism.
- Added usage of **indexedDB** with **localStorage** as a fallback.
- Added global callback and value parameters, along with removal of previously set ones.
- Added offline mode.
- Added possibility to set the log level on init and optionally specify log container.
- Added SDK stop and restart possibility.
- Added ability to define default tracker through configuration.
- Added traffic redirection possibility.
- Added event deduplication.


#### Changed
- Switched to using exposed single instance instead of initiating it manually with the `new` (`Adtrace.initSdk(YOUR_CONFIG)`).
- Automated session tracking, method `trackSession` is no longer available.
