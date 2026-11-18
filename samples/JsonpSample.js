/**
* A port of upstream's `samples/JsonpSample.js` (enyojs/enyo, tag
* `2.5.1-release`) to ES modules.
*
* A query, a Fetch button, and whatever the JSON-P call returns.
*
* Upstream called Yahoo's YQL service, which was shut down in 2019. There is
* no live JSON-P service to point this at and no server here to write one in,
* so the request goes to `assets/sample-data-jsonp.js` -- a static file that
* reads the callback name out of its own `<script>` src and calls it, which is
* all a JSON-P endpoint ever does. `JsonpRequest` itself is exercised exactly
* as before.
*
* @module enyo/samples/JsonpSample
*/

import kind from '../src/kind.js';
import JsonpRequest from '../src/Jsonp.js';

import FittableColumns from 'layout/src/FittableColumns.js';
import FittableRows from 'layout/src/FittableRows.js';

import Button from 'onyx/src/Button/Button.js';
import Input from 'onyx/src/Input/Input.js';
import TextArea from 'onyx/src/TextArea/TextArea.js';

export default kind({
	name: 'enyo.sample.JsonpSample',
	kind: FittableRows,
	classes: 'enyo-fit jsonp-sample',
	components: [
		{kind: FittableColumns, classes: 'onyx-toolbar-inline', components: [
			{content: 'Query: '},
			{kind: Input, name: 'query', fit: true, value: 'select * from weather.forecast where woeid in (select woeid from geo.places where text="san francisco, ca")'},
			{kind: Button, content: 'Fetch', ontap: 'fetch'}
		]},
		{kind: TextArea, fit: true, classes: 'jsonp-sample-source'}
	],
	fetch: function() {
		var jsonp = new JsonpRequest({
			url: 'assets/sample-data-jsonp.js',
			callbackName: 'callback'
		});
		// send parameters the remote service using the 'go()' method
		jsonp.go({
			q: this.$.query.getValue()
		});
		// attach responders to the transaction object
		jsonp.response(this, 'processResponse');
	},
	processResponse: function(inSender, inResponse) {
		// do something with it
		this.$.textArea.setValue(JSON.stringify(inResponse, null, 2));
	}
});
