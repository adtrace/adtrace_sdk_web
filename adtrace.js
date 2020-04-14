(function (window) {
  'use strict';

  function sendRequest(method, url, data, success_cb, error_cb) {

    var req = new XMLHttpRequest();

    req.open(method, url, !0);
    req.setRequestHeader('Client-SDK', 'js1.2.2');
    if (method == 'POST') {
      req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    }
    req.onreadystatechange = function () {
      if (req.readyState === 4) {
        if (req.status >= 200 && req.status < 400) {
          !!success_cb && success_cb(req);
        } else if (!!error_cb) {
          !!error_cb && error_cb(new Error('Server responded with HTTP ' + req.status), req);
        }
      }
    };

    req.send(data)
  }

  function encodeQueryString(params) {
    var pairs = [];
    for (var k in params) {
      if (!params.hasOwnProperty(k)) {
        continue
      }
      pairs.push(encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
    }
    return pairs.join('&')
  }

  function cloneObj(obj) {
    var copy = {};
    if (typeof(obj) !== 'object' || !obj) {
      return copy
    }
    for (var k in obj) {
      if (!obj.hasOwnProperty(k)) {
        continue
      }
      copy[k] = obj[k]
    }
    return copy
  }

  /**
   * Determine the mobile operating system.
   * This function returns one of 'iOS', 'Android', 'Windows Phone', or 'unknown'.
   *
   * @returns {String}
   */
  function getOS() {
    var userAgent = navigator.userAgent || navigator.vendor || window.opera;

        // Windows Phone must come first because its UA also contains "Android"
      if (/windows phone/i.test(userAgent)) {
          return "windows-phone";
      }

      if (/android/i.test(userAgent)) {
          return "android";
      }

      // iOS detection from: http://stackoverflow.com/a/9039885/177710
      if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
          return "ios";
      }

      return "unknown";
  }

  if (!'withCredentials' in new XMLHttpRequest()) {
    sendRequest = function () {}
  }

  window.AdTrace = function AdTrace(options) {

    options = options || {};

    var baseParams = {};
    var adId = localStorage.getItem('adtrace_js_sdk_id');
    var uniqueId = localStorage.getItem('adtrace_js_sdk_unique_id');
    var previousPackageIds = getPreviousPackageIds();
    var baseClickBackoffTimer = 0.5; // second
    var basePackageBackoffTimer = 5; // second
    var baseClickBackoffCount = 0;
    var basePackageBackoffCount = 0;
    var isHandlingPackage = false;

    baseParams.unique_id = options.unique_id;
    baseParams.app_token = options.app_token;
    baseParams.environment = options.environment;
    baseParams.os_name = getOS();
    baseParams.app_version = '1.0.0';

    if (baseParams.environment == 'sandbox') {
      console.log('Adtrace environment is running on sandbox. Please change it to `production` in release mode.')
    }

    if (options.hasOwnProperty('default_tracker')) {
      baseParams.default_tracker = options.default_tracker;
    }

    if (baseParams.os_name == 'android') {
      baseParams.gps_adid = baseParams.unique_id;
      baseParams.android_uuid = baseParams.unique_id;
    }
    else if (baseParams.os_name == 'ios') {
      baseParams.idfa = baseParams.unique_id;
      baseParams.idfv = baseParams.unique_id; 
    }
    else {
      baseParams.win_adid = baseParams.unique_id;
    }

    if (baseParams.unique_id != uniqueId && _adId != null) {
      localStorage.removeItem('adtrace_js_sdk_id');
      localStorage.setItem('adtrace_js_sdk_packages', '');
      adId = null;
    }
    initializeSDK();

    return {
      getAdId: getAdId,
      trackSession: trackSession,
      trackEvent: trackEvent,
      stableLocalData: stableLocalData,
    };

    function initializeSDK() {

      if (adId == null) {
        trackInstall(function (result) {
          var resultJson = JSON.parse(result.responseText);
          if (resultJson.hasOwnProperty('adid')) {
            adId = resultJson.adid;
            uniqueId = baseParams.unique_id;
            localStorage.setItem('adtrace_js_sdk_id', adId);
            localStorage.setItem('adtrace_js_sdk_unique_id', uniqueId);
            basePackageBackoffTimer = 5; // reset
            hanldePackages();
            console.log("Adtrace SDk initialized successfully");
          }
          else {
            console.log("Adtrace SDK click will retry again in " + (baseClickBackoffTimer * Math.pow(2, baseClickBackoffCount)) + " Sec.");
            console.log((new Date).getTime());
            setTimeout(initializeSDK, baseClickBackoffTimer * Math.pow(2, baseClickBackoffCount) * 1000);
            baseClickBackoffCount += 1;
          }
        }, function (errorMsg, error) {
          console.log(errorMsg);
          console.log("Adtrace SDK click will retry again in " + (baseClickBackoffTimer * Math.pow(2, baseClickBackoffCount)) + " Sec.");
          setTimeout(initializeSDK, baseClickBackoffTimer * Math.pow(2, baseClickBackoffCount) * 1000);
          baseClickBackoffCount += 1;
        });
      }
      else {
        hanldePackages();
      }

    }

    function trackInstall(onSuccess, onError) {

      var params = cloneObj(baseParams);

      params.device_type = 'phone';
      params.source = 'install_referrer';
      params.referrer = 'utm_source=google-play&utm_medium=organic';
      params.needs_response_details = 1;
      params.event_buffering_enabled = 0;
      params.raw_referrer = params.referrer;
      params.tracking_enabled = 1;
      params.installed_at = (new Date().toISOString() + '+0000');
      params.session_count = 1;
      params.attribution_deeplink = 1;
      params.created_at = params.installed_at;
      params.sent_at = params.installed_at;
        
      sendRequest('POST', 'https://app.adtrace.io/sdk_click', encodeQueryString(params), onSuccess, onError);      

    }

    function trackSession(onSuccess, onError) {

      var params = cloneObj(baseParams);
      params.created_at = (new Date().toISOString() + '+0000');
      params.sent_at = params.created_at;

      localStorage.setItem('adtrace_js_sdk_package_' + params.sent_at, 'https://app.adtrace.io/session?' + encodeQueryString(params));
      previousPackageIds.push(params.sent_at);
      localStorage.setItem('adtrace_js_sdk_packages', localStorage.getItem('adtrace_js_sdk_packages') + '&' + params.sent_at);
      hanldePackages(onSuccess, onError);

    }

    function trackEvent(options, onSuccess, onError) {

      options = options || {};

      var params = cloneObj(baseParams);
      var revenue = getRevenue(options);
      var eventValue = options.event_value;
      var callbackParams = getMap(options.callback_params);
      var partnerParams = getMap(options.partner_params);

      params.event_token = options.event_token;

      if (revenue) {
        params.revenue = revenue.revenue;
        params.currency = revenue.currency;
      }

      if (eventValue) {
        params.event_value = eventValue;
      }

      if (callbackParams) {
        params.callback_params = JSON.stringify(callbackParams);
      }

      if (partnerParams) {
        params.partner_params = JSON.stringify(partnerParams);
      }

      params.created_at = (new Date().toISOString() + '+0000');
      params.sent_at = params.created_at;

      localStorage.setItem('adtrace_js_sdk_package_' + params.sent_at, 'https://app.adtrace.io/event?' + encodeQueryString(params));
      previousPackageIds.push(params.sent_at);
      localStorage.setItem('adtrace_js_sdk_packages', localStorage.getItem('adtrace_js_sdk_packages') + '&' + params.sent_at);
      hanldePackages(onSuccess, onError);

    }

    function getAdId() {
      return adId;
    }

    function stableLocalData() {
      if (adId) {
        localStorage.setItem('adtrace_js_sdk_id', adId);
      }
      if (uniqueId) {
        localStorage.setItem('adtrace_js_sdk_unique_id', uniqueId);
      }
    }

    function getRevenue(options) {

      var revenue = parseFloat(options.revenue);

      if (revenue < 0 || !options.currency) {
        return null;
      }

      return {
        revenue: revenue.toFixed(5),
        currency: options.currency
      };

    }

    function getMap(params) {

      params = params || [];

      if (!params.length) {
        return null;
      }

      var map = {};

      for (var i = 0; i < params.length; i++) {
        map[params[i].key] = params[i].value;
      }

      return cloneObj(map);

    }

    function getPreviousPackageIds() {

      var previousPackages = [];
      var previousPackageIdsString = localStorage.getItem('adtrace_js_sdk_packages');
      if (previousPackageIdsString == null) {
        localStorage.setItem('adtrace_js_sdk_packages', '');
        return previousPackages;
      }
      var splitedString = previousPackageIdsString.split("&");
      for (var i = 0; i < splitedString.length; i++) {
        if (splitedString[i] != '') {
          previousPackages.push(splitedString[i]);
        }
      }
      return previousPackages;

    }

    function hanldePackages(onSuccess, onError) {
      if (!isHandlingPackage) {
        if (previousPackageIds.length > 0 && previousPackageIds[0] != '') {
          isHandlingPackage = true;
          var packageData = localStorage.getItem('adtrace_js_sdk_package_' + previousPackageIds[0]);
          sendRequest('GET', packageData, null, function (result) {
            var newPreviousPackageIds = previousPackageIds.slice();
            newPreviousPackageIds.shift();
            localStorage.removeItem('adtrace_js_sdk_package_' + previousPackageIds[0]);
            var previousPackageIdsString = "";
            for (var i = 0; i < newPreviousPackageIds.length; i++) {
              previousPackageIdsString += newPreviousPackageIds[i];
              if (i + 1 != newPreviousPackageIds.length) {
                previousPackageIdsString += '&';
              }
            }
            localStorage.setItem('adtrace_js_sdk_packages', previousPackageIdsString);
            previousPackageIds = newPreviousPackageIds;
            isHandlingPackage = false;
            basePackageBackoffTimer = 5; // reset
            if (previousPackageIds.length > 0) {
              hanldePackages();
            }
            if (onSuccess) {
              onSuccess(result);
            }
          }, function (errorMsg, error) {
            console.log(errorMsg);
            console.log("Adtrace SDK package will retry again in " + (basePackageBackoffTimer * Math.pow(2, basePackageBackoffCount)) + " Sec.");
            setTimeout(hanldePackages, basePackageBackoffTimer * Math.pow(2, basePackageBackoffCount) * 1000);
            basePackageBackoffCount += 1;
            isHandlingPackage = false;
            if (onError) {
              onError(errorMsg, error);
            }
          });
        }
      }
    }

  }

})(window);