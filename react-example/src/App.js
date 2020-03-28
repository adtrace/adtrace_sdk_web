import React from 'react';
import logo from './logo.svg';
import './App.css';
import 'web-adtrace';

class App extends React.Component {
    constructor(props) {
      super(props);
      
      this.state = {
        log: "Click track session or event"
      };
      this.adtrace = new window.AdTrace({
        app_token: '228fu1ygm2ta',
        environment: 'production', // or 'sandbox' in case you are testing SDK locally with your web app
        unique_id: '5056e23a-fh94-223o-b8a2-4ac4e20d48b2', // each web app user needs to have unique identifier,
      });
      this.loading = {};
    }

    trackSession = () => {
      if (this.loading.session) {
        return;
      }

      this.loading.session = true;

      this.adtrace.trackSession((result) => {
        this.successCb(result, 'session');
      }, (errorMsg, error) => {
        this.errorCb(errorMsg, error, 'session');   
      });
    }

    trackEvent = () => {
      if (this.loading.event) {
        return;
      }

      this.loading.event = true;

      const eventConfig = {
        event_token: '9zcrfo', // event token
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

      this.adtrace.trackEvent(eventConfig, (result) => {
        this.successCb(result, 'event');

      }, (errorMsg, error) => {
        this.errorCb(errorMsg, error, 'event');
      });
    }

    successCb = (result, what) => {
      this.loading[what] = false;

      this.setState({
        log: 'SUCCESS :)\n\n' + result.responseText
      });
    }

    errorCb = (errorMsg, error, what) => {
      this.loading[what] = false;

      this.setState({
        log: 'ERROR :(\n\n' + errorMsg + '\n\n' + error.responseText
      });
    }

    render() {
        return (
          <div className="App">
            <header className="App-header">
              <img src={logo} className="App-logo" alt="logo" />
              <button onClick={this.trackSession}>
                Track session
              </button>
              <br/>
              <button onClick={this.trackEvent}>
                Track event
              </button>
              <pre>{this.state.log}</pre>
            </header>
          </div>
        );
    }
}

export default App;
