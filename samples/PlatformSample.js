/**
* A port of upstream's `samples/PlatformSample.js` (enyojs/enyo, tag
* `2.5.1-release`) to ES modules.
*
* What enyo thinks it is running on: the raw user-agent string, the window
* size and device pixel ratio (which follow a resize), and `enyo/platform`
* itself as JSON.
*
* `enyo.platform` is the default export of `src/platform.js`.
*
* @module enyo/samples/PlatformSample
*/

import kind from '../src/kind.js';
import platform from '../src/platform.js';

import FittableRows from 'layout/src/FittableRows.js';

import Groupbox from 'onyx/src/Groupbox/Groupbox.js';
import GroupboxHeader from 'onyx/src/GroupboxHeader/GroupboxHeader.js';

export default kind({
	name: 'enyo.sample.PlatformSample',
	kind: FittableRows,
	classes: 'enyo-fit platform-sample',
	components: [
		{classes: 'platform-sample-divider', content: 'Enyo Platform Detection'},
		{kind: Groupbox, components: [
			{kind: GroupboxHeader, content: 'User-Agent String'},
			{name: 'uaString', content: '', style: 'padding: 8px;'}
		]},
		{tag: 'br'},
		{kind: Groupbox, components: [
			{kind: GroupboxHeader, content: 'Window'},
			{name: 'windowAttr', content: '', style: 'padding: 8px;'}
		]},
		{tag: 'br'},
		{kind: Groupbox, components: [
			{kind: GroupboxHeader, content: 'enyo.platform'},
			{name: 'enyoPlatformJSON', content: '', style: 'padding: 8px;'}
		]}
	],
	updateWindowSize: function() {
		var width = window.innerWidth;
		if (width === undefined) {
			width = document.documentElement.clientWidth;
		}
		var height = window.innerHeight;
		if (height === undefined) {
			height = document.documentElement.clientHeight;
		}
		this.$.windowAttr.setContent('size: ' + width + 'x' + height +
			', devicePixelRatio: ' + window.devicePixelRatio);
	},
	create: function() {
		this.inherited(arguments);
		this.$.uaString.setContent(navigator.userAgent);
		this.$.enyoPlatformJSON.setContent(JSON.stringify(platform, null, 1));
		this.updateWindowSize();
	},
	handleResize: function() {
		this.inherited(arguments);
		this.updateWindowSize();
	}
});
