/*
	Implementation notes:
	-	The RichText methods involving selection (HTML5 selection object) require
		that the RichText object have focus first.
*/

/**
* A port of upstream's `samples/RichTextSample.js` (enyojs/enyo, tag
* `2.5.1-release`) to ES modules.
*
* A `RichText` with bold/italic/underline, select-all, deselect, home and end
* driven from buttons, and a button that prints the value back out with its
* markup intact.
*
* Upstream's root kind had no `kind:` property and relied on the default; it
* is `Control` explicitly here (see README, "The default kind").
*
* @module enyo/samples/RichTextSample
*/

import kind from '../src/kind.js';
import Button from '../src/Button/Button.js';
import Control from '../src/Control/Control.js';
import RichText from '../src/RichText/RichText.js';

export default kind({
	name: 'enyo.sample.RichTextSample',
	kind: Control,
	classes: 'rich-text-sample',
	components: [
		{content: 'Rich Text', classes: 'section'},
		{kind: Button, ontap: 'buttonFormatTapped', action: 'bold', components: [
			{tag: 'strong', content: 'b'}
		]},
		{kind: Button, ontap: 'buttonFormatTapped', action: 'italic', components: [
			{tag: 'em', content: 'i'}
		]},
		{kind: Button, ontap: 'buttonFormatTapped', action: 'underline', components: [
			{tag: 'u', content: 'u'}
		]},
		{kind: Button, content: 'Select All', ontap: 'buttonSelectAllTapped'},
		{kind: Button, content: 'Deselect All', ontap: 'buttonDeselectAllTapped'},
		{kind: Button, content: 'Home', ontap: 'buttonHomeTapped'},
		{kind: Button, content: 'End', ontap: 'buttonEndTapped'},
		{kind: RichText, value: 'Input <em>any</em> text (HTML tags will be preserved)'},
		{kind: Button, content: 'Show RichText Value', classes: 'button-value', ontap: 'buttonValueTapped'},
		{name: 'results', classes: 'results'}
	],
	buttonSelectAllTapped: function(inSender, inEvent) {
		this.$.richText.focus();
		this.$.richText.selectAll();
	},
	buttonDeselectAllTapped: function(inSender, inEvent) {
		this.$.richText.focus();
		this.$.richText.removeSelection();
	},
	buttonHomeTapped: function(inSender, inEvent) {
		this.$.richText.focus();
		this.$.richText.moveCursorToStart();
	},
	buttonEndTapped: function(inSender, inEvent) {
		this.$.richText.focus();
		this.$.richText.moveCursorToEnd();
	},
	buttonFormatTapped: function(inSender, inEvent) {
		this.$.richText.focus();
		document.execCommand(inSender.action, false, this.$.richText.getSelection());
		this.$.richText.updateValue();
	},
	buttonValueTapped: function(inSender, inEvent) {
		this.$.results.setContent(this.$.richText.getValue());
	}
});
