/**
* A port of upstream's `samples/WebServiceSample.js` (enyojs/enyo, tag
* `2.5.1-release`) to ES modules.
*
* The same request made either way: the picker switches `WebService` between
* an XHR and a JSON-P `<script>`, and the response lands in the text area.
*
* Upstream called Yahoo's YQL service, which was shut down in 2019, so neither
* mode did anything. It now fetches `assets/sample-data.json` over XHR and
* `assets/sample-data-jsonp.js` as JSON-P -- the second a static file that
* reads the callback name out of its own `<script>` src, which is all a JSON-P
* endpoint ever does -- and `url` is switched with the mode. See README,
* "The services upstream called".
*
* The picker that chooses between them did not work upstream either: `jsonp`
* went into the params object, where `send()` never looks for it, so both
* settings made the same XHR. It is set on the service now.
*
* `processError` also used to assume the error body was JSON with an
* `error.description` in it; it reports whatever it actually got now.
*
* @module enyo/samples/WebServiceSample
*/

import kind from '../src/kind.js';
import WebService from '../src/WebService.js';

import FittableColumns from 'layout/src/FittableColumns.js';
import FittableRows from 'layout/src/FittableRows.js';

import Button from 'onyx/src/Button/Button.js';
import Input from 'onyx/src/Input/Input.js';
import Picker from 'onyx/src/Picker/Picker.js';
import PickerDecorator from 'onyx/src/PickerDecorator.js';
import Popup from 'onyx/src/Popup/Popup.js';
import TextArea from 'onyx/src/TextArea/TextArea.js';

export default kind({
	name: 'enyo.sample.WebServiceSample',
	kind: FittableRows,
	classes: 'enyo-fit webservice-sample',
	components: [
		{kind: WebService, name: 'yql', url: 'assets/sample-data.json', onResponse: 'processResponse', onError: 'processError', callbackName: 'callback'},
		{kind: FittableColumns, classes: 'onyx-toolbar-inline', components: [
			{content: 'Query: '},
			{kind: Input, name: 'query', fit: true, value: 'select * from weather.forecast where woeid in (select woeid from geo.places where text="san francisco, ca")'},
			{kind: PickerDecorator, components: [
				{content: 'Choose Transport', style: 'width:100px;'},
				{kind: Picker, floating: true, components: [
					{content: 'AJAX', active: true},
					{content: 'JSON-P'}
				]}
			]},
			{kind: Button, content: 'Fetch', ontap: 'fetch'}
		]},
		{kind: TextArea, fit: true, classes: 'webservice-sample-source'},
		{name: 'basicPopup', kind: Popup, centered: true, floating: true, classes: 'onyx-sample-popup', style: 'padding: 10px;', content: 'Popup...'}
	],
	fetch: function() {
		var jsonp = (this.$.picker.getSelected().indexInContainer()==2);
		// `jsonp` is a property of the WebService, not a request parameter:
		// `send()` reads `this.jsonp` to choose between Ajax and JsonpRequest.
		// Upstream passed it in the params object instead, where it was merely
		// serialised into the query string -- so the picker never switched
		// anything and both settings made the same XHR. See README, "A bug in
		// the original sample".
		this.$.yql.set('jsonp', jsonp);
		// The two transports need different files here, where upstream had one
		// YQL endpoint that spoke both.
		this.$.yql.set('url', jsonp ? 'assets/sample-data-jsonp.js' : 'assets/sample-data.json');
		// send parameters the remote service using the 'send()' method
		this.$.yql.send({
			q: this.$.query.getValue()
		});
	},
	processResponse: function(inSender, inEvent) {
		// do something with it
		this.$.textArea.setValue(JSON.stringify(inEvent.data, null, 2));
	},
	processError: function(inSender, inEvent) {
		var xhr = (inEvent.ajax && inEvent.ajax.xhrResponse) || {},
			errorLog = 'Error' + ': ' + inEvent.data + '! ' + this.describe(xhr.body);
		this.$.textArea.setValue(JSON.stringify(xhr, null, 2));
		this.$.basicPopup.setContent(errorLog);
		this.$.basicPopup.show();
	},
	/**
	* Upstream read `JSON.parse(body).error.description` straight out, which is
	* what YQL sent back. Anything else -- a static server's HTML 404 page, an
	* empty body -- threw inside the error handler.
	*
	* @private
	*/
	describe: function(body) {
		if (!body) {
			return 'no response body';
		}
		try {
			return JSON.parse(body).error.description;
		} catch (e) {
			return String(body).slice(0, 200);
		}
	}
});
