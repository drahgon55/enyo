/*
	A static JSON-P endpoint, for JsonpSample and for WebServiceSample's JSON-P
	mode.

	Both samples were written against Yahoo's YQL service, which was shut down
	in 2019. There is no live JSON-P service to point them at instead, and no
	server here to write one in -- the samples are served by a plain static file
	server. But JSON-P does not actually need a dynamic server: the response is
	a script, and a script can read the query string off its own <script> tag.

	`JsonpRequest` (enyo/src/Jsonp.js) defines a global named
	`enyo_jsonp_callback_<n>`, then loads this file with that name in the query
	parameter `callbackName` names -- `callback` by default. So: find our own
	src, pull the callback name out of it, and call it with the same payload
	`sample-data.json` carries. That is exactly what a real JSON-P endpoint
	does.

	Any other parameters -- the samples send `q` -- are ignored, as a canned
	response must.
*/
(function () {
	var data = {
		query: {
			count: 1,
			created: '2015-04-29T00:00:00Z',
			lang: 'en-US',
			results: {
				channel: {
					title: 'Yahoo! Weather - San Francisco, CA',
					link: 'http://us.rss.yahoo.com/forecast/USCA0987_f.html',
					description: 'Yahoo! Weather for San Francisco, CA',
					language: 'en-us',
					location: {city: 'San Francisco', country: 'United States', region: 'CA'},
					units: {distance: 'mi', pressure: 'in', speed: 'mph', temperature: 'F'},
					wind: {chill: '57', direction: '280', speed: '12'},
					atmosphere: {humidity: '76', pressure: '29.86', rising: '0', visibility: '10'},
					astronomy: {sunrise: '6:14 am', sunset: '7:59 pm'},
					item: {
						title: 'Conditions for San Francisco, CA at 11:00 am PDT',
						condition: {code: '26', date: 'Wed, 29 Apr 2015 11:00 am PDT', temp: '57', text: 'Cloudy'},
						forecast: [
							{code: '28', date: '29 Apr 2015', day: 'Wed', high: '63', low: '51', text: 'Mostly Cloudy'},
							{code: '30', date: '30 Apr 2015', day: 'Thu', high: '65', low: '52', text: 'Partly Cloudy'},
							{code: '34', date: '1 May 2015',  day: 'Fri', high: '71', low: '53', text: 'Mostly Sunny'},
							{code: '32', date: '2 May 2015',  day: 'Sat', high: '74', low: '54', text: 'Sunny'},
							{code: '30', date: '3 May 2015',  day: 'Sun', high: '68', low: '53', text: 'Partly Cloudy'}
						]
					}
				}
			}
		}
	};

	// document.currentScript is the <script> enyo just appended, while this
	// file is running. Everything enyo told us is in its src.
	var me = document.currentScript,
		src = me && me.src,
		name = null,
		i, pair, params;

	if (src && src.indexOf('?') >= 0) {
		params = src.slice(src.indexOf('?') + 1).split('&');
		for (i = 0; i < params.length; i++) {
			pair = params[i].split('=');
			// JsonpRequest names its global enyo_jsonp_callback_<n>, whatever
			// parameter it was sent under (`callback` by default, but
			// callbackName is settable).
			if (decodeURIComponent(pair[1] || '').indexOf('enyo_jsonp_callback_') === 0) {
				name = decodeURIComponent(pair[1]);
				break;
			}
		}
	}

	if (name && typeof window[name] === 'function') {
		window[name](data);
	} else if (window.console) {
		// Not an error worth throwing: loaded directly, there is nobody to call.
		window.console.log('sample-data-jsonp.js: no enyo JSON-P callback in ' + src);
	}
})();
