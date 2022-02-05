##  خلاصه 

این راهنمای  SDK جاوااسکریپت ادتریس برای وب سایت ها یا برنامه های وب است. می توانید اطلاعات بیشتری در مورد ادتریس را در وبسایت adtrace.io بخوانید.

این مطلب را به زبان های دیگر بخوانید: [انگلیسی][en-readme], [فارسی][fa-readme]

## فهرست مطالب 

* [اپلیکیشن مثال](#example-app)
* [نصب و راه اندازی](#installation)
* [مقداردهی اولیه](#initialization)
* [ردیابی رویداد](#event-tracking)
* [پارامتر های سراسری  کالبک](#global-callback-parameters)
* [پارامتر های سراسری  پارتنر](#global-partner-parameters)
* [حالت آفلاین / آنلاین](#offline-online-mode)
* [توقف / راه اندازی مجدد SDK](#stop-restart-sdk)
* [GDPR مرا فراموش کن](#gdpr-forget-me)
* [انصراف از بازاریابی](#marketing-opt-out)
* [لایسنس](#license)

## <a id="example-app">اپلیکیشن مثال</a>

شما می‌توانید با بررسی برنامه مثال در [اینجا][example-app] بررسی کنید که چگونه SDK ما می‌تواند در برنامه وب استفاده شود.

## <a id="installation">نصب و راه اندازی</a>

این SDK را می توان برای ردیابی نصب‌ها، سشن‌ها و رویدادها استفاده کرد. به سادگی SDK وب ادتربس را به برنامه وب خود اضافه کنید.

SDK ادتریس تحت تمام تعاریف ماژول قرار دارد، بنابراین در محیط‌های CommonJS و AMD کار می‌کند و همچنین  در صورت وارد کردن از طریق تگ `script` در HTML از طریق  متغیر سراسری `Adtrace` در دسترس است.
  قبرای نصب SDK وب ادتربس قطعه کد زیر را در نگ `head` فایل  HTML جایگذاری کنید
```html
<script type="application/javascript" src="./dist/adtrace-latest.min.js"></script>
```

 SDK وب ادتربس باید فقط یک بار در هر صفحه بارگیری و راه‌اندازی شود.

همچنین امکان نصب sdk ما از طریق NPM وجود دارد:

```
npm install web-adtrace-test --save
```
و سپس آن را وارد کنید:
```
import Adtrace from "web-adtrace-test"
```

## <a id="initialization">مقداردهی اولیه</a>

برای بکارگیری SDK وب ادتریس باید هر چه زودتر مقداردهی اولیه را با فراخوانی متد `Adtrace.initSdk` انجام دهید:
```js
Adtrace.initSdk({
  appToken: 'YOUR_APP_TOKEN',
  environment: 'production'
});
```

در اینجا لیست کامل پارامترهای موجود برای متد `initSdk` آمده است:
### پارامترهای اجباری 

<a id="app-token">**appToken**</a> `string`

متد مقداردهی اولیه به این پارامتر نیاز دارد، بنابراین مطمئن شوید که `appToken` را صحیح وارد کنید.

<a id="environment">**environment**</a> `string`

این پارامتر نیز اجباری است. گزینه های موجود `production` یا `sandbox` هستند. در صورتی که در حال آزمایش SDK به صورت لوکال هستید، از sandbox استفاده کنید.

### پارامترهای اختیاری 

<a id="attribution-callback">**attributionCallback**</a> `function`

این پارامتر یک تابع  می پذیرد و آن یک تابع کالبک  برای تغییر attribution است. دو آرگومان به این تابع callback پاس داده می شود، اولی یک نام رویداد داخلی است (می توان آن را نادیده گرفت)، و دیگری آبجکتی است که اطلاعات مربوط به attribution تغییر یافته را در خود نگه می دارد.

مثال:
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

به طور پیش فرض، کاربرانی که به هیچ کمپین نسبت داده نمی شوند، به ترکر ارگانیک نسبت داده می شوند. اگر می خواهید این رفتار را بازنویسی کنید و این نوع ترافیک را به یک ترکر متفاوت نسبت دهید، می توانید از این پارامتر برای تغییر ترکر پیش فرض استفاده کنید.

<a id="custom-url">**customUrl**</a> `string`

به طور پیش فرض همه درخواست ها به endpoint های ادتریس می روند. شما می توانید تمام درخواست ها را به endpoint سفارشی خود ارسال کنید.

<a id="event-deduplication-list-limit">**eventDeduplicationListLimit**</a> `number`

به طور پیش‌فرض این پارامتر روی 10 تنظیم شده است. می‌توان این محدودیت را نادیده گرفت، اما مطمئن شوید که عددی مثبت است و خیلی بزرگ نیست. این پارامتر `n` شناسه کپی شده (تعریف شده توسط این پارامتر) را در حافظه پنهان نگه می دارد و از آنها برای کپی کردن رویدادها با شناسه های تکراری استفاده می کند.
<a id="log-level">**logLevel**</a> `string`

به طور پیش فرض این پارامتر روی `error` تنظیم شده است. مقادیر ممکن  `none`, `error`, `warning`, `info`, `verbose` هستند. ما به شدت توصیه می‌کنیم که هنگام تست کردن، برای مشاهده گزارش‌های دقیق و اطمینان از اینکه یکپارچه‌سازی به درستی انجام می‌شود، از `verbose` استفاده کنید. در اینجا جزئیات بیشتری در مورد هر سطح گزارش وجود دارد:

- `verbose` - در صورت انجام اقدامات خاص، پیام های دقیق را چاپ می کند
- `info` - فقط پیام های اطلاعات اولیه، `warning` و `error` را چاپ می کند
- `warning` - فقط پیام های `warning` و `error` را چاپ می کند
- `error` - فقط پیام `error` را چاپ می کند
- `none` - چیزی چاپ نمی شود

<a id="log-output">**logOutput**</a> `string`

خود را ببینید تعریف کنید. این در هنگام تست بر روی دستگاه های تلفن همراه و زمانی که می خواهید گزارش ها را مستقیماً روی صفحه مشاهده کنید مفید است (فقط برای تست توصیه می شود).

مثال:

```html
<div id="log"></div>
```

```js
Adtrace.initSdk({
  // other initialisation options go here
  logOutput: '#log', // optional
});
```


<a id="namespace">**namespace**</a> `string`

یک namespace سفارشی برای ذخیره سازی داده های SDK. اگر چندین برنامه در یک دامنه وجود داشته باشد به SDK اجازه می دهد تا حافظه های ذخیره سازی را متمایز کند و داده ها را با هم مخلوط نکند، هر برنامه باید از فضای نام خود استفاده کند.

لطفاً توجه داشته باشید که امکان تنظیم namespace برای فضای ذخیره سازی شده موجود با نام پیش فرض بدون از دست دادن داده وجود دارد. اما پس از تغییر namespace، تغییر نام آن بدون از دست دادن داده ممکن نیست.

<a id="set-external-device-id">**externalDeviceId**</a> `string`

شناسه دستگاه خارجی یک مقدار سفارشی است که می توانید به یک دستگاه یا کاربر اختصاص دهید. آنها می توانند به شما کمک کنند تا کاربران را در سشن‌ها و پلتفرم‌ها شناسایی کنید.
آنها همچنین می‌توانند به شما کمک کنند تا نصب‌های کاربر تکراری کاربر را تشخیص دهید تا یک کاربر به عنوان چندین نصب جدید حساب نشود.


```js
Adtrace.initSdk({
  // other initialisation options go here
  externalDeviceId: 'YOUR_EXTERNAL_DEVICE_ID', // optional
});
```

## <a id="event-tracking">ردیابی رویداد</a>

شما می توانید از ادتریس برای ردیابی رویدادها استفاده کنید. بیایید بگوییم که می خواهید هر ضربه روی یک دکمه خاص را ردیابی کنید. شما می‌توانید یک نشانه رویداد جدید در [پنل][dashboard] خود ایجاد کنید که دارای یک نشانه رویداد مرتبط است - چیزی شبیه «abc123». 

برای ردیابی این رویداد از برنامه وب خود، باید موارد زیر را انجام دهید:

```js
Adtrace.trackEvent({
  eventToken: 'YOUR_EVENT_TOKEN'
})
```

مطمئن شوید که ردیابی رویداد را فقط پس از[مقداردهی اولیه](#initialization) SDK ادتریس انجام دهید.
در اینجا لیست کامل پارامترهای موجود برای روش `trackEvent` آمده است:

### پارامترهای اجباری 

<a id="event-token">**eventToken**</a> `string`

متد `trackEvent` به این پارامتر نیاز دارد، مطمئن شوید که`eventToken` معتبری ارائه می‌کنید.

### پارامترهای اختیاری 

<a id="revenue">**revenue**</a> `number`


در صورتی که می‌خواهید درآمد را به یک رویداد اختصاص دهید (مثلاً می‌خواهید خریدی را که در داخل برنامه وب شما اتفاق افتاده است ردیابی کنید) باید ارزش مثبتی برای این پارامتر ارائه دهید. همچنین ارائه پارامتر [`currency`](#currency) که در بلوک بعدی توضیح داده شده است، الزامی است.

<a id="currency">**currency**</a> `string`

اگر می‌خواهید رویداد درآمد را ردیابی کنید، باید این پارامتر را ارائه دهید. لطفاً از کد ارز معتبر مانند "ًّIRR"، "USD" و غیره استفاده کنید

مثال:

```js
Adtrace.trackEvent({
  // ... other params go here, including mandatory ones
  revenue: 110,
  currency: 'EUR'
})
```

<a id="callback-params">**callbackParams**</a> `array`

شما می‌توانید یک callback URL برای رویدادهای خود در [پنل][dashboard] خود ثبت کنید. هر زمان که رویدادی ردیابی شود، یک درخواست GET به آن URL ارسال می کنیم. شما می‌توانید با افزودن پارامتر «callbackParams» به آبجکت ارسال شده به متد «trackEvent»، پارامترهای callback URL را به آن رویداد اضافه کنید. سپس این پارامترها به callback URL شما اضافه خواهد شد.

برای مثال، فرض کنید
URL «https://www.mydomain.com/callback»
را ثبت کرده‌اید، سپس رویدادی مانند این را ردیابی کنید:

```js
Adtrace.trackEvent({
  // ... other params go here, including mandatory ones
  callbackParams: [
    {key: 'key', value: 'value'}, 
    {key: 'foo', value: 'bar'}
  ]
})
```

در این صورت ما رویداد را ردیابی می کنیم و درخواستی را به آدرس زیر ارسال می کنیم:

https://www.mydomain.com/callback?key=value&foo=bar

لطفاً توجه داشته باشید که ما هیچ یک از پارامترهای سفارشی شما را ذخیره نمی‌کنیم، بلکه فقط آنها را به تماس‌های شما اضافه می‌کنیم، بنابراین بدون پاسخ به تماس، ذخیره نمی‌شوند و برای شما ارسال نمی‌شوند.

<a id="partner-params">**partnerParams**</a> `array`

You can also add parameters to be transmitted to network partners, which have been activated in your Adjust dashboard.
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

<a id="deduplication-id">**deduplicationId**</a> `string`

It's possible to provide event deduplication id in order to avoid tracking duplicated events. Deduplication list limit is set in initialization configuration as described [above](#event-deduplication-list-limit)

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

This will stop running Adjust SDK

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


## <a id="gdpr-forget-me">GDPR Forget Me</a>

There is functionality available to GDPR Forget particular user. This will notify our backend behind the scene and will stop Adjust SDK from running.
There is one method available for this:

<a id="gdpr-forge-me">**gdprForgetMe**</a>

This method will stop Adtrace SDK from running and will notify adtrace backend that user wants to be GDPR forgotten.
Once this method is run it's not possible to restart Adtrace SDK anymore.

Example:

```js
Adtrace.gdprForgetMe();
```

## <a id="marketing-opt-out">Marketing Opt-out</a>

There is functionality for the Marketing Opt-out, which is disabling third-party sharing ability. This will notify our backed in the same manner as it does for GDPR Forget me.

There is one method available for this:

<a id="disable-third-party-sharing">**disableThirdPartySharing**</a>

Example:

```js
Adtrace.disableThirdPartySharing();
```

## <a id="license">License</a>

MIT License

Copyright (c) 2022 Adtrace

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.


[adtrace.io]:   https://adtrace.io
[dashboard]:    https://panel.adtrace.io
[example-app]:  src/demo.html


[en-readme]:  README.md
[fa-readme]:  docs/persian/README.md

