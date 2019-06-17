(function (window) {
  'use strict';

  function sendRequest(method, url, data, success_cb, error_cb) {

    var req = new XMLHttpRequest();

    req.open(method, url, !0);
    req.setRequestHeader('Client-SDK', 'js1.0.0');
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

    _baseParams.app_token = options.app_token;
    _baseParams.environment = options.environment;
    _baseParams.os_name = options.os_name || 'android';

    return {
      trackSession: trackSession,
      trackEvent: trackEvent
    };

    function trackSession(onSuccess, onError) {

      var params = cloneObj(_baseParams);

      sendRequest('GET', 'https://app.adtrace.io/session?'+  encodeQueryString(params), null, onSuccess, onError);

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
