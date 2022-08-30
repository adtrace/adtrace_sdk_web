##  خلاصه 

این راهنمای  SDK جاوااسکریپت ادتریس برای وب سایت ها یا برنامه های وب است. می توانید اطلاعات بیشتری در مورد ادتریس را در وبسایت adtrace.io بخوانید.

این مطلب را به زبان های دیگر بخوانید: [انگلیسی][en-readme], [فارسی][fa-readme]

## فهرست مطالب 

* [اپلیکیشن مثال](#example-app)
* [نصب و راه‌اندازی](#installation)
* [مقداردهی اولیه](#initialization)
* [ردیابی رویداد](#event-tracking)
* [پارامتر های سراسری کالبک](#global-callback-parameters)
* [پارامتر های سراسری پارتنر](#global-value-parameters)
* [حالت آفلاین / آنلاین](#offline-online-mode)
* [توقف / راه‌اندازی مجدد SDK](#stop-restart-sdk)


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

شما می توانید از ادتریس برای ردیابی رویدادها استفاده کنید. بیایید بگوییم که می خواهید هر ضربه روی یک دکمه خاص را ردیابی کنید. شما می‌توانید یک نشانه رویداد جدید در [پنل][panel] خود ایجاد کنید که دارای یک نشانه رویداد مرتبط است - چیزی شبیه «abc123». 

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
  revenue: 10000,
  currency: "IRR"
})
```

<a id="callback-params">**callbackParams**</a> `array`

شما می‌توانید یک callback URL برای رویدادهای خود در [پنل][panel] خود ثبت کنید. هر زمان که رویدادی ردیابی شود، یک درخواست GET به آن URL ارسال می کنیم. شما می‌توانید با افزودن پارامتر «callbackParams» به آبجکت ارسال شده به متد «trackEvent»، پارامترهای callback URL را به آن رویداد اضافه کنید. سپس این پارامترها به callback URL شما اضافه خواهد شد.

 برای مثال، فرض کنید URL
 «https://www.mydomain.com/callback»
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

<a id="value-params">**valueParams**</a> `array`

همچنین می توانید پارامترهایی را برای انتقال به network values اضافه کنید که در داشبورد Adtrace شما فعال شده اند.
این به طور مشابه با callback parameters ذکر شده در بالا عمل می کند، اما می توان با افزودن پارامتر «valueParams» به آبجکت ارسال شده به متد «trackEvent» اضافه کرد:

```js
Adtrace.trackEvent({
  // ... other params go here, including mandatory ones
  valueParams: [
    {key: 'key', value: 'value'}, 
    {key: 'foo', value: 'bar'}
  ]
})
```

## <a id="global-callback-parameters">Global callback parameters</a>

چندین روش برای پارامترهای پاسخ به تماس سراسری مانند افزودن، حذف و پاک کردن آنها وجود دارد. در اینجا لیستی از هر روش موجود است:

<a id="add-global-callback-parameters">**addGlobalCallbackParameters**</a>

امکان افزودن callback parameters سراری وجود دارد که به طور خودکار به هر  درخواست سشن و  رویداد اضافه می شود. توجه داشته باشید که callback params مستقیماً به متد «TrackEvent» ارسال می‌شوند، callback params سراسری موجود را لغو می‌کنند. این متد یک «آرایه» با همان قالب پارامتر ['callbackParams'] (#callback-params) از متد «trackEvent» را می‌پذیرد.

مثال:

```js
Adtrace.addGlobalCallbackParameters([
  {key: 'key1', value: 'value1'},
  {key: 'key2', value: 'value2'}
]);
```

<a id="remove-global-callback-parameter">**removeGlobalCallbackParameter**</a>

برای حذف callback parameter جزیی، از این متد با ارائه کلید یک global callback param که باید حذف شود، استفاده کنید

مثال:

```js
Adtrace.removeGlobalCallbackParameter('key1');
```

<a id="clear-global-callback-parameters">**clearGlobalCallbackParameters**</a>

به منظور پاک کردن تمام پارامترهای پاسخ به تماس سراسری، به سادگی این روش را فراخوانی کنید

مثال:

```js
Adtrace.clearGlobalCallbackParameters();
```

## <a id="global-value-parameters">Global value parameters</a>

<a id="add-global-parnter-parameters">**addGlobalValueParameters**</a>

این امکان وجود دارد که value parameters  سراسری را اضافه کنید، که به طور خودکار به هر درخواست سشن و رویداد اضافه می شود. توجه داشته باشید که value parameter هایی که مستقیماً به متد "trackEvent" ارسال می شوند،global value parameter های موجود را لغو می کنند. این متد یک «آرایه» را با همان قالب پارامتر [«valueParams»](#value-params) از متد «trackEvent» می‌پذیرد.

مثال:

```js
Adtrace.addGlobalValueParameters([
  {key: 'key1', value: 'value1'},
  {key: 'key2', value: 'value2'}
]);
```

<a id="remove-global-value-parameter">**removeGlobalValueParameter**</a>
برای حذف callback parameter  جزیی، از این متد با ارائه کلید یک callback param سراسری که باید حذف شود، استفاده کنید

مثال:

```js
Adtrace.removeGlobalValueParameter('key1');
```

<a id="clear-global-value-parameters">**clearGlobalValueParameters**</a>

برای پاک کردن تمام value parameters سراسری، به سادگی این روش را فراخوانی کنید

مثال:

```js
Adtrace.clearGlobalValueParameters();
```

## <a id="offline-online-mode">Offline/Online mode</a>

به طور پیش فرض زمانی که SDK ادتریس شروع می شود همیشه در حالت آنلاین است. اما اگر می‌خواهید تمام درخواست‌های شبکه را متوقف کنید، می‌توانید آن را در حالت آفلاین قرار دهید (اگرچه نشست اولیه این حالت را نادیده می‌گیرد و به هر حال ارسال خواهد شد).
دو روش برای روشن و خاموش کردن حالت آفلاین وجود دارد:

<a id="switch-to-offline-mode">**switchToOfflineMode**</a>

این روش SDK ادتریس را در حالت آفلاین قرار می دهد

مثال:

```js
Adtrace.switchToOfflineMode();
```

<a id="switch-back-to-online-mode">**switchBackToOnlineMode**</a>

این روش SDK ادتریس را به حالت آنلاین برمی گرداند

```js
Adtrace.switchBackToOnlineMode();
```

## <a id="stop-restart-sdk">Stop/Restart SDK</a>

در شرایط خاص می توان به طور کامل از اجرای SDK جلوگیری کرد.
این بدان معنی است که SDK ردیابی نشست‌ها و رویدادها را متوقف می کند و به طور کلی کار نمی کند.
اما امکان راه اندازی مجدد آن پس از مدتی وجود دارد. در اینجا متدهای های موجود برای این عملکرد وجود دارد:

<a id="stop">**stop**</a>

با این کار اجرای SDK ادتریس متوقف می شود

مثال:

```js
Adtrace.stop();
``` 

<a id="restart">**restart**</a>

با این کار SDK ادتریس مجددا راه‌اندازی می شود

مثال:

```js
Adtrace.restart();
```


[adtrace.io]:   https://adtrace.io
[panel]:    https://panel.adtrace.io
[example-app]:  src/demo.html


[en-readme]:  ../
[fa-readme]:  docs/persian/README.md

