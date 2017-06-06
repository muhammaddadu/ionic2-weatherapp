import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

const YAHOO_YQL_URL = 'https://query.yahooapis.com/v1/public/yql';

@Injectable()
export class YahooService {
	constructor(private http: Http) { }

	getWeatherForLocationWithName(name): Promise<any> {
		return this.query(`select * from weather.forecast where woeid in (select woeid from geo.places(1) where text="${name}")`);
	}

	getLocationsForSearch(searchTerms): Promise<any> {
		return this.query(`select * from geo.places where text="${searchTerms}"`);
	}

	query(q): Promise<any> {
		let attempts = 0;
		let execute = () => this._query(q)
			.then(resp => resp['results'])
			.then((data) => {
				if (!data && attempts < 3) {
					return execute();
				}
				return data;
			});
		return execute();
	}

	private _query(yql) {
		let headers = new Headers();
		headers.append('Content-Type', 'application/x-www-form-urlencoded');

		return new Promise((resolve, reject) => {
			this.http
				.get(`${YAHOO_YQL_URL}?q=${yql}&format=json`, { headers })
	      .map(res => res.json())
	      .subscribe((resp) => resolve(resp.query), reject);
		});
	}
}
