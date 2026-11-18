/**
* A port of upstream's `samples/RepeaterSample.js` (enyojs/enyo, tag
* `2.5.1-release`) to ES modules.
*
* A `Repeater` of twenty-six people, each row filled in by the sample's
* `onSetupItem` handler.
*
* Upstream's root kind had no `kind:` property and relied on the default; it
* is `Control` explicitly here (see README, "The default kind"). The people
* are upstream's, unchanged.
*
* @module enyo/samples/RepeaterSample
*/

import kind from '../src/kind.js';
import Control from '../src/Control/Control.js';
import Repeater from '../src/Repeater.js';

export default kind({
	name: 'enyo.sample.RepeaterSample',
	kind: Control,
	classes: 'enyo-fit repeater-sample',
	components: [
		{kind: Repeater, onSetupItem: 'setupItem', components: [
			{name: 'item', classes: 'repeater-sample-item', components: [
				{tag: 'span', name: 'personNumber'},
				{tag: 'span', name: 'personName'}
			]}
		]}
	],
	create: function() {
		this.inherited(arguments);
		this.$.repeater.setCount(this.people.length);
	},
	setupItem: function(inSender, inEvent) {
		var index = inEvent.index;
		var item = inEvent.item;
		var person = this.people[index];
		item.$.personNumber.setContent((index+1) + '. ');
		item.$.personName.setContent(person.name);
		item.$.personName.applyStyle('color', person.sex == 'male' ? 'dodgerblue' : 'deeppink');
		/* stop propagation */
		return true;
	},
	people: [
		{name: 'Andrew', sex:'male'},
		{name: 'Betty', sex:'female'},
		{name: 'Christopher', sex:'male'},
		{name: 'Donna', sex:'female'},
		{name: 'Ephraim', sex:'male'},
		{name: 'Frankie', sex:'male'},
		{name: 'Gerald', sex:'male'},
		{name: 'Heather', sex:'female'},
		{name: 'Ingred', sex:'female'},
		{name: 'Jack', sex:'male'},
		{name: 'Kevin', sex:'male'},
		{name: 'Lucy', sex:'female'},
		{name: 'Matthew', sex:'male'},
		{name: 'Noreen', sex:'female'},
		{name: 'Oscar', sex:'male'},
		{name: 'Pedro', sex:'male'},
		{name: 'Quentin', sex:'male'},
		{name: 'Ralph', sex:'male'},
		{name: 'Steven', sex:'male'},
		{name: 'Tracy', sex:'female'},
		{name: 'Uma', sex:'female'},
		{name: 'Victor', sex:'male'},
		{name: 'Wendy', sex:'female'},
		{name: 'Xin', sex:'male'},
		{name: 'Yulia', sex:'female'},
		{name: 'Zoltan'}
	]
});
