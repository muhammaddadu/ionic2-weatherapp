import { Component } from '@angular/core';

import { NavController, ToastController } from 'ionic-angular';

import { YahooService } from '../../services/yahoo.service';

@Component({
  selector: 'forecast-component',
  templateUrl: 'forecast.component.html'
})
export class ForecastComponent {
	data: any;
	isLoading: boolean;
	hasInternet: boolean;

  constructor(public navCtrl: NavController,
  						public toastCtrl: ToastController,
  						private yahooService: YahooService) {
  	this.loadData();
  }


  loadData() {
  	if (this.isLoading === true) {
  		return;
  	}

  	this.isLoading = true;
  	this.yahooService
  		.getWeatherForLocationWithName('e11pa')
  		.then((data) => {
  			console.log(data);
  			this.isLoading = false;
  			this.data = data;
  		})
  		.catch((data) => {
  			this.isLoading = false;
  			let message = JSON.stringify(data, null, '\t');
  			let toast = this.toastCtrl.create({
		      message: message,
		      duration: 3000
		    });
		    toast.present();
  		});
  }
}
