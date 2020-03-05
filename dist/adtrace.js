(function (window) {
  'use strict';

  function sendRequest(method, url, data, success_cb, error_cb) {

    var req = new XMLHttpRequest();

    req.open(method, url, !0);
    req.setRequestHeader('Client-SDK', 'js1.1.0');
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

    if (!!error_cb) {
      req.onerror = error_cb
    }

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

  if (!'withCredentials' in new XMLHttpRequest()) {
    sendRequest = function () {}
  }

  window.AdTrace = function AdTrace(options) {

    options = options || {};

    var _baseParams = cloneObj(options.device_ids);
    var _sendSession = false;
    var _adid = localStorage.getItem('adtrace_js_sdk_id');

    _baseParams.app_token = options.app_token;
    _baseParams.environment = options.environment;
    _baseParams.os_name = options.os_name || 'android';
    _baseParams.app_version = options.app_version;

    _initializeSDK();

    return {
      getAdId: getAdId,
      trackSession: trackSession,
      trackEvent: trackEvent
    };

    function _initializeSDK() {

      if (_adid == null) {
        trackInstall(function (result) {
          var resultJson = JSON.parse(result.responseText);
          if (resultJson.hasOwnProperty('adid')) {
            _adid = resultJson.adid;
            localStorage.setItem('adtrace_js_sdk_id', _adid);
            if (_sendSession) {
              _sendSession = false;
              setTimeout(function(){ trackSession(function (sessionResult) {}, function (sessionErrorMsg, sessionError) {}); }, 5000);
            }
          }
        }, function (errorMsg, error) {
        });
      }

    }

    function trackInstall(onSuccess, onError) {

      var params = cloneObj(_baseParams);

      params.device_type = 'phone';
      params.source = 'install_referrer';
      params.referrer = 'utm_source=google-play&utm_medium=organic';
      params.android_uuid = params.gps_adid;
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
      if (_adid == null) {
        onError(new Error('Adtrace Session will sent after inistalling'), '');
        _sendSession = true;
      }
      else {
        var params = cloneObj(_baseParams);
        sendRequest('GET', 'https://app.adtrace.io/session?' + encodeQueryString(params), null, onSuccess, onError);
      }
    }

    function trackEvent(options, onSuccess, onError) {

      options = options || {};

      var params = cloneObj(_baseParams);
      var revenue = _getRevenue(options);
      var callbackParams = _getMap(options.callback_params);
      var partnerParams = _getMap(options.partner_params);

      params.event_token = options.event_token;

      if (revenue) {
        params.revenue = revenue.revenue;
        params.currency = revenue.currency;
      }

      if (callbackParams) {
        params.callback_params = JSON.stringify(callbackParams);
      }

      if (partnerParams) {
        params.partner_params = JSON.stringify(partnerParams);
      }

      sendRequest('GET', 'https://app.adtrace.io/event?' + encodeQueryString(params), null, onSuccess, onError)

    }

    function getAdId() {
      return _adid;
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

  }

})(window);
