/**
* A port of upstream's `samples/ComponentOverrideSample.js` (enyojs/enyo, tag
* `2.5.1-release`) to ES modules.
*
* A kind, a subkind that rewrites two of its components through
* `componentOverrides`, and the plain kind again underneath, so you can see
* what the override did.
*
* Upstream declared `enyo.sample.SampleKind` and `enyo.sample.SubSampleKind`
* as globals and then named them in strings. They are module-local constants
* here, referenced directly, and keep their `name:` so the kind names in the
* inspector are unchanged. Neither declared a `kind:`; both say `Control`
* explicitly now (see README, "The default kind").
*
* @module enyo/samples/ComponentOverrideSample
*/

import kind from '../src/kind.js';
import Button from '../src/Button/Button.js';
import Control from '../src/Control/Control.js';

var SampleKind = kind({
	name: 'enyo.sample.SampleKind',
	kind: Control,
	components: [
		{name: 'title'},
		{name: 'red', style: 'background:red; color:white; padding:10px;', content: 'Red', components: [
			{name: 'orange', style: 'background:orange; color:white; padding:10px;', content: 'Orange', components: [
				{name: 'green', style: 'background:green; color:white; padding:10px; border-radius:10px;', content: 'Green'}
			]}
		]},
		{name: 'purple', style: 'background:purple; color:white; padding:10px;', content: 'Purple'},
		{name: 'blue', style: 'background:blue; color:white; padding:10px;', content: 'Blue'}
	],
	create: function() {
		this.inherited(arguments);
		this.$.title.setContent(this.kindName);
	}
});

var SubSampleKind = kind({
	name: 'enyo.sample.SubSampleKind',
	kind: SampleKind,
	componentOverrides: {
		purple: {kind: Button, content: 'Purple shmurple!', style: 'border-radius:30px;'},
		green: {kind: Button, content: "Now I'm a Pink button!", style: 'background-color:pink;'}
	}
});

export default kind({
	name: 'enyo.sample.ComponentOverrideSample',
	kind: Control,
	components: [
		{kind: SampleKind},
		{style: 'height:50px;'},
		{kind: SubSampleKind},
		{style: 'height:50px;'},
		{kind: SampleKind}
	]
});
