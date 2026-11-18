/**
* A port of upstream's `samples/CheckboxSample.js` (enyojs/enyo, tag
* `2.5.1-release`) to ES modules.
*
* Three independent checkboxes and three in a highlander `Group`, with a
* readout of the last change.
*
* Upstream's root kind had no `kind:` property and relied on the default; it
* is `Control` explicitly here (see README, "The default kind").
*
* @module enyo/samples/CheckboxSample
*/

import kind from '../src/kind.js';
import Checkbox from '../src/Checkbox/Checkbox.js';
import Control from '../src/Control/Control.js';
import Group from '../src/Group/Group.js';

export default kind({
	name: 'enyo.sample.CheckboxSample',
	kind: Control,
	classes: 'checkbox-sample',
	components: [
		{content: 'Checkboxes', classes: 'section'},
		{kind: Checkbox, content: 'Checkbox 1', onchange: 'checkboxChanged'},
		{kind: Checkbox, content: 'Checkbox 2', onchange: 'checkboxChanged'},
		{kind: Checkbox, content: 'Checkbox 3', onchange: 'checkboxChanged'},
		{content: 'Grouped Checkboxes', classes: 'section'},
		{kind: Group, onActivate: 'groupActivated', components: [
			{kind: Checkbox, content: 'Grouped Checkbox 1'},
			{kind: Checkbox, content: 'Grouped Checkbox 2'},
			{kind: Checkbox, content: 'Grouped Checkbox 3'}
		]},
		{name: 'results', classes: 'results'}
	],
	checkboxChanged: function(inSender, inEvent) {
		this.updateResult({content: 'The "' + inEvent.originator.getContent() + '" checkbox is ' + (inSender.getChecked() ? 'checked': 'unchecked') + '.'});
	},
	groupActivated: function(inSender, inEvent) {
		if (inEvent.originator.getActive()) {
			this.updateResult({content: 'The "' + inEvent.originator.getContent() + '" checkbox is selected.'});
		}
	},
	updateResult: function(inComponents) {
		this.$.results.destroyClientControls();
		this.$.results.createComponent(inComponents);
		this.$.results.render();
	}
});
