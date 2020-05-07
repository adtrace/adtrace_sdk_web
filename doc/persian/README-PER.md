
<div dir="rtl" align='right'>فارسی | <a href="../../README.md">English</a></div>


<p align="center"><a href="https://adtrace.io" target="_blank" rel="noopener noreferrer"><img width="100" src="http://adtrace.io/fa/wp-content/uploads/2019/02/logo.png" alt="Adtrace logo"></a></p>

<p align="center">
  <a href='https://www.npmjs.com/package/web-adtrace'><img src='https://img.shields.io/npm/v/web-adtrace.svg'></a>
  <a href='https://opensource.org/licenses/MIT'><img src='https://img.shields.io/badge/License-MIT-green.svg'></a>
</p>

## <div dir="rtl" align='right'>خلاصه</div>

<div dir="rtl" align='right'>
SDK وب ادتریس. شما برای اطلاعات بیشتر میتوانید به <a href="adtrace.io">adtrace.io</a>  مراجعه کنید.
</div>

## <div dir="rtl" align='right'>فهرست محتوا</div>

### <div dir="rtl" align='right'>پیاده سازی فوری</div>

<div dir="rtl" align='right'>
<ul>
  <li><a href="#qs-example-app">برنامه نمونه</a></li>
  <li><a href="#qs-getting-started">شروع پیاده سازی</a></li>
	  <ul>
	    <li><a href="#qs-sdk-add">افزودن SDK به پروژه</a></li>
    </ul>
  <li><a href="#qs-integ-sdk">پیاده سازی SDK داخل وبسایت</a></li>
  <ul>
     <li><a href="#qs-create-unique-id">ساخت شناسه یکتا</a></li>
	  <li><a href="#qs-basic-setup">راه اندازی اولیه</a></li>
	  <li><a href="#qs-track-session">ردیابی نشست</a></li>
  </ul>
  </ul>
</div>

### <div dir="rtl" align='right'>ردیابی رویداد</div>

<div dir="rtl" align='right'>
<ul>
  <li><a href="#et-track-event">ردیابی رویداد معمولی</a></li>                 
  <li><a href="#et-track-revenue">ردیابی رویداد درآمدی</a></li>
</ul>
</div>

### <div dir="rtl" align='right'>پارامترهای سفارشی</div>

<div dir="rtl" align='right'>
<ul>
  <li><a href="#cp-overview">نمای کلی پارامترهای سفارشی</a></li>
  <li><a href="#cp-ep">پارامترهای رویداد</a>
    <ul>
      <li><a href="#cp-ep-callback">پارامترهای callback رویداد</a></li>                 
      <li><a href="#cp-ep-partner">پارامترهای partner رویداد</a></li>
      <li><a href="#cp-ep-value">مقدار رویداد</a></li>
    </ul>
  </li>                 
</ul>
</div>

### <div dir="rtl" align='right'>ویژگی های بیشتر</div>

<div dir="rtl" align='right'>
<ul>
  <li><a href="#af-adtrace-id">شناسه ادتریس</a></li> 
  <li><a href="#af-adtrace-id">ترکر پیشفرض</a></li> 
  <li><a href="#af-adtrace-id">پایدار ساختن داده های local</a></li> 
</ul>
</div>

## <div dir="rtl" align='right'>پیاده سازی فوری</div>

### <div id="qs-example-app" dir="rtl" align='right'>برنامه نمونه</div>

<div dir="rtl" align='right'>
درون <a href="/example">پوشه <code>نمونه</code></a> یک وبسایت نمونه وجود دارد که میتوانید بررسی کنید SDK ادتریس چگونه پیاده سازی شده است.
</div>

### <div id="qs-getting-started" dir="rtl" align='right'>شروع پیاده سازی</div>

<div dir="rtl" align='right'>
برای پیاده سازی SDK ادتریس قدم به قدم مراحل زیر را دنبال کنید.
</div>

### <div id="qs-sdk-add" dir="rtl" align='right'>افزودن SDK به پروژه</div>

<div dir="rtl" align='right'>
برای ردیابی نشست و رویداد، ابتدا فایل <code>adtrace.js</code> را دریافت نمایید سپس به کد HTML به صورت زیر اضافه نمایید:
</div>
<br/>

```html
<script type="text/javascript" src="adtrace.min.js"></script>
```

<br/>
<div dir="rtl" align='right'>
یا اگر مایل هستید از طریق <code>npm</code> به dependency خود اضافه نمایید:
</div>

```
npm install web-adtrace
```

### <div id="qs-integ-sdk" dir="rtl" align='right'>پیاده سازی SDK داخل وبسایت</div>

<div dir="rtl" align='right'>
ابتدا به معرفی و توضیح مختصری درباره <code>unique_id</code> پرداخته و سپس پیاده سازی را آغاز میکنیم.
</div>

### <div id="qs-create-unique-id" dir="rtl" align='right'>ساخت شناسه یکتا</div>

<div dir="rtl" align='right'>
<code>unique_id</code> یک <strong>شناسه یکتا برای دستگاه</strong> میباشد که همانند <code>idfa</code> در iOS یا <code>gps_adid</code> در اندروید و یا <code>win_adid</code> در ویندوز میباشد. اگر برنامه شما نمیتواند آن شناسه ها را به کد جاوا اسکریپ شما ارسال نماید شما بایستی دستی این شناسه را طبق الگو <strong>UUID</strong> بسازید.
</div>
<br/>
<div dir="rtl" align='right'>
برای اطلاعات بیشتر درمورد نحوه ساخت UUID میتوانید به <a href="https://stackoverflow.com/a/2117523/4696843">این آموزش</a> مراجعه کنید.
</div>

### <div id="qs-basic-setup" dir="rtl" align='right'>راه اندازی اولیه</div>

<div dir="rtl" align='right'>
باید درنظر بگیرید که راه اندازی SDK ادتریس باید به شکل زیر باشد:
</div>
<br/>

```js
var adtrace = new AdTrace({
  app_token: '{YourAppToken}',
  environment: 'production', // or 'sandbox' in case you are testing SDK locally with your web app
  unique_id: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' // each web app user needs to have unique identifier,
});

adtrace.trackSession(function (result) {
    console.log(result);
  }, function (errorMsg, error) {
    console.log(errorMsg, error);
  }
);
```

<br/>
<div dir="rtl" align='right'>
مقدار <code>{YourAppToken}</code> را با توکن اپ خود جایگزین نمایید. این مقدار را درون پنل ادتریس خود میتوانید مشاهده کنید.
</div>
<br/>
<div dir="rtl" align='right'>
وابسته به نوع خروجی اپ شما که درحالت تست یا تجاری میباشد، بایستی مقدار <code>environment</code> را یکی از مقادیر زیر انتخاب نمایید:
</div>
<br/>

```
sandbox
production
```

<br/>
<div dir="rtl" align='right'>
<strong>نکته:</strong> این مقدار تنها در زمان تست برنامه شما بایستی مقدار <code> sandbox</code> قرار بگیرد. این پارامتر را به <code>production</code> قبل از انتشار برنامه خود تغییر دهید.
</div>
<br/>
<div dir="rtl" align='right'>
ادتریس enviroment را برای تفکیک ترافیک داده واقعی و آزمایشی بکار میبرد.
</div>

### <div id="qs-track-session" dir="rtl" align='right'>ردیابی نشست</div>

<div dir="rtl" align='right'>
بعد از راه اندازی اولیه SDK ادتریس، میتوانید نشست های کاربر را به شکل زیر رصد نمایید:
</div>
<br/>

```js
adtrace.trackSession(function (result) {
    console.log(result);
  }, function (errorMsg, error) {
    console.log(errorMsg, error);
  }
);
```

<br/>
<div dir="rtl" align='right'>
<strong>نکته</strong>: رصد کردن نشست اولیه یک مقداری زمان بیشتری میبرد، دلیل آن هم اتریبیوت و ارسال داده های نصب قبل آن میباشد.
</div>

## <div dir="rtl" align='right'>ردیابی رویداد</div>

### <div id="et-track-event" dir="rtl" align='right'>ردیابی رویداد معمولی</div>

<div dir="rtl" align='right'>
شما برای یک رویداد میتوانید از انواع رویدادها درون برنامه خود استفاده کنید. فرض کنید که میخواهید لمس یک دکمه را رصد کنید. بایستی ابتدا یک رویداد درون پنل خود ایجاد کنید. اگر فرض کنیم که توکن رویداد شما <code>abc123</code> باشد، سپس در قسمت کلیک کردن دکمه مربوطه کد زیر را برای ردیابی لمس دکمه اضافه کنید:
</div>
<br/>

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

### <div id="et-track-revenue" dir="rtl" align='right'>ردیابی رویداد درآمدی</div>

<div dir="rtl" align='right'>
اگر کاربران شما از طریق کلیک بر روی تبلیغات یا پرداخت درون برنامه ای، رویدادی میتوانند ایجاد کنند، شما میتوانید آن درآمد را از طریق رویدادی مشخص رصد کنید. اگر فرض کنیم که یک ضربه به ارزش 10 واحد یورو باشد، کد شما برای ردیابی این رویداد بایستی دو مقدار <code>revenue</code> و <code>currency</code> را اضافه نمایید که به صورت زیر میباشد:
</div>
<br/>

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

<br/>
<div dir="rtl" align='right'>
این ویژگی میتواند با پارامترهای callback نیز ترکیب شود.
</div>
<br/>
<div dir="rtl" align='right'>
هنگامی که واحد پول را تنظیم کردید، ادتریس به صورت خودکار درآمدهای ورودی را به صورت خودکار به انتخاب شما تبدیل میکند.
</div>

## <div dir="rtl" align='right'>پارامترهای سفارشی</div>

### <div id="cp-overview" dir="rtl" align='right'>نمای کلی پارامترهای سفارشی</div>

<div dir="rtl" align='right'>
علاوه بر داده هایی که SDK ادتریس به صورت خودکار جمع آوری میکند، شما از ادتریس میتوانید مقدارهای سفارشی زیادی را با توجه به نیاز خود (شناسه کاربر، شناسه محصول و ...) به رویداد خود اضافه کنید. پارامترهای سفارشی تنها به صورت خام و export شده قابل دسترسی میباشد و در پنل ادتریس قابل نمایش <strong>نمیباشد</strong>.</div> 
<br/>
<div dir="rtl" align='right'>
شما از <strong>پارامترهای callback</strong> برای استفاده داخلی خود بکار میبرید و از <strong>پارامترهای partner</strong> برای به اشتراک گذاری به شریکان خارج از برنامه استفاده میکنید. اگر یک مقدار (مثل شناسه محصول) برای خود و شریکان خارجی استفاده میشود، ما پیشنهاد میکنیم که از هر دو پارامتر partner و callback استفاده کنید.
</div>

### <div id="cp-ep" dir="rtl" align='right'>پارامترهای رویداد</div>

### <div id="cp-ep-callback" dir="rtl" align='right'>پارامترهای callback رویداد</div>

<div dir="rtl" align='right'>
شما میتوانید یک آدرس callback برای رویداد خود داخل پنل اضافه کنید. ادرتیس یک درخواست GET به آن آدرسی که اضافه نموده اید، ارسال خواهد کرد. همچنین پارامترهای callback برای آن رویداد را از طریق افزودن <code>callback_params</code> برای آن رویداد قبل از ترک آن استفاده کنید. ما این پارامترها را به آخر آدرس callback شما اضافه خواهیم کرد.
</div>
<br/>
<div dir="rtl" align='right'>
به عنوان مثال اگر شما آدرس <code>http://www.example.com/callback</code> را به رویداد خود اضافه نموده اید، ردیابی رویداد به صورت زیر خواهد بود:
</div>
<br/>

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

<br/>
<div dir="rtl" align='right'>
در اینصورت ما رویداد شما را رصد خواهیم کرد و یک درخواست به صورت زیر ارسال خواهیم کرد:
</div>
<br/>

```
http://www.example.com/callback?key=value&foo=bar
```

### <div id="cp-ep-partner" dir="rtl" align='right'>پارامترهای partner رویداد</div>

<div dir="rtl" align='right'>
شما همچنین پارامترهایی را برای شریکان خود تنظیم کنید که درون پنل ادتریس فعالسازی میشود.
</div>
<br/>
<div dir="rtl" align='right'>
این پارامترها به صورت callback که در بالا مشاهده میکنید استفاده میشود، فقط از طریق اضافه نمودن <code>partner_params</code> قابل استفاده است.
</div>
<br/>

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

### <div id="cp-ep-value" dir="rtl" align='right'>مقدار رویداد</div>

<div dir="rtl" align='right'>
شما همچنین یک رشته دلخواه به رویداد خود میتوانید اضافه کنید. این مقدار از طریق افزودن<code>event_value</code> قابل استفاده است:
</div>
<br/>

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

## <div dir="rtl" align='right'>ویژگی های بیشتر</div>

<div dir="rtl" align='right'>
هنگامی که شما SDK ادتریس را پیاده سازی کردید، میتوانید از ویژگی های زیر بهره ببرید:
</div>

### <div id="af-adtrace-id" dir="rtl" align='right'>شناسه ادتریس</div>

<div dir="rtl" align='right'>
هنگامی که پیاده سازی ادتریس به طور کامل تمام شود میتوانید، به صورت زیر شناسه ادتریس را دریافت نمایید:
</div>
<br/>

```js
var adtraceId = adtrace.getAdId();
```

<br/>
<div dir="rtl" align='right'>
<strong>نکته</strong>: اگر شناسه ادتریس برابر با <code>null</code> باشد، این بدین معناست که SDK درحال نصب و اتریبیوت کردن داده های شماست و یک کم زمان (حدود 10 ثانیه) میبرد تا این مقدار از سرور دریافت شود.
</div>

### <div id="af-default-tracker" dir="rtl" align='right'>ترکر پیشفرض</div>

<div dir="rtl" align='right'>
مقدار <code>default_tracker</code> یک پارامتر <strong>اضافی</strong> میباشد که برای ردیابی ترکرهای <strong>غیر ارگانیک</strong> استفاده میشود.
</div>
<br/>

```js
var adtrace = new AdTrace({
  app_token: '{YourAppToken}',
  environment: 'production', // or 'sandbox' in case you are testing SDK locally with your web app
  unique_id: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' // each web app user needs to have unique identifier,
  default_tracker: 'Your non organic tracker' // optional
});
```

<br/>
<div dir="rtl" align='right'>
اگر این پارامتر استفاده نشود اتریبیوت کردن داده های شما بر روی <strong>ترکر ارگانیک</strong> انجام خواهد گرفت.
</div>

### <div id="af-stable-local-data" dir="rtl" align='right'>پایدار ساختن داده های local</div>

<div dir="rtl" align='right'>
به دلیل اینکه شناسه یکتا (unique id) و شناسه ادتریس درون <code>localStorage</code> ذخیره میشود، اگر میخواهید <code>localStorage</code> خودتان را <code>clear</code> کنید این را درنظر بگیرید که متد <code><strong>stableLocalData</strong></code> را بعد از متد <code><strong>clear</strong></code> فراخوانی کنید تا داده های قبلی ادریس در <code>localStorage</code> ذخیره شوند:
</div>
<br/>

```js
localStorage.clear(); // clearing your own data
_adtrace.stableLocalData();
```
