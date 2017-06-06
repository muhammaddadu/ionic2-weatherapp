import { Component, ViewChild } from '@angular/core';
import { Nav, ItemSliding, Item, MenuController, Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';

import { ForecastComponent } from '../components/forecast/forecast.component';
import { YahooService } from '../services/yahoo.service';

let map = (row) => {
	let locality = row.locality2 || row.locality1 || row.admin1 || row.country || row;
	console.log(row);
	return {
		title: locality.content || '',
		woeid: locality.woeid || ''
	};
};

@Component({
  templateUrl: 'app.html'
})
export class AppComponent {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = ForecastComponent;

  searchCtrl: any;
  editCtrl: any;

  areas: Array<{title: string}>;

  constructor(public platform: Platform,
			  private yahooService: YahooService,
			  public menuCtrl: MenuController) {
    this.initializeApp();

    this.searchCtrl = {
    	isActive: false,
    	searchString: '',
    	results: [],
    	onInput: function (value) {
    		if (this.searchString === value) { return; }
    		this.searchString = value;
    		this.isActive = value !== '' ? true : false;

    		// conduct query
    		if (this.isActive) {
    			yahooService
    				.getLocationsForSearch(this.searchString)
    				.then((data) => {
    					if (!data || !data.place) {
    						this.results = [];
    						return;
    					}
    					if (data.place instanceof Array) {
    						let keys = [];
    						let filter = (obj) => {
    							if (!!~keys.indexOf(obj.title)) {
    								return false;
    							}
    							keys.push(obj.title);
    							return true;
    						};
    						this.results = data.place.map(map).filter(filter);
    					} else {
    						this.results = [map(this.results)];
    					}
    				});
    		} else {
    			this.results = [];
    		}
    	},
    	onCancel: function () {
    		this.searchString = '';
    		this.isActive = false;
    	}
    };

    this.editCtrl = {
    	isActive: false,
    	openSlides: {},
    	setMode: function (isActive: Boolean) { this.isActive = isActive; }
    };

    this.areas = [
      { title: 'Whitechappel' },
      { title: 'Leeds' }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      StatusBar.styleDefault();
      Splashscreen.hide();
    });
  }

  onReorderArea($event) {
  	console.log($event);
  }


	public open(slidingItem: ItemSliding) {
		let isItOpen = this.isItOpen(slidingItem);
		if (!isItOpen) {
			this.editCtrl.openSlides[slidingItem.item.id] = slidingItem;
		}
	}

	private isItOpen(slidingItem: ItemSliding) {
		return !!this.editCtrl.openSlides[slidingItem.item.id];
	}

	public close(slidingItem: ItemSliding) {
		// let isItOpen = this.isItOpen(slidingItem);
		// if (isItOpen) {
		// 	console.log('close');
		// 	slidingItem.close();
		// 	this.editCtrl.openSlides[slidingItem.item.id] = null;
		// }
	}


  openForcase(opts) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(ForecastComponent);
    this.menuCtrl.close();
  }
}
