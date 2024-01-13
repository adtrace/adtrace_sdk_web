### Version 2.3.0 (Jan 2024)
#### Added
- Added `getWebUUID` method to access SDK generated ID `web_uuid`.
- Added `getAttribution` method to access user's current attribution information.
- Added Typescript support.
- Added `setReferrer` method to set referrer and trigger `/sdk_click` request manually.
- Added support of Data Residency.
- Added sending of `deduplication_id` parameter in `event` package.
- Added SmartBanner
- Added SRI feature support.

#### Fixed
- Fixed SDK state synchronization issue between multiple tabs.
- Fixed issue when Url Strategy ignored SDK config.
- Updated deprecated and vulnerable dependencies.
- Fixed issue with URL strategy retrying to send requests after SDK was disabled.
- Fixed top-level Typescript declarations.


### Version 2.2.0 (April 2023)
#### Added
- Added a return of Promise from `trackEvent` method.
- Added `setReferrer` method to set referrer and trigger `/sdk_click` request manually.
- Added support of Data Residency.
- Added sending of `deduplication_id` parameter in `event` package.
- Added SRI feature support.
- Added `getWebUUID` method to access SDK generated ID `web_uuid`.
- Added `getAttribution` method to access user's current attribution information.


#### Fixed
- Fixed SDK state synchronization issue between multiple tabs.
- Fixed issue which caused site not to load when cookies are blocked in browser.
- Updated deprecated and vulnerable dependencies.
---

### Version 2.1.1 (August 2022)
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
