<p align="center"><a href="https://adtrace.io" target="_blank" rel="noopener noreferrer"><img width="100" src="http://adtrace.io/fa/wp-content/uploads/2019/02/logo.png" alt="Adtrace logo"></a></p>

<p align="center">
  <a href='https://www.npmjs.com/package/web-adtrace'><img src='https://img.shields.io/npm/v/web-adtrace.svg'></a>
  <a href='https://opensource.org/licenses/MIT'><img src='https://img.shields.io/badge/License-MIT-green.svg'></a>
</p>

## Summary

This is the guide to the Javascript SDK of AdTrace™ for web. You can read more about AdTrace™ at [adtrace.io].

## Table of contents

* [Example app](#example-app)
* [Basic integration](#basic-integration)
   * [Recommendations](#recommendations)
   * [Basic setup](#basic-setup)
* [Additional features](#additional-features)
   * [Adtrace Identifier](#adtrace-id)
   * [Event tracking](#event-tracking)
      * [Revenue tracking](#revenue-tracking)
      * [Event value](#event-value)
      * [Callback parameters](#callback-parameters)
      * [Partner parameters](#partner-parameters)
   * [Stable local data](#stable-local-data)

## <a id="example-app"></a>Example app

By using the SDK to your web, you can check [example][example] for better help.

## <a id="basic-integration"></a>Basic integration

This SDK can be used to track installs, sessions and events. Simply add the `adtrace.js` to html:
```html
<script type="text/javascript" src="adtrace.min.js"></script>
```

Or if you are using `npm`, you can add it to your dependencies like this:

```
npm install web-adtrace
```

### <a id="recommendations"></a>Recommendations

There are two ways to differentiate users coming from native apps to users coming from web apps if you are not running ad campaigns for your web apps:

- Create new app(s) in your AdTrace dashboard for your web app, pick one of the supported platforms during the creation and use this app token in the AdTrace SDK to initialise it. As with your native apps, organic traffic from your app will then be labelled under the `Organic` tracker in your AdTrace dashboard.
- Use one of your pre-existing app and hardcode a pre-installed tracker token in the AdTrace SDK. All traffic from your app will then be labelled under the hardcoded tracker in your AdTrace dashboard.

### <a id="basic-setup"></a>Basic setup

There are a few things to keep in mind while implementing the JS SDK:

- The `unique_id` is An **unuique device identifier** such as `gps_adid` in Android, `idfa` in iOS or `win_adid` in Windows. If your app isn't able to access or pass those identifiers, you should pass a similary built UUID.

With this in mind, initialisation of AdTrace JS SDK would look like this inside your web app:

```js
var _adtrace = new AdTrace({
  app_token: 'YourAppToken',
  environment: 'production', // or 'sandbox' in case you are testing SDK locally with your web app
  unique_id: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' // each web app user needs to have unique identifier,
  default_tracker: 'Your non organic tracker' // optional
});

_adtrace.trackSession(function (result) {
    console.log(result);
  }, function (errorMsg, error) {
    console.log(errorMsg, error);
  }
);
```

**Note**: The `default_tracker` is an **optional** parameter for attributing data to the **non organic** trackers.

If it doesn't used, your data will attribiute in **organic tracker**.

## <a id="additional-features"></a>Additional features

Once you integrate the AdTrace JS SDK into your web, you can take advantage of the following features.

### <a id="adtrace-id"></a>Adtrace Identifier

When initializing of SDK complete, you can get **Adtrace Identifier**.

```js
var adtraceId = _adtrace.getAdId();
```

**Note**: If adtrace id equals `null`, that means the SDK is installing your data and will take a little time (under 10 seconds).

### <a id="event-tracking"></a>Event tracking

You can use adtrace to track events. Lets say you want to track every tap on a particular button. You would create a new event token in your [dashboard], which has an associated event token - looking something like `abc123`. In order to track this event from your web app, you should do following:

```js
var _eventConfig = {
  event_token: 'EventToken'
};

_adtrace.trackEvent(_eventConfig, function (result) {
  successCb(result, 'event');
}, function (errorMsg, error) {
  errorCb(errorMsg, error, 'event');
});
```

### <a id="event-value"></a>Event value

You can also add custom string value to event. You can set this value by adding `event_value` to your event config:

```js
var _eventConfig = {
  event_token: 'EventToken',
  event_value: 'my-value'
};

_adtrace.trackEvent(_eventConfig, function (result) {
  successCb(result, 'event');
}, function (errorMsg, error) {
  errorCb(errorMsg, error, 'event');
});
```

### <a id="revenue-tracking"></a>Revenue tracking

You can attach revenue to event being tracked with AdTrace JS SDK in case you would like to track some purchase that happened inside your web app. In order to that, you need to attach `revenue` and `currency` parameters when tracking event:

```js
var _eventConfig = {
  event_token: 'EventToken',
  revenue: 10,
  currency: 'EUR'
};

_adtrace.trackEvent(_eventConfig, function (result) {
  console.log(result);
}, function (errorMsg, error) {
  console.log(errorMsg, error);
});
```

When you set a currency token, adtrace will automatically convert the incoming revenues into a reporting revenue of your choice.

### <a id="callback-parameters"></a>Callback parameters

You can register a callback URL for your events in your [dashboard]. We will send a GET request to that URL whenever the event is tracked. You can add callback parameters to that event by adding `callback_params` parameter to the map object passed to `trackEvent` method. We will then append these parameters to your callback URL.

For example, suppose you have registered the URL `http://www.mydomain.com/callback` then track an event like this:

```js
var _eventConfig = {
  event_token: 'EventToken',
  callback_params: [{
    key: 'key',
    value: 'value'
  }, {
    key: 'foo',
    value: 'bar'
  }],
};

_adtrace.trackEvent(_eventConfig, function (result) {
  console.log(result);
}, function (errorMsg, error) {
  console.log(errorMsg, error);
});
```

In that case we would track the event and send a request to:

    http://www.mydomain.com/callback?key=value&foo=bar

It should be mentioned that we support a variety of placeholders like `{gps_adid}` that can be used as parameter values. In the resulting callback this placeholder would be replaced with the ID for Advertisers of the current device. Also note that we don't store any of your custom parameters, but only append them to your callbacks, thus without a callback they will not be saved nor sent to you.

### <a id="partner-parameters"></a>Partner parameters

You can also add parameters to be transmitted to network partners, which have been activated in your AdTrace dashboard.

This works similarly to the callback parameters mentioned above, but can be added by adding `partner_params` parameter to the map object passed to `trackEvent` method.

```js
var _eventConfig = {
  event_token: 'EventToken',
  partner_params: [{
    key: 'key',
    value: 'value'
  }, {
    key: 'foo',
    value: 'bar'
  }],
};

_adtrace.trackEvent(_eventConfig, function (result) {
  console.log(result);
}, function (errorMsg, error) {
  console.log(errorMsg, error);
});
```

### <a id="stable-local-data"></a>Stable local data

Because the unique device identifer & adtrace identifer saved in `localStorage`. If you want to `clear` the `localStorage` consider that to call **`stableLocalData` after `clear` method**  to save those identifiers in `localStorage`:

```js
localStorage.clear(); // clearing your own data
_adtrace.stableLocalData(); 
```

[adtrace.io]:     https://adtrace.io
[dashboard]:      https://adtrace.io
[example]:    example/
