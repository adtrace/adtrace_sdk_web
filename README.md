## Summary

This is the guide to the Javascript SDK of Adtrace™ for web sites or web apps. You can read more about Adtrace™ at [adtrace.io].

Read this in other languages: [English][en-readme], [Persian][fa-readme]

`(SDK ONLY)`: indicates features which are only implemented in client sdk and are not functional at the moment!

## Table of contents

* [Example apps](#example-app)
* [Installation](#installation)
* [Initialization](#initialization)
* [Event tracking](#event-tracking)
* [Global callback parameters](#global-callback-parameters)
* [Offline/Online mode](#offline-online-mode)
* [Stop/Restart SDK](#stop-restart-sdk)
* [GDPR Forget Me](#gdpr-forget-me)
* [Marketing Opt-out](#marketing-opt-out)
* [Data residency](#data-residency)
* [License](#license)

## <a id="example-app">Example apps</a>

You can check how our SDK can be used in the web app by checking [example apps][example-apps] or [demo app][demo-app] in this repository.

## <a id="installation">Installation</a>

This SDK can be used to track installs, sessions and events. Simply add the Adtrace Web SDK to your web app.

Our SDK is exposed under all module definitions, so it works under CommonJS and AMD environments and is also available through global `Adtrace` when imported through script tag in HTML.

To load the Adtrace Web SDK paste the following snippet into the `<head>` tag:
```html
<script type="application/javascript" src="./dist/adtrace-latest.min.js"></script>
```

The Adtrace Web SDK should be loaded only once per page and it should be initiated once per page load.

It's also possible to install our sdk through NPM:

```
npm install web-adtrace --save
```
and import that :
```
import Adtrace from "web-adtrace"
```

## <a id="initialization">Initialization</a>

In order to initialize the Adtrace Web SDK you must call the `Adtrace.initSdk` method as soon as possible:

```js
Adtrace.initSdk({
  appToken: 'YOUR_APP_TOKEN',
  environment: 'production'
});
```
> **Important**: For proper attribution method [setReferrer](#set-referrer) should be called as close as possible to SDK initialization.


Here is the full list of available parameters for the `initSdk` method:

### Mandatory params

<a id="app-token">**appToken**</a> `string`

Initialization method requires this parameter, so make sure to provide valid app token

<a id="environment">**environment**</a> `string` 

This param is also mandatory. Available options are `production` or `sandbox`. Use `sandbox` in case you are testing the SDK locally with your web app

### Optional params
 
<a id="attribution-callback">**attributionCallback**</a> `function`

This param accepts function, and it's a callback function for the attribution change. Two arguments are provided to the callback, first one is an internal event name (can be ignored), and the other one is the object which holds information about the changed attribution

Example:
```js
Adtrace.initSdk({
  // ... other params go here, including mandatory ones
  attributionCallback: function (e, attribution) {
    // e: internal event name, can be ignored
    // attribution: details about the changed attribution
  }
});
```

<a id="default-tracker">**defaultTracker**</a> `string`

By default, users who are not attributed to any campaigns will be attributed to the Organic tracker of the app. If you want to overwrite this behaviour and attributed this type of traffic under a different tracker, you can use this method to set a different default tracker.

<a id="custom-url">**customUrl**</a> `string`

By default all requests go to adtrace's endpoints. You are able to redirect all requests to your custom endpoint 

<a id="event-deduplication-list-limit">**eventDeduplicationListLimit**</a> `number`

By default this param is set to `10`. It is possible to override this limit but make sure that it is a positive number and not too big. This will cache last `n` deduplication ids (defined by this param) and use them to deduplicate events with repeating ids

<a id="log-level">**logLevel**</a> `string`

By default this param is set to `error`. Possible values are `none`, `error`, `warning`, `info`, `verbose`. We highly recommend that you use `verbose` when testing in order to see precise logs and to make sure integration is done properly.
Here are more details about each log level:
- `verbose` - will print detailed messages in case of certain actions
- `info` - will print only basic info messages, warnings and errors
- `warning` - will print only warning and error messages
- `error` - will print only error message
- `none` - won't print anything

<a id="log-output">**logOutput**</a> `string`

It's possible to define html container where you want to see your logs. This is useful when testing on mobile devices and when you want to see logs directly on the screen (recommended only for testing)

<a id="namespace">**namespace**</a> `string`

A custom namespace for SDK data storage. If there are multiple applications on the same domain to allow SDK distinguish storages and don't mix the data up each application should use it's own namespace.

Please note it's possible to set custom namespace for existing storage with default name, all data will be preserved and moved to the custom namespace. Once custom namespace is set it's not possible to rename it without data loss.

<a id="set-external-device-id">**externalDeviceId** `(ONLY SDK)`</a> `string`

An external device identifier is a custom value that you can assign to a device or user. They can help you to recognize users across sessions and platforms. They can also help you to deduplicate installs by user so that a user isn't counted as multiple new installs.

You can also use an external device ID as a custom identifier for a device. This can be useful if you use these identifiers elsewhere and want to keep continuity.

```js
Adtrace.initSdk({
  // other initialisation options go here
  externalDeviceId: 'YOUR_EXTERNAL_DEVICE_ID', // optional
});
```

> **Important**: You need to make sure this ID is **unique to the user or device** depending on your use-case. Using the same ID across different users or devices could lead to duplicated data. Talk to your Adtrace representative for more information.

If you want to use the external device ID in your business analytics, you can pass it as a callback parameter. See the section on [global callback parameters](#global-callback-parameters) for more information.

## <a id="event-tracking">Event tracking</a>

You can use adtrace to track events. Lets say you want to track every tap on a particular button. You would create a new event token in your [panel], which has an associated event token - looking something like `abc123`. In order to track this event from your web app, you should do following:

```js
Adtrace.trackEvent({
  eventToken: 'YOUR_EVENT_TOKEN'
})
```

Make sure to track event only after you [initialize](#initialization) the Adtrace SDK.
Here is the full list of available parameters for the `trackEvent` method:

### Mandatory params

<a id="event-token">**eventToken**</a> `string`

Track event method requires this parameter, make sure to provide valid event token

### Optional params

<a id="revenue">**revenue**</a> `number`

In case you want to attach revenue to an event (for example you would like to track some purchase that happened inside your web app) then you need to provide positive value for this param. It's also mandatory to provide [`currency`](#currency) param described in the next block

<a id="currency">**currency**</a> `string`

You need to provide this param if you want to track revenue event. Please use valid currency code like `IRR`, `USD` and so on

Example:

```js
Adtrace.trackEvent({
  // ... other params go here, including mandatory ones
  revenue: 10,
  currency: 'USD'
})
```

<a id="callback-params">**callbackParams**</a> `array`

You can register a callback URL for your events in your [panel]. We will send a GET request to that URL whenever the event is tracked. You can add callback parameters to that event by adding `callbackParams` parameter to the map object passed to `trackEvent` method. We will then append these parameters to your callback URL.

```js
Adtrace.trackEvent({
  // ... other params go here, including mandatory ones
  callbackParams: [
    {key: 'key', value: 'value'}, 
    {key: 'foo', value: 'bar'}
  ]
})
```

In that case we would track the event and send a request to:

    https://www.mydomain.com/callback?key=value&foo=bar

Please note that we don't store any of your custom parameters, but only append them to your callbacks, thus without a callback they will not be saved nor sent to you.

You can read more about using URL callbacks, including a full list of available values, in our [callbacks guide][callbacks-guide].
<a id="partner-params">**partnerParams** `(SDK ONLY)`</a> `array`

You can also add parameters to be transmitted to network partners, which have been activated in your Adtrace dashboard.
This works similarly to the callback parameters mentioned above, but can be added by adding `partnerParams` parameter to the map object passed to `trackEvent` method:

```js
Adtrace.trackEvent({
  // ... other params go here, including mandatory ones
  partnerParams: [
    {key: 'key', value: 'value'}, 
    {key: 'foo', value: 'bar'}
  ]
})
```

You can read more about special partners and these integrations in our [guide to special partners][special-partners].

<a id="value-params">**valueParams**</a> `array`

You can also add parameters to be transmitted to network values, which have been activated in your Adtrace panel.
This works similarly to the callback parameters mentioned above, but can be added by adding `valueParams` parameter to the map object passed to `trackEvent` method:

```js
Adtrace.trackEvent({
  // ... other params go here, including mandatory ones
  valueParams: [
    {key: 'key', value: 'value'}, 
    {key: 'foo', value: 'bar'}
  ]
})
```

You can read more about special values and these integrations in our [guide to special values][special-values].

<a id="deduplication-id">**deduplicationId**</a> `string`

It's possible to provide event deduplication id in order to avoid tracking duplicated events. Deduplication list limit is set in initialization configuration as described [above](#event-deduplication-list-limit)

### Tracking an event and redirect to an external page

Sometimes you want to redirect user to an external page and track this redirect as an event. For this case to avoid redirect to happen earlier than the event was actually tracked `trackEvent` method returns a `Promise` which is fulfilled after the SDK has sent the event and received a response from the backend and rejected when some internal error happen.  

> **Important** It might take pretty much time until this promise is settled so it's recommended to use a timeout.

Please note that due to internal requests queue the event wouldn't be lost even if it timed out or an error happened, the SDK will preserve the event to the next time it's loaded and try to send it again.

Example:

```js
Promise
  .race([
    Adtrace.trackEvent({
      eventToken: 'YOUR_EVENT_TOKEN',
      // ... other event parameters
    }),
    new Promise((resolve, reject) => {
      setTimeout(() => reject('Timed out'), 2000)
    })
  ])
  .catch(error => {
    // ... 
  })
  .then(() => {
    // ... perform redirect, for example 
    window.location.href = "https://www.example.org/"
  });
```

## <a id="global-callback-parameters">Global callback parameters</a>

There are several methods available for global callback parameters like adding, removing and clearing them. Here is the list of each available method:

<a id="add-global-callback-parameters">**addGlobalCallbackParameters**</a>

It's possible to add global callback parameters, which will be appended automatically to each session and event request. Note that callback params passed directly to `trackEvent` method will override existing global callback params. This method accepts an `array` is the same format as for [`callbackParams`](#callback-params) parameter from `trackEvent` method

Example:

```js
Adtrace.addGlobalCallbackParameters([
  {key: 'key1', value: 'value1'},
  {key: 'key2', value: 'value2'}
]);
```

<a id="remove-global-callback-parameter">**removeGlobalCallbackParameter**</a>

To remove particular callback parameter use this method by providing the key of a global callback param which needs to be removed

Example:

```js
Adtrace.removeGlobalCallbackParameter('key1');
```

<a id="clear-global-callback-parameters">**clearGlobalCallbackParameters**</a>

In order to clear all global callback parameters simply call this method

Example:

```js
Adtrace.clearGlobalCallbackParameters();
```

## <a id="global-partner-parameters">Global partner parameters</a>

It's possible to add, remove and clear global partner parameters in the similar way as for [global callback parameters](#global-callback-parameters). Here is the list of each available method:


<a id="add-global-parnter-parameters">**addGlobalPartnerParameters**</a>

It's possible to add global partner parameters, which will be appended automatically to each session and event request. Note that partner params passed directly to `trackEvent` method will override existing global partner params. This method accepts an `array` is the same format as for [`partnerParams`](#partner-params) parameter from `trackEvent` method

Example:

```js
Adtrace.addGlobalPartnerParameters([
  {key: 'key1', value: 'value1'},
  {key: 'key2', value: 'value2'}
]);
```

<a id="remove-global-partner-parameter">**removeGlobalPartnerParameter**</a>

To remove particular partner parameter use this method by providing the key of a global partner param which needs to be removed

Example:

```js
Adtrace.removeGlobalPartnerParameter('key1');
```

<a id="clear-global-partner-parameters">**clearGlobalPartnerParameters**</a>

In order to clear all global partner parameters simply call this method

Example:

```js
Adtrace.clearGlobalPartnerParameters();
```

## <a id="offline-online-mode">Offline/Online mode</a>

By default when initiated Adtrace SDK is always in online mode. But you can put it into offline mode if you want to pause all network requests such as tracking events and sessions (although initial session will ignore this mode and will be sent anyway).
There are two methods available to swich on and off the offline mode:

<a id="switch-to-offline-mode">**switchToOfflineMode**</a>

This method will put the Adtrace SDK into offline mode

Example:

```js
Adtrace.switchToOfflineMode();
```

<a id="switch-back-to-online-mode">**switchBackToOnlineMode**</a>

This method will put the Adtrace SDK back to online mode

```js
Adtrace.switchBackToOnlineMode();
```

## <a id="stop-restart-sdk">Stop/Restart SDK</a>

It's possible to completely stop the SDK from running in certain situations. 
This means that SDK will stop tracking sessions and events and in general will stop working entirely.
But it's possible to restart it after some time. Here are available methods for this functionality:

<a id="stop">**stop**</a>

This will stop running Adtrace SDK

Example:

```js
Adtrace.stop();
``` 

<a id="restart">**restart**</a>

This will restart Adtrace SDK

Example:

```js
Adtrace.restart();
``` 


## <a id="gdpr-forget-me">GDPR Forget Me `(SDK ONLY)`</a>

There is functionality available to GDPR Forget particular user. This will notify our backend behind the scene and will stop Adtrace SDK from running. 
There is one method available for this:

<a id="gdpr-forge-me">**gdprForgetMe**</a>

This method will stop Adtrace SDK from running and will notify Adtrace backend that user wants to be GDPR forgotten.
Once this method is run it's not possible to restart Adtrace SDK anymore.

Example:

```js
Adtrace.gdprForgetMe();
```

## <a id="marketing-opt-out">Marketing Opt-out `(SDK ONLY)`</a>

There is functionality for the Marketing Opt-out, which is disabling third-party sharing ability. This will notify our backed in the same manner as it does for GDPR Forget me.

There is one method available for this:

<a id="disable-third-party-sharing">**disableThirdPartySharing** `(SDK ONLY)`</a>

Example:

```js
Adtrace.disableThirdPartySharing();
```

## <a id="getters-web-uuid">Get `web_uuid`</a>

To identify unique web users in Adtrace, Web SDK generates an ID known as `web_uuid` whenever it tracks first session. The ID is created per subdomain and per browser.
The identifier follows the Universally Unique Identifier (UUID) format.

To get `web_uuid` use the following method: 

<a id="get-web-uuid">**getWebUUID**</a>

Example:

```js
const webUUID = Adtrace.getWebUUID();
```

## <a id="getters-attribution">User attribution</a>

You can access your user's current attribution information by using the following method:

<a id="get-attribution">**getAttribution**</a>

Example:

```js
const attribution = Adtrace.getAttribution();
```

> **Note** Current attribution information is only available after our backend tracks the app install and triggers the attribution callback.
It is not possible to access a user's attribution value before the SDK has been initialized and the attribution callback has been triggered.

## <a id="set-referrer">Setting `referrer`</a>

You may want to set `referrer` to trigger `sdk_click` manually.

To set `referrer` use the following method: 

<a id="set-referrer-manually">**setReferrer**</a>

Example:

```js
Adtrace.setReferrer("adtrace_external_click_id%3DEXTERNAL_CLICK_ID");
```

Please note that `referrer` should be properly URL-encoded.

> **Important** For proper attribution this method should be called as close as possible to SDK initialization.

## <a id="data-residency">Data residency `(SDK ONLY)`</a>

The data residency feature allows you to choose the country in which Adtrace stores your data. This is useful if you are operating in a country with strict privacy requirements. When you set up data residency, Adtrace stores your data in a data center located in the region your have chosen.

To set your country of data residency, pass a `dataResidency` argument in your `initSdk` call.

```js
Adtrace.initSdk({
  "appToken": "YOUR_APP_TOKEN",
  "environment": "production",
  "logLevel": "verbose",
  "dataResidency": "EU"
})
```

The following values are accepted:

- `EU` – sets the data residency region to the EU.
- `TR` – sets the data residency region to Turkey.
- `US` – sets the data residency region to the USA.


[adtrace.io]:   https://adtrace.io
[dashboard]:    https://panel.adtrace.io
[example-apps]:  https://github.com/adtrace/Adtrace-web-frameworks-examples
[demo-app]: src/demo.html
[sri-mdn]:      https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity

[en-readme]:  README.md
[fa-readme]:  docs/persian/README.md
