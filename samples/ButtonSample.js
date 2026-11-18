/*
	Implementation notes:
	-	We are utilizing inSender (as opposed to inEvent.originator) in our button tap handler
		as we need to normalize for the case of the image button that has a child component, and
		we are concerned with the top-level button itself.
*/

/**
* A port of upstream's `samples/ButtonSample.js` (enyojs/enyo, tag
* `2.5.1-release`) to ES modules.
*
* Plain buttons, a disabled button that the first one toggles, a highlander
* `Group` of three, and a button with an image in it.
*
* Upstream's root kind had no `kind:` property and relied on the default; it
* is `Control` explicitly here (see README, "The default kind"). The image is
* `assets/enyo-logo.png` rather than the long-dead `enyojs.com` copy.
*
* @module enyo/samples/ButtonSample
*/

import kind from '../src/kind.js';
import Button from '../src/Button/Button.js';
import Control from '../src/Control/Control.js';
import Group from '../src/Group/Group.js';
import Image from '../src/Image/Image.js';

export default kind({
	name: 'enyo.sample.ButtonSample',
	kind: Control,
	classes: 'button-sample',
	components: [
		{content: 'Buttons', classes: 'section'},
		{kind: Button, content: 'Action Button', ontap: 'buttonToggleTapped'},
		{kind: Button, name: 'toggleButton', disabled: true, content: 'Disabled Button', ontap: 'buttonTapped'},
		{content: 'Grouped Buttons', classes: 'section'},
		{kind: Group, onActivate: 'groupButtonsActivated', components: [
			{kind: Button, content: 'Grouped Button 1'},
			{kind: Button, content: 'Grouped Button 2'},
			{kind: Button, content: 'Grouped Button 3'}
		]},
		{content: 'Image Button', classes: 'section'},
		{kind: Button, content: 'Image Button', classes: 'image-button', ontap: 'buttonTapped', components: [
			{kind: Image, src: 'assets/enyo-logo.png', alt: 'Enyo Logo'}
		]},
		{name: 'results', classes: 'results'}
	],
	buttonTapped: function(inSender, inEvent) {
		this.updateResult({content: 'The "' + inSender.getContent() + '" button is tapped.'});
	},
	buttonToggleTapped: function(inSender, inEvent) {
		this.buttonTapped(inSender, inEvent);
		this.$.toggleButton.setDisabled(!this.$.toggleButton.getDisabled()).setContent(this.$.toggleButton.getDisabled() ? 'Disabled Button' : 'Enabled Button');
	},
	groupButtonsActivated: function(inSender, inEvent) {
		if (inEvent.originator.getParent().getActive()) {
			this.updateResult({content: 'The "' + inEvent.originator.getParent().getActive().getContent() + '" button is selected.'});
		}
	},
	updateResult: function(inComponent) {
		this.$.results.destroyClientControls();
		this.$.results.createComponent(inComponent);
		this.$.results.render();
	}
});
