(function () {
  'use strict';

  var _adtrace = new AdTrace({
    app_token: '9e8tyd0l38s7', // your app token
    environment: 'sandbox', // or 'production' in release mode
    unique_id: '5056e87a-dc98-184o-b8a2-4ac4e09d45b4',
    default_tracker: '0wbyf3z' // for changing default tracker (optional)
  });

  var _eventConfig = {
    event_token: '40mfee', // event token
    // other optional parameters //
    revenue: 10,
    currency: 'EUR',
    event_value: 'my-value',
    callback_params: [{
      key: 'some-key-1',
      value: 'some-value-1'
    }, {
      key: 'some-key-2',
      value: 'some-value-2'
    }],
    partner_params: [{
      key: 'some-partner-key-1',
      value: 'some-partner-value-1'
    }, {
      key: 'some-partner-key-2',
      value: 'some-partner-value-2'
    }, {
      key: 'some-partner-key-1',
      value: 'some-partner-value-3'
    }]
  };

  // Internal (demo) stuff, don't touch!
  var _trackSessionBtn = document.querySelector('#track-session');
  var _trackEventBtn = document.querySelector('#track-event');
  var _adtraceIdContainer = document.querySelector('#adtrace-id');
  var _logContainer = document.querySelector('#log');
  var _waitingForResponseMsg = 'waiting for response, please wait...';
  var _loading = {};

  _trackSessionBtn.addEventListener('click', handleTrackSession);
  _trackEventBtn.addEventListener('click', handleTrackEvent);

  _adtraceIdContainer.innerHTML = 'Adtrace ID: ' + _adtrace.getAdId();

  function handleTrackSession() {

    if (_loading.session) {
      return;
    }

    _loading.session = true;

    prepareLog();

    _adtrace.trackSession(function (result) {
      successCb(result, 'session');
    }, function (errorMsg, error) {
      errorCb(errorMsg, error, 'session');
    });

  }

  function handleTrackEvent() {

    if (_loading.event) {
      return;
    }

    _loading.event = true;

    prepareLog();

    _adtrace.trackEvent(_eventConfig, function (result) {
      successCb(result, 'event');
    }, function (errorMsg, error) {
      errorCb(errorMsg, error, 'event');
    });

  }

  function prepareLog() {

    _logContainer.textContent = _waitingForResponseMsg;
    _logContainer.classList.remove('success');
    _logContainer.classList.remove('error');

  }

  function successCb(result, what) {

    _loading[what] = false;

    _logContainer.textContent = 'SUCCESS :)\n\n';
    _logContainer.textContent += result.responseText;
    _logContainer.classList.add('success');

  }

  function errorCb(errorMsg, error, what) {

    console.log(error);
    _loading[what] = false;

    _logContainer.textContent = 'ERROR :(\n\n';
    _logContainer.textContent += errorMsg + '\n\n';
    _logContainer.textContent += error.responseText;
    _logContainer.classList.add('error');

  }

})();
