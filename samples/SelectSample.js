/**
* A port of upstream's `samples/SelectSample.js` (enyojs/enyo, tag
* `2.5.1-release`) to ES modules.
*
* Three `Select`s -- one of them grouped into `OptionGroup`s -- feeding a
* CSS transition the button then applies to the sample itself.
*
* Upstream's root kind had no `kind:` property and relied on the default; it
* is `Control` explicitly here (see README, "The default kind").
*
* @module enyo/samples/SelectSample
*/

import kind from '../src/kind.js';
import Button from '../src/Button/Button.js';
import Control from '../src/Control/Control.js';
import OptionGroup from '../src/OptionGroup.js';
import Select from '../src/Select.js';

export default kind({
	name: 'enyo.sample.SelectSample',
	kind: Control,
	classes: 'select-sample',
	components: [
		{content: 'Transition Timing Function', classes: 'section'},
		{kind: Select, name: 'selectTransitionTiming', onchange: 'selectChanged', components: [
			{content: 'None', value: ''},
			{kind: OptionGroup, label: 'Easing', components: [
				{content: 'Ease-In', value: 'ease-in'},
				{content: 'Ease-Out', value: 'ease-out'},
				{content: 'Ease-In-Out', value: 'ease-in-out'}
			]},
			{kind: OptionGroup, label: 'Linear', components: [
				{content: 'Linear', value: 'linear'}
			]},
			{kind: OptionGroup, label: 'Cubic-Bezier', components: [
				{content: 'Cubic-Bezier(0.1, 0.7, 1.0, 0.1)', value: 'cubic-bezier(0.1, 0.7, 1.0, 0.1)'},
				{content: 'Cubic-Bezier(0.5, 0.1, 0.1, 1.0)', value: 'cubic-bezier(0.5, 0.1, 0.1, 1.0)'},
				{content: 'Cubic-Bezier(1.0, 0.7, 0.3, 0.5)', value: 'cubic-bezier(1.0, 0.7, 0.3, 0.5)'}
			]},
			{kind: OptionGroup, label: 'Step', components: [
				{content: 'Step-Start', value: 'step-start'},
				{content: 'Step-End', value: 'step-end'},
				{content: 'Steps(4, end)', value: 'steps(4, end)'}
			]}
		]},
		{content: 'Transition Duration', classes: 'section'},
		{kind: Select, name: 'selectTransitionDuration', onchange: 'selectChanged', components: [
			{content: '1s', value: '1s'},
			{content: '2s', value: '2s'},
			{content: '3s', value: '3s'},
			{content: '4s', value: '4s'},
			{content: '5s', value: '5s'},
			{content: '6s', value: '6s'},
			{content: '7s', value: '7s'},
			{content: '8s', value: '8s'},
			{content: '9s', value: '9s'},
			{content: '10s', value: '10s'}
		]},
		{content: 'Background Color', classes: 'section'},
		{kind: Select, name: 'selectColor', onchange: 'selectChanged', components: [
			{content: 'None', value: 'transparent'},
			{content: 'Red', value: 'red'},
			{content: 'Green', value: 'green'},
			{content: 'Blue', value: 'blue'},
			{content: 'Yellow', value: 'yellow'},
			{content: 'Purple', value: 'purple'},
			{content: 'Orange', value: 'orange'},
			{content: 'White', value: 'white'},
			{content: 'Gray', value: 'gray'},
			{content: 'Black', value: 'black'}
		]},
		{kind: Button, name: 'buttonApply', content: 'Change Background Color', classes: 'button-apply', ontap: 'buttonApplyTapped'},
		{name: 'results', classes: 'results'}
	],
	buttonApplyTapped: function(inSender, inEvent) {
		this.$.results.destroyClientControls();
		this.applyStyle('transition-timing-function', this.$.selectTransitionTiming.getValue());
		this.applyStyle('transition-duration', this.$.selectTransitionDuration.getValue());
		this.applyStyle('background-color', this.$.selectColor.getValue());
		this.$.results.createComponents([
			{content: 'The "transition-timing-function" property has value "' + this.$.selectTransitionTiming.getValue() + '" applied.'},
			{content: 'The "transition-duration" property has value "' + this.$.selectTransitionDuration.getValue() + '" applied.'},
			{content: 'The "background-color" property has value "' + this.$.selectColor.getValue() + '" applied.'}
		]);
		this.$.results.render();
	},
	selectChanged: function(inSender, inEvent) {
		this.$.results.setContent('The "' + inSender.getName() + '" value is "' + inSender.getValue() + '".');
	}
});
