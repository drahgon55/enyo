/**
* A port of upstream's `samples/AjaxSample.js` (enyojs/enyo, tag
* `2.5.1-release`) to ES modules.
*
* A URL, a query, a Fetch button and a text area for whatever comes back.
*
* Upstream fetched Yahoo's YQL service, which was shut down in 2019, so the
* sample's one interesting action produced nothing but a network error. It
* fetches `assets/sample-data.json` here instead -- the canned YQL response
* the original query would have returned -- so `Ajax` is still driven end to
* end, offline. Point the URL box at anything else to see it fetch that.
*
* `processError` also used to assume the error body was JSON with an
* `error.description` in it; a 404 from a static file server is HTML, so
* `JSON.parse` threw inside the error handler and the popup never appeared.
* It reports whatever it actually got now.
*
* @module enyo/samples/AjaxSample
*/

import kind from '../src/kind.js';
import Ajax from '../src/Ajax.js';

import FittableColumns from 'layout/src/FittableColumns.js';
import FittableRows from 'layout/src/FittableRows.js';

import Button from 'onyx/src/Button/Button.js';
import Input from 'onyx/src/Input/Input.js';
import Popup from 'onyx/src/Popup/Popup.js';
import TextArea from 'onyx/src/TextArea/TextArea.js';

export default kind({
	name: 'enyo.sample.AjaxSample',
	kind: FittableRows,
	classes: 'enyo-fit ajax-sample',
	components: [
		{kind: FittableColumns, classes: 'onyx-toolbar-inline', components: [
			{content: 'Query: '},
			{kind: Input, name: 'query', fit: true, value: 'select * from weather.forecast where woeid in (select woeid from geo.places where text="san francisco, ca")'},
			{kind: Button, content: 'Fetch', ontap: 'fetch'}
		]},
		{kind: FittableColumns, classes: 'onyx-toolbar-inline', components: [
			{content: 'URL: '},
			{kind: Input, name: 'baseUrl', fit: true, value: 'assets/sample-data.json'}
		]},
		{kind: TextArea, fit: true, classes: 'ajax-sample-source'},
		{name: 'basicPopup', kind: Popup, centered: true, floating: true, classes: 'onyx-sample-popup', style: 'padding: 10px;', content: 'Popup...'}
	],
	fetch: function() {
		var ajax = new Ajax({
			url: this.$.baseUrl.getValue()
		});
		// send parameters the remote service using the 'go()' method
		ajax.go({
			q: this.$.query.getValue()
		});
		// attach responders to the transaction object
		ajax.response(this, 'processResponse');
		// handle error
		ajax.error(this, 'processError');
	},
	processResponse: function(inSender, inResponse) {
		// do something with it
		this.$.textArea.setValue(JSON.stringify(inResponse, null, 2));
	},
	processError: function(inSender, inResponse) {
		var xhr = inSender.xhrResponse || {},
			errorLog = 'Error' + ': ' + inResponse + '! ' + this.describe(xhr.body);
		this.$.textArea.setValue(JSON.stringify(xhr, null, 2));
		this.$.basicPopup.setContent(errorLog);
		this.$.basicPopup.show();
	},
	/**
	* Upstream read `JSON.parse(body).error.description` straight out, which is
	* what YQL sent back. Anything else -- a static server's HTML 404 page, an
	* empty body from a refused connection -- threw inside the error handler.
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
