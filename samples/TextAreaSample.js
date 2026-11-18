/**
* A port of upstream's `samples/TextAreaSample.js` (enyojs/enyo, tag
* `2.5.1-release`) to ES modules.
*
* A `TextArea` and a disabled one the button enables, with every `onchange`
* and `oninput` read back underneath.
*
* Upstream's root kind had no `kind:` property and relied on the default; it
* is `Control` explicitly here (see README, "The default kind").
*
* @module enyo/samples/TextAreaSample
*/

import kind from '../src/kind.js';
import Button from '../src/Button/Button.js';
import Control from '../src/Control/Control.js';
import TextArea from '../src/TextArea/TextArea.js';

export default kind({
	name: 'enyo.sample.TextAreaSample',
	kind: Control,
	classes: 'text-area-sample',
	components: [
		{tag: 'label', content: 'Text Area', classes: 'section', attributes: [{'for': 'inputTextArea'}]},
		{kind: TextArea, name: 'inputTextArea', type: 'text', placeholder: 'TextArea', value: 'Initial TextArea Value', onchange: 'inputChanged', oninput: 'inputOccurred'},
		{tag: 'label', content: 'Disabled Text Area', classes: 'section', attributes: [{'for': 'textAreaDisabled'}]},
		{kind: TextArea, name: 'textAreaDisabled', disabled: true, value: 'Disabled', onchange: 'inputChanged', oninput: 'inputOccurred'},
		{kind: Button, name: 'buttonTextAreaToggle', ontap: 'buttonTextAreaToggleTapped', content: 'Toggle Text Area State'},
		{name: 'results', classes: 'results'}
	],
	inputChanged: function(inSender, inEvent) {
		this.$.results.setContent('The value of "' + inSender.getName() + '" has been changed to: "' + inSender.getValue() + '".');
	},
	inputOccurred: function(inSender, inEvent) {
		this.$.results.setContent('The current value of "' + inSender.getName() + '" is: "' + inSender.getValue() + '".');
	},
	buttonTextAreaToggleTapped: function(inSender, inEvent) {
		this.$.textAreaDisabled.setDisabled(!this.$.textAreaDisabled.getDisabled()).setValue(this.$.textAreaDisabled.getDisabled() ? 'Disabled' : 'Enabled');
		this.$.results.setContent('The current state of "textAreaDisabled" is "' + (this.$.textAreaDisabled.getDisabled() ? 'disabled' : 'enabled') + '".');
	}
});
