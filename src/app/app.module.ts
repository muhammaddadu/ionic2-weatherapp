import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';

import { YahooService } from '../services/yahoo.service';

import { AppComponent } from './app.component';
import { ForecastComponent } from '../components/forecast/forecast.component';

@NgModule({
  declarations: [
    AppComponent,
    ForecastComponent
  ],
  imports: [
    IonicModule.forRoot(AppComponent)
  ],
  bootstrap: [ IonicApp ],
  entryComponents: [
    AppComponent,
    ForecastComponent
  ],
  providers: [
	  {
	  	provide: ErrorHandler,
	  	useClass: IonicErrorHandler
	  },
  	YahooService
  ]
})
export class AppModule {}
