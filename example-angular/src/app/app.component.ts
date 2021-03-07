import { Component, OnInit } from '@angular/core';
declare var AdTrace: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'example-angular';
  adtrace = AdTrace;

  ngOnInit(){
    this.adtrace = new AdTrace({
		    app_token: 'n54wwwih0yrq',
		    environment: 'sandbox', // or 'sandbox' in case you are testing SDK locally with your web app
		    unique_id: '5057e23a-fh84-878o-b8a2-4ac4e20d48b2', // each web app user needs to have unique identifier,
		});
  }

  public onTrackSession() {
    this.adtrace.trackSession(function (result: Object) {
        console.log(result);
      }, function (errorMsg: String, error: Object) {
        console.log(errorMsg, error);
      }
    );
  }

  public onTrackEvent() {
    let eventConfig = {
      event_token: 'bhtld5'
    };

    this.adtrace.trackEvent(eventConfig, function (result: Object) {
      console.log(result);
    }, function (errorMsg: String, error: Object) {
      console.log(errorMsg, error);
    });
  }
}
