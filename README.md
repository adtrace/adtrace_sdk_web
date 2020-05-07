English | [فارسی][per-readme]

<p align="center"><a href="https://adtrace.io" target="_blank" rel="noopener noreferrer"><img width="100" src="http://adtrace.io/fa/wp-content/uploads/2019/02/logo.png" alt="Adtrace logo"></a></p>

<p align="center">
  <a href='https://www.npmjs.com/package/web-adtrace'><img src='https://img.shields.io/npm/v/web-adtrace.svg'></a>
  <a href='https://opensource.org/licenses/MIT'><img src='https://img.shields.io/badge/License-MIT-green.svg'></a>
</p>

## Summary

This is the guide to the Javascript SDK of AdTrace™ for web. You can read more about AdTrace™ at [adtrace.io].

## Table of contents

### Quick start

* [Example app](#qs-example-app)
* [Getting started](#qs-getting-started)
   * [Add the SDK to your project](#qs-add-sdk)
* [Integrate the SDK into your website](#qs-integrate-sdk)
   * [Create unique ID](#qs-create-unique-id)
   * [Basic setup](#qs-basic-setup)
   * [Track session](#qs-track-session)

### Event tracking

   * [Track event](#et-event)
   * [Track revenue](#et-revenue)

### Custom parameters
   * [Custom parameters overview](#cp-overview)
   * [Event parameters](#cp-event)
      * [Event callback parameters](#cp-event-callback)
      * [Event partner parameters](#cp-event-partner)
      * [Event value](#cp-event-value)

### Additional features

   * [Adtrace Identifier](#af-adtrace-id)
   * [Default tracker](#af-default-tracker)
   * [Stable local data](#af-stable-local-data)

## Quick start

### <a id="qs-example-app"></a>Example app

There are example website inside the [`example` directory][example]. In there you can check how the AdTrace SDK can be integrated.

### <a id="qs-getting-started"></a>Getting started

These are the minimal steps required to integrate the AdTrace SDK into your website.

### <a id="qs-add-sdk"></a>Add the SDK to your project

This SDK can be used to track installs, sessions and events. Simply download the `adtrace.js` and add it to HTML:
```html
<script type="text/javascript" src="adtrace.min.js"></script>
```

Or if you are using `npm`, you can add it to your dependencies like this:

```
npm install web-adtrace
```

### <a id="qs-integrate-sdk"></a>Integrate the SDK into your website

To start with, we'll introduce some information about `unique_id`.
Then start basic integration.

### <a id="qs-create-unique-id"></a>Create unique ID

The `unique_id` is An **unuique device identifier** such as `gps_adid` in Android, `idfa` in iOS or `win_adid` in Windows. If your app isn't able to access or pass those identifiers, you should pass a similary built **UUID**.

For more information about creating UUID you can check [this solution](https://stackoverflow.com/a/2117523/4696843).

### <a id="qs-basic-setup"></a>Basic setup

With this in mind, initialisation of AdTrace JS SDK would look like this inside your web app:

```js
var adtrace = new AdTrace({
  app_token: '{YourAppToken}',
  environment: 'production', // or 'sandbox' in case you are testing SDK locally with your web app
  unique_id: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' // each web app user needs to have unique identifier
});
```

Replace `{YourAppToken}` with your app token. You can find this in your AdTrace panel.

Depending on whether you build your app for testing or for production, you must set the environment with one of these values:

```
production
sandbox
```

**Important**: This value should be set to `sandbox` if and only if you or someone else is testing your app. Make sure to set the environment to `production` just before you publish the app. Set it back to `sandbox` when you start developing and testing it again.

We use this environment to distinguish between real traffic and test traffic from test devices. It is very important that you keep this value meaningful at all times!

### <a id="qs-track-session"></a>Track session

After initializing AdTrace SDK, you are feel free to track user session's look like this:

```js
adtrace.trackSession(function (result) {
    console.log(result);
  }, function (errorMsg, error) {
    console.log(errorMsg, error);
  }
);
```

**Note**: First tracking session take a little bit more time, because AdTrace should attribute and installing user's data first of all;

## Event tracking

### <a id="et-event"></a>Track event

You can use adtrace to track events. Lets say you want to track every tap on a particular button. You would create a new event token in your [panel], which has an associated event token - looking something like `abc123`. In order to track this event from your web app, you should do following:

```js
var eventConfig = {
  event_token: 'EventToken'
};

adtrace.trackEvent(eventConfig, function (result) {
  console.log(result);
}, function (errorMsg, error) {
  console.log(errorMsg, error);
});
```

### <a id="et-revenue"></a>Track revenue

You can attach revenue to event being tracked with AdTrace JS SDK in case you would like to track some purchase that happened inside your web app. In order to that, you need to attach `revenue` and `currency` parameters when tracking event:

```js
var eventConfig = {
  event_token: 'EventToken',
  revenue: 10,
  currency: 'EUR'
};

adtrace.trackEvent(eventConfig, function (result) {
  console.log(result);
}, function (errorMsg, error) {
  console.log(errorMsg, error);
});
```

When you set a currency token, adtrace will automatically convert the incoming revenues into a reporting revenue of your choice.

## Custom parameters

### <a id="cp-overview"></a>Custom parameters overview

In addition to the data points that AdTrace SDK collects by default, you can use the AdTrace SDK to track and add to the event as many custom values as you need (user IDs, product IDs, etc.). Custom parameters are only available as raw data (i.e., they won't appear in the AdTrace panel).

You should use **callback parameters** for the values that you collect for your own internal use, and **partner parameters** for those that you wish to share with external partners. If a value (e.g. product ID) is tracked both for internal use and to forward it to external partners, the best practice would be to track it both as callback and partner parameters.

### <a id="cp-event"></a>Event parameters

### <a id="cp-event-callback"></a>Event callback parameters

You can register a callback URL for your events in your [panel]. We will send a GET request to that URL whenever the event is tracked. You can add callback parameters to that event by adding `callback_params` parameter to the map object passed to `trackEvent` method. We will then append these parameters to your callback URL.

For example, suppose you have registered the URL `http://www.mydomain.com/callback` then track an event like this:

```js
var eventConfig = {
  event_token: 'EventToken',
  callback_params: [{
    key: 'key',
    value: 'value'
  }, {
    key: 'foo',
    value: 'bar'
  }],
};

adtrace.trackEvent(eventConfig, function (result) {
  console.log(result);
}, function (errorMsg, error) {
  console.log(errorMsg, error);
});
```

In that case we would track the event and send a request to:

    http://www.mydomain.com/callback?key=value&foo=bar


### <a id="cp-event-partner"></a>Event partner parameters

You can also add parameters to be transmitted to network partners, which have been activated in your AdTrace panel.

This works similarly to the callback parameters mentioned above, but can be added by adding `partner_params` parameter to the map object passed to `trackEvent` method.

```js
var eventConfig = {
  event_token: 'EventToken',
  partner_params: [{
    key: 'key',
    value: 'value'
  }, {
    key: 'foo',
    value: 'bar'
  }],
};

adtrace.trackEvent(eventConfig, function (result) {
  console.log(result);
}, function (errorMsg, error) {
  console.log(errorMsg, error);
});
```

### <a id="cp-event-value"></a>Event value

You can also add custom string value to event. You can set this value by adding `event_value` to your event config:

```js
var eventConfig = {
  event_token: 'EventToken',
  event_value: 'my-value'
};

adtrace.trackEvent(eventConfig, function (result) {
  console.log(result);
}, function (errorMsg, error) {
  console.log(errorMsg, error);
});
```

## Additional features

Once you integrate the AdTrace JS SDK into your web, you can take advantage of the following features.

### <a id="af-adtrace-id"></a>Adtrace Identifier

When initializing of SDK complete, you can get **Adtrace Identifier**.

```js
var adtraceId = adtrace.getAdId();
```

**Note**: If adtrace id equals `null`, that means the SDK is installing your data and will take a little time (under 10 seconds).

### <a id="af-default-tracker"></a>Default tracker

The `default_tracker` is an **optional** parameter for attributing data to the **non organic** trackers.

```js
var adtrace = new AdTrace({
  app_token: '{YourAppToken}',
  environment: 'production', // or 'sandbox' in case you are testing SDK locally with your web app
  unique_id: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', // each web app user needs to have unique identifier
  default_tracker: 'Your non organic tracker' // optional
});
```

If it doesn't used, your data will attribiute in **organic tracker**.


### <a id="af-stable-local-data"></a>Stable local data

Because the unique device identifer & adtrace identifer saved in `localStorage`. If you want to `clear` the `localStorage` consider that to call **`stableLocalData` after `clear` method**  to save those identifiers in `localStorage`:

```js
localStorage.clear(); // clearing your own data
adtrace.stableLocalData(); 
```

[adtrace.io]:     https://adtrace.io
[panel]:      https://panel.adtrace.io
[example]:    example/
[per-readme]:  ./doc/persian/README-PER.md
