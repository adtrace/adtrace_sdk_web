(function (window) {
  'use strict';

  function sendRequest(method, url, data, success_cb, error_cb) {

    var req = new XMLHttpRequest();

    req.open(method, url, !0);
    req.setRequestHeader('Client-SDK', 'js1.1.2');
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

  function getOS() {
    var osName = "unknown";
    if (navigator.platform.indexOf("Android") != -1 ) osName = "android";
    if (navigator.platform.indexOf("iPhone") != -1 ) osName = "ios";
    if (navigator.platform.indexOf("Win") != -1 ) osName = "windows";
    if (navigator.platform.indexOf("Mac") != -1 ) osName = "mac-os";
    if (navigator.platform.indexOf("X11") != -1 ) osName = "unix";
    if (navigator.platform.indexOf("Linux") != -1 ) osName = "linux";

    return osName;
  }

  if (!'withCredentials' in new XMLHttpRequest()) {
    sendRequest = function () {}
  }

  window.AdTrace = function AdTrace(options) {

    options = options || {};

    var _baseParams = {};
    var _adId = localStorage.getItem('adtrace_js_sdk_id');
    var _uniqueId = localStorage.getItem('adtrace_js_sdk_unique_id');
    var _previousPackageIds = _getPreviousPackageIds();
    var _baseClickBackoffTimer = 0.5; // second
    var _basePackageBackoffTimer = 5; // second
    var _baseClickBackoffCount = 0;
    var _basePackageBackoffCount = 0;
    var _isHandlingPackage = false;

    _baseParams.unique_id = options.unique_id;
    _baseParams.app_token = options.app_token;
    _baseParams.environment = options.environment;
    _baseParams.os_name = getOS();
    _baseParams.app_version = '1.0.0';

    if (_baseParams.environment == 'sandbox') {
      console.log('Adtrace environment is running on sandbox. Please change it to `production` in reelase mode.')
    }

    if (options.hasOwnProperty('default_tracker')) {
      _baseParams.default_tracker = options.default_tracker;
    }

    if (_baseParams.os_name == 'android') {
      _baseParams.gps_adid = _baseParams.unique_id;
      _baseParams.android_uuid = _baseParams.unique_id;
    }
    else if (_baseParams.os_name == 'ios') {
      _baseParams.idfa = _baseParams.unique_id;
      _baseParams.idfv = _baseParams.unique_id; 
    }
    else {
      _baseParams.win_adid = _baseParams.unique_id;
    }

    if (_baseParams.unique_id != _uniqueId && _adId != null) {
      localStorage.removeItem('adtrace_js_sdk_id');
      localStorage.setItem('adtrace_js_sdk_packages', '');
      _adId = null;
    }
    _initializeSDK();

    return {
      getAdId: getAdId,
      trackSession: trackSession,
      trackEvent: trackEvent,
      stableData: stableLocalData,
    };

    function _initializeSDK() {

      if (_adId == null) {
        trackInstall(function (result) {
          var resultJson = JSON.parse(result.responseText);
          if (resultJson.hasOwnProperty('adid')) {
            _adId = resultJson.adid;
            _uniqueId = _baseParams.unique_id;
            localStorage.setItem('adtrace_js_sdk_id', _adId);
            localStorage.setItem('adtrace_js_sdk_unique_id', _uniqueId);
            _basePackageBackoffTimer = 5; // reset
            _hanldePackages();
            console.log("Adtrace SDk initialized successfully");
          }
          else {
            console.log("Adtrace SDK click will retry again in " + (_baseClickBackoffTimer * Math.pow(2, _baseClickBackoffCount)) + " Sec.");
            console.log((new Date).getTime());
            setTimeout(_initializeSDK, _baseClickBackoffTimer * Math.pow(2, _baseClickBackoffCount) * 1000);
            _baseClickBackoffCount += 1;
          }
        }, function (errorMsg, error) {
          console.log(errorMsg);
          console.log("Adtrace SDK click will retry again in " + (_baseClickBackoffTimer * Math.pow(2, _baseClickBackoffCount)) + " Sec.");
          console.log((new Date).getTime());
          setTimeout(_initializeSDK, _baseClickBackoffTimer * Math.pow(2, _baseClickBackoffCount) * 1000);
          _baseClickBackoffCount += 1;
        });
      }
      else {
        _hanldePackages();
      }

    }

    function trackInstall(onSuccess, onError) {

      var params = cloneObj(_baseParams);

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

      var params = cloneObj(_baseParams);
      params.created_at = (new Date().toISOString() + '+0000');
      params.sent_at = params.created_at;

      localStorage.setItem('adtrace_js_sdk_package_' + params.sent_at, 'https://app.adtrace.io/session?' + encodeQueryString(params));
      _previousPackageIds.push(params.sent_at);
      localStorage.setItem('adtrace_js_sdk_packages', localStorage.getItem('adtrace_js_sdk_packages') + '&' + params.sent_at);
      _hanldePackages(onSuccess, onError);

    }

    function trackEvent(options, onSuccess, onError) {

      options = options || {};

      var params = cloneObj(_baseParams);
      var revenue = _getRevenue(options);
      var eventValue = options.event_value;
      var callbackParams = _getMap(options.callback_params);
      var partnerParams = _getMap(options.partner_params);

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
      _previousPackageIds.push(params.sent_at);
      localStorage.setItem('adtrace_js_sdk_packages', localStorage.getItem('adtrace_js_sdk_packages') + '&' + params.sent_at);
      _hanldePackages(onSuccess, onError);

    }

    function getAdId() {
      return _adId;
    }

    function stableLocalData() {
      if (_adId) {
        localStorage.setItem('adtrace_js_sdk_id', _adId);
      }
      if (_uniqueId) {
        localStorage.setItem('adtrace_js_sdk_unique_id', _uniqueId);
      }
    }

    function _getRevenue(options) {

      var revenue = parseFloat(options.revenue);

      if (revenue < 0 || !options.currency) {
        return null;
      }

      return {
        revenue: revenue.toFixed(5),
        currency: options.currency
      };

    }

    function _getMap(params) {

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

    function _getPreviousPackageIds() {

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

    function _hanldePackages(onSuccess, onError) {
      if (!_isHandlingPackage) {
        if (_previousPackageIds.length > 0 && _previousPackageIds[0] != '') {
          _isHandlingPackage = true;
          var packageData = localStorage.getItem('adtrace_js_sdk_package_' + _previousPackageIds[0]);
          sendRequest('GET', packageData, null, function (result) {
            var previousPackageIds = _previousPackageIds.slice();
            previousPackageIds.shift();
            localStorage.removeItem('adtrace_js_sdk_package_' + _previousPackageIds[0]);
            var previousPackageIdsString = "";
            for (var i = 0; i < previousPackageIds.length; i++) {
              previousPackageIdsString += previousPackageIds[i];
              if (i + 1 != previousPackageIds.length) {
                previousPackageIdsString += '&';
              }
            }
            localStorage.setItem('adtrace_js_sdk_packages', previousPackageIdsString);
            _previousPackageIds = previousPackageIds;
            _isHandlingPackage = false;
            _basePackageBackoffTimer = 5; // reset
            if (_previousPackageIds.length > 0) {
              _hanldePackages();
            }
            if (onSuccess) {
              onSuccess(result);
            }
          }, function (errorMsg, error) {
            console.log(errorMsg);
            console.log("Adtrace SDK package will retry again in " + (_basePackageBackoffTimer * Math.pow(2, _basePackageBackoffCount)) + " Sec.");
            setTimeout(_hanldePackages, _basePackageBackoffTimer * Math.pow(2, _basePackageBackoffCount) * 1000);
            _basePackageBackoffCount += 1;
            _isHandlingPackage = false;
            if (onError) {
              onError(errorMsg, error);
            }
          });
        }
      }
    }

  }

})(window);
