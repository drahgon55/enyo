/**
* A port of upstream's `samples/InputSample.js` (enyojs/enyo, tag
* `2.5.1-release`) to ES modules.
*
* One `Input` of every `type` the platform offers, plus `selectOnFocus` and a
* disabled one the button enables, with every `onchange` and `oninput` read
* back underneath.
*
* Upstream's root kind had no `kind:` property and relied on the default; it
* is `Control` explicitly here (see README, "The default kind").
*
* @module enyo/samples/InputSample
*/

import kind from '../src/kind.js';
import Button from '../src/Button/Button.js';
import Control from '../src/Control/Control.js';
import Input from '../src/Input/Input.js';

export default kind({
	name: 'enyo.sample.InputSample',
	kind: Control,
	classes: 'input-sample',
	components: [
		{tag: 'label', content: 'Text Input', classes: 'section', attributes: [{'for': 'inputText'}]},
		{kind: Input, name: 'inputText', type: 'text', placeholder: 'Text', value: 'Initial Value', onchange: 'inputChanged', oninput: 'inputOccurred'},
		{tag: 'label', content: 'Select On Focus Input', classes: 'section', attributes: [{'for': 'inputSelectOnFocus'}]},
		{kind: Input, name: 'inputSelectOnFocus', type: 'text', placeholder: 'Select On Focus', value: 'This text will be selected when focused', selectOnFocus: true, onchange: 'inputChanged', oninput: 'inputOccurred'},
		{tag: 'label', content: 'Password Input', classes: 'section', attributes: [{'for': 'inputPassword'}]},
		{kind: Input, name: 'inputPassword', type: 'password', placeholder: 'Password', onchange: 'inputChanged', oninput: 'inputOccurred'},
		{tag: 'label', content: 'Email Input', classes: 'section', attributes: [{'for': 'inputEmail'}]},
		{kind: Input, name: 'inputEmail', type: 'email', placeholder: 'Email', onchange: 'inputChanged', oninput: 'inputOccurred'},
		{tag: 'label', content: 'Search Input', classes: 'section', attributes: [{'for': 'inputSearch'}]},
		{kind: Input, name: 'inputSearch', type: 'search', placeholder: 'Search', onchange: 'inputChanged', oninput: 'inputOccurred'},
		{tag: 'label', content: 'Number Input', classes: 'section', attributes: [{'for': 'inputNumber'}]},
		{kind: Input, name: 'inputNumber', type: 'number', placeholder: 'Number', onchange: 'inputChanged', oninput: 'inputOccurred'},
		{tag: 'label', content: 'Disabled Input', classes: 'section', attributes: [{'for': 'inputDisabled'}]},
		{kind: Input, name: 'inputDisabled', disabled: true, value: 'Disabled', onchange: 'inputChanged', oninput: 'inputOccurred'},
		{kind: Button, name: 'buttonInputToggle', ontap: 'buttonInputToggleTapped', content: 'Toggle Input State'},
		{name: 'results', classes: 'results'}
	],
	inputChanged: function(inSender, inEvent) {
		this.$.results.setContent('The value of "' + inSender.getName() + '" has been changed to: "' + inSender.getValue() + '".');
	},
	inputOccurred: function(inSender, inEvent) {
		this.$.results.setContent('The current value of "' + inSender.getName() + '" is: "' + inSender.getValue() + '".');
	},
	buttonInputToggleTapped: function(inSender, inEvent) {
		this.$.inputDisabled.setDisabled(!this.$.inputDisabled.getDisabled()).setValue(this.$.inputDisabled.getDisabled() ? 'Disabled' : 'Enabled');
		this.$.results.setContent('The current state of "inputDisabled" is "' + (this.$.inputDisabled.getDisabled() ? 'disabled' : 'enabled') + '".');
	}
});
