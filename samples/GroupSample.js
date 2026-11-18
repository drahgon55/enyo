/**
* A port of upstream's `samples/GroupSample.js` (enyojs/enyo, tag
* `2.5.1-release`) to ES modules.
*
* Five `Group`s side by side: buttons, checkboxes, a group with a `groupName`
* that one of its own children opts out of, and two with `highlander: false`
* so more than one child can be active at once.
*
* Upstream's root kind had no `kind:` property and relied on the default; it
* is `Control` explicitly here (see README, "The default kind").
*
* @module enyo/samples/GroupSample
*/

import kind from '../src/kind.js';
import Button from '../src/Button/Button.js';
import Checkbox from '../src/Checkbox/Checkbox.js';
import Control from '../src/Control/Control.js';
import Group from '../src/Group/Group.js';

export default kind({
	name: 'enyo.sample.GroupSample',
	kind: Control,
	classes: 'group-sample',
	components: [
		{content: 'Grouped Buttons', classes: 'section'},
		{kind: Group, onActiveChanged: 'handleActiveChanged', classes: 'grouping', components: [
			{kind: Button, content: 'Button 1'},
			{kind: Button, content: 'Button 2'},
			{kind: Button, content: 'Button 3'}
		]},
		{content: 'Grouped Checkboxes', classes: 'section'},
		{kind: Group, onActiveChanged: 'handleActiveChanged', classes: 'grouping', components: [
			{tag: 'label', components: [
				{kind: Checkbox, content: 'Checkbox 1'}
			]},
			{tag: 'label', components: [
				{kind: Checkbox, content: 'Checkbox 2'}
			]},
			{tag: 'label', components: [
				{kind: Checkbox, content: 'Checkbox 3'}
			]}
		]},
		{content: 'Named Grouped Buttons', classes: 'section'},
		{kind: Group, onActiveChanged: 'handleActiveChanged', classes: 'grouping', groupName: 'buttonGroup', components: [
			{kind: Button, content: 'Named Button 1', groupName: 'buttonGroup'},
			{kind: Button, content: 'Named Button 2 (excluded)'},
			{kind: Button, content: 'Named Button 3', groupName: 'buttonGroup'}
		]},
		{content: 'Multiple Active Grouped Checkboxes', classes: 'section'},
		{kind: Group, onActivate: 'handleActivate', classes: 'grouping', highlander: false, components: [
			{tag: 'label', components: [
				{kind: Checkbox, content: 'Multi Checkbox 1'}
			]},
			{tag: 'label', components: [
				{kind: Checkbox, content: 'Multi Checkbox 2'}
			]},
			{tag: 'label', components: [
				{kind: Checkbox, content: 'Multi Checkbox 3'}
			]}
		]},
		{content: 'Multiple Active Grouped Buttons', classes: 'section'},
		{kind: Group, onActivate: 'handleActivate', classes: 'grouping', highlander: false, components: [
			{kind: Button, content: 'Multi Button 1'},
			{kind: Button, content: 'Multi Button 2'},
			{kind: Button, content: 'Multi Button 3'}
		]},
		{name: 'results', classes: 'results'}
	],
	handleActiveChanged: function(inSender, inEvent) {
		this.updateResults([
			{content: 'The "' + inEvent.active.getContent() + '" control is active.'}
		]);
		return true;
	},
	handleActivate: function(inSender, inEvent) {
		if (inEvent.originator.getActive()) {
			this.updateResults([
				{content: 'The "' + inEvent.originator.getContent() + '" control is newly active in the group.'}
			]);
		}
		return true;
	},
	updateResults: function(inComponents) {
		this.$.results.destroyClientControls();
		this.$.results.createComponents(inComponents);
		this.$.results.render();
	}
});
