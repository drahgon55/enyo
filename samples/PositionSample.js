/**
* A port of upstream's `samples/PositionSample.js` (enyojs/enyo, tag
* `2.5.1-release`) to ES modules.
*
* The six coordinates `dispatcher.getPosition()` keeps for the last pointer
* event, live. Move the mouse over the page.
*
* `enyo.getPosition` and `enyo.makeBubble` are both on `src/dispatcher.js`.
* Upstream declared `enyo.sample.PositionSampleNested` as a global and named
* it in `defaultKind:` as a string; it is a module-local constant here, and
* keeps its `name:`. Neither kind declared a `kind:`; both say `Control`
* explicitly now (see README, "The default kind").
*
* @module enyo/samples/PositionSample
*/

import kind from '../src/kind.js';
import Control from '../src/Control/Control.js';
import dispatcher from '../src/dispatcher.js';

/**
* One labelled readout: its own name on the left, the value on the right.
*
* @class PositionSampleNested
* @extends module:enyo/Control~Control
* @private
*/
var PositionSampleNested = kind({
	name: 'enyo.sample.PositionSampleNested',
	kind: Control,
	defaultProps: {style: 'padding: 10px; width: 100px; display: inline-block; text-align: right;'},
	text: '',
	create: function () {
		this.inherited(arguments);
		this.$.label.set('content', this.name);
	},
	components: [
		{name: 'label', tag: 'span'},
		{name: 'text', tag: 'span'}
	],
	bindings: [
		{from: '.text', to: '.$.text.content'}
	]
});

export default kind({
	name: 'enyo.sample.PositionSample',
	kind: Control,
	defaultKind: PositionSampleNested,
	components: [
		{name: 'clientX'},
		{name: 'clientY'},
		{name: 'pageX'},
		{name: 'pageY'},
		{name: 'screenX'},
		{name: 'screenY'}
	],
	handlers: {'onmousemove': 'mouseMoved'},
	rendered: function () {
		this.inherited(arguments);
		dispatcher.makeBubble('mousemove', this);
	},
	mouseMoved: function () {
		var p = dispatcher.getPosition();
		for (var k in p) {
			this.$[k].set('text', p[k]);
		}
	}
});
