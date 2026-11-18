/**
* A port of upstream's `samples/ScrollerSample.js` (enyojs/enyo, tag
* `2.5.1-release`) to ES modules.
*
* The same over-wide block of text in seven scrollers, one per strategy and
* axis combination, on a `Panels` the toolbar's picker switches between.
*
* `strategyKind` was given as a string here (`'TouchScrollStrategy'`). 2.7
* resolves such a name through `kind.constructorForKind`, which looks it up on
* the global `enyo` namespace -- a namespace ES modules do not create -- so a
* string now throws `[TouchScrollStrategy] is not the name of a valid kind.`
* The property has taken a constructor since 2.6 (`Scroller`'s own default is
* one), and that is what it is given here. See README, "Strings that used to
* name kinds".
*
* @module enyo/samples/ScrollerSample
*/

import kind from '../src/kind.js';
import Scroller from '../src/Scroller/Scroller.js';
import TouchScrollStrategy from '../src/TouchScrollStrategy.js';
import TransitionScrollStrategy from '../src/TransitionScrollStrategy.js';
import TranslateScrollStrategy from '../src/TranslateScrollStrategy.js';

import FittableRows from 'layout/src/FittableRows.js';
import Panels from 'layout/src/Panels/Panels.js';

import Picker from 'onyx/src/Picker/Picker.js';
import PickerDecorator from 'onyx/src/PickerDecorator.js';
import Toolbar from 'onyx/src/Toolbar/Toolbar.js';

export default kind({
	name: 'enyo.sample.ScrollerSample',
	kind: FittableRows,
	classes: 'enyo-fit  enyo-unselectable',
	components: [
		{kind: Toolbar, components: [
			{kind: PickerDecorator, components: [
				{content: 'Choose Scroller', style: 'width:250px;'},
				{kind: Picker, floating: true, maxHeight: 300, onSelect: 'sampleChanged', components: [
					{content: 'Default scroller', active: true},
					{content: 'Force touch scroller'},
					{content: 'Horizontal only'},
					{content: 'Vertical only'},
					{content: 'Force TouchScrollStrategy'},
					{content: 'Force TransitionScrollStrategy'},
					{content: 'Force TranslateScrollStrategy'}
				]}
			]}
		]},
		{kind: Panels, fit: true, draggable: false, classes: 'scroller-sample-panels', components: [
			// Default scroller (chooses best scrolling method for platform)
			{kind: Scroller, classes: 'scroller-sample-scroller enyo-fit'},
			// Forces touch scrolling, even on desktop
			{kind: Scroller, touch: true, classes: 'scroller-sample-scroller enyo-fit'},
			// Horizontal-only scrolling
			{kind: Scroller, vertical: 'hidden', classes: 'scroller-sample-scroller enyo-fit'},
			// Vertical-only scrolling
			{kind: Scroller, horizontal: 'hidden', classes: 'scroller-sample-scroller enyo-fit', onmousedown: 'mouseDown', ondragstart: 'dragStart'},
			// Force specific strategies
			{kind: Scroller, classes: 'scroller-sample-scroller enyo-fit', strategyKind: TouchScrollStrategy},
			{kind: Scroller, classes: 'scroller-sample-scroller enyo-fit', strategyKind: TransitionScrollStrategy},
			{kind: Scroller, classes: 'scroller-sample-scroller enyo-fit', strategyKind: TranslateScrollStrategy}
		]}
	],
	create: function() {
		this.inherited(arguments);
		var scrollers = this.$.panels.getPanels();
		for (var i = 0; i < scrollers.length; ++i) {
			scrollers[i].createComponent({
				allowHtml: true,
				content: this.text,
				classes: 'scroller-sample-content'
			});
		}
	},
	sampleChanged: function(inSender, inEvent) {
		this.$.panels.setIndex(inEvent.selected.indexInContainer()-1);
	},
	text: 'Foo<br>Bar<br>Bar<br>Boom boom pow<br>Foo<br>Bar<br>Boom boom pow<br>Foo<br>Bar<br>Boom boom pow<br>' +
		'Foo<br>Bar<br>Boom boom pow<br>Foo<br>Bar<br>Boom boom pow<br>Foo<br>Bar<br>Boom boom pow. Boom boom pow. ' +
		'Boom boom pow. Boom boom pow. Boom boom pow. Boom boom pow. Boom boom pow. Boom boom pow. Boom boom pow. ' +
		'Boom boom pow. Boom boom pow. Boom boom pow. Boom boom pow. Boom boom pow. Boom boom pow. Boom boom pow. ' +
		'Boom boom pow. Boom boom pow. Boom boom pow. Boom boom pow. Boom boom pow. <br>Foo<br>Bar<br>Bar<br>' +
		'Boom boom pow<br>Foo<br>Bar<br>Boom boom pow<br>Foo<br>Bar<br>Boom boom pow<br>Foo<br>Bar<br>Boom boom pow<br>' +
		'Foo<br>Bar<br>Boom boom pow<br>Foo<br>Bar<br>Boom boom pow. Boom boom pow. Boom boom pow. Boom boom pow. ' +
		'Boom boom pow. Boom boom pow. Boom boom pow. Boom boom pow. Boom boom pow. Boom boom pow. Boom boom pow. ' +
		'Boom boom pow. Boom boom pow. Boom boom pow. Boom boom pow. Boom boom pow. Boom boom pow. Boom boom pow. ' +
		'Boom boom pow. Boom boom pow. Boom boom pow. <br>Foo<br>Bar<br>Bar<br>Boom boom pow<br>Foo<br>Bar<br>' +
		'Boom boom pow<br>Foo<br>Bar<br>Boom boom pow<br>Foo<br>Bar<br>Boom boom pow<br>Foo<br>Bar<br>Boom boom pow<br>' +
		'Foo<br>Bar<br>Boom boom pow. Boom boom pow. Boom boom pow. Boom boom pow. Boom boom pow. Boom boom pow. ' +
		'Boom boom pow. Boom boom pow. Boom boom pow. Boom boom pow. Boom boom pow. Boom boom pow. Boom boom pow. ' +
		'Boom boom pow. Boom boom pow. Boom boom pow. Boom boom pow. Boom boom pow. Boom boom pow. Boom boom pow. ' +
		'Boom boom pow. <br>Foo<br>Bar<br>Bar<br>Boom boom pow<br>Foo<br>Bar<br>Boom boom pow<br>Foo<br>Bar<br>' +
		'Boom boom pow<br>Foo<br>Bar<br>Boom boom pow<br>Foo<br>Bar<br>Boom boom pow<br>Foo<br>Bar<br>Boom boom pow. ' +
		'Boom boom pow. Boom boom pow. Boom boom pow. Boom boom pow. Boom boom pow. Boom boom pow. Boom boom pow. ' +
		'Boom boom pow. Boom boom pow. Boom boom pow. Boom boom pow. Boom boom pow. Boom boom pow. Boom boom pow. ' +
		'Boom boom pow. Boom boom pow. Boom boom pow. Boom boom pow. Boom boom pow. Boom boom pow. <br>',
	// The following are used when this sample is called from the Sampler app
	mouseDown: function(inSender, inEvent) {
		inEvent.preventDefault();
	},
	dragStart: function(inSender, inEvent) {
		if (inEvent.horizontal) {
			// Prevent drag propagation on horizontal drag events
			return true;
		}
	}
});
