/**
* A port of upstream's `samples/DrawerSample.js` (enyojs/enyo, tag
* `2.5.1-release`) to ES modules.
*
* A vertical drawer with a second drawer nested inside it, whose animation the
* checkbox turns on and off, and a horizontal drawer inside a
* `FittableColumns`.
*
* Upstream's root kind had no `kind:` property and relied on the default; it
* is `Control` explicitly here (see README, "The default kind").
*
* @module enyo/samples/DrawerSample
*/

import kind from '../src/kind.js';
import Checkbox from '../src/Checkbox/Checkbox.js';
import Control from '../src/Control/Control.js';
import Drawer from '../src/Drawer.js';

import FittableColumns from 'layout/src/FittableColumns.js';

export default kind({
	name: 'enyo.sample.DrawerSample',
	kind: Control,
	classes: 'drawer-sample',
	components: [
		{content: 'Drawers', classes: 'drawer-sample-divider'},
		{content: 'Activate (V)', classes: 'drawer-sample-box drawer-sample-mtb', ontap: 'activateDrawer'},
		{name: 'drawer', kind: Drawer, components: [
			{content: 'Vertical Drawer<br>Vertical Drawer<br>Vertical Drawer<br>Vertical Drawer', allowHtml: true, classes: 'drawer-sample-box drawer-sample-mtb'},
			{components: [
				{kind: Checkbox, name: 'animateSetting', value: true},
				{content: 'Animated', classes: 'enyo-inline onyx-sample-animate-label'}
			]},
			{content: 'Activate (V) (Toggled Animation)', classes: 'drawer-sample-box drawer-sample-mtb', ontap: 'activateDrawer2'},
			{name: 'drawer2', kind: Drawer, animated: true, components: [
				{content: 'Vertical Drawer<br>Vertical Drawer<br>Vertical Drawer<br>Vertical Drawer', allowHtml: true, classes: 'drawer-sample-box drawer-sample-mtb'}
			]},
			{content: 'Vertical Drawer<br>Vertical Drawer<br>Vertical Drawer<br>Vertical Drawer', allowHtml: true, classes: 'drawer-sample-box drawer-sample-mtb'}
		]},
		{content: 'Foo<br>Foo', allowHtml: true, classes: 'drawer-sample-box drawer-sample-mtb'},
		{kind: FittableColumns, fit: true, ontap: 'activateColumnsDrawer', classes: 'drawer-sample-box drawer-sample-mtb drawer-sample-o', components: [
			{content: 'Activate (H)', classes: 'drawer-sample-box drawer-sample-mlr'},
			{name: 'columnsDrawer', orient: 'h', kind: Drawer, open: false, components: [
				{content: 'H-Drawer', classes: 'drawer-sample-box drawer-sample-mlr'}
			]},
			{content: 'Foo', fit: true, classes: 'drawer-sample-box drawer-sample-mlr drawer-sample-o'},
			{content: 'Foo', classes: 'drawer-sample-box drawer-sample-mlr'}
		]},
		{content: 'Foo', classes: 'drawer-sample-box drawer-sample-mtb'}
	],
	activateDrawer: function() {
		this.$.drawer.setOpen(!this.$.drawer.open);
	},
	activateDrawer2: function() {
		this.$.drawer2.setAnimated(this.$.animateSetting.getValue());
		this.$.drawer2.setOpen(!this.$.drawer2.open);
	},
	activateColumnsDrawer: function() {
		this.$.columnsDrawer.setOpen(!this.$.columnsDrawer.open);
		return true;
	}
});
