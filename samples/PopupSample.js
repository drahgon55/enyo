/*
	Implementation notes:
	-	The Popup At Event Position popup has property floating:true to mitigate the sampler's
		horizontal scroll offset (the control that allows the side navigation to be dragged
		closed and open).
*/

/**
* A port of upstream's `samples/PopupSample.js` (enyojs/enyo, tag
* `2.5.1-release`) to ES modules.
*
* Nine popups, one per behaviour: auto-dismiss, not, modal, centred, scrimmed,
* at the event position, at a fixed position, one that hides itself after two
* seconds, and a floating one that stays put while the page scrolls past it.
*
* `enyo.job` is the default export of `src/job.js`.
*
* @module enyo/samples/PopupSample
*/

import kind from '../src/kind.js';
import job from '../src/job.js';
import Button from '../src/Button/Button.js';
import Popup from '../src/Popup/Popup.js';
import Scroller from '../src/Scroller/Scroller.js';

export default kind({
	name: 'enyo.sample.PopupSample',
	kind: Scroller,
	classes: 'popup-sample',
	components: [
		{content: 'Popups', classes: 'section'},
		{kind: Button, name: 'buttonBasicAuto', content: 'Basic Popup (Auto Dismiss)', ontap: 'showPopup', popup: 'popupBasicAuto'},
		{kind: Popup, name: 'popupBasicAuto', classes: 'popup', content: 'Tap Outside Popup To Dismiss'},
		{classes: 'divider'},
		{kind: Button, name: 'buttonBasic', content: 'Basic Popup', ontap: 'showPopup', popup: 'popupBasic'},
		{kind: Popup, name: 'popupBasic', autoDismiss: false, classes: 'popup', content: 'Press Basic Popup Button To Dismiss (Tapping Outside Registers Event)'},
		{classes: 'divider'},
		{kind: Button, name: 'buttonModal', content: 'Modal Popup', ontap: 'showPopup', popup: 'popupModal'},
		{kind: Popup, name: 'popupModal', modal: true, autoDismiss: false, classes: 'popup', components: [
			{content: 'Modal Popup (Tapping Outside Does Not Register Event)'},
			{kind: Button, name: 'buttonCloseModal', content: 'Close', ontap: 'closeModal'}
		]},
		{classes: 'divider'},
		{kind: Button, name: 'buttonCentered', content: 'Centered Popup', ontap: 'showPopup', popup: 'popupCentered'},
		{kind: Popup, name: 'popupCentered', centered: true, classes: 'popup', content: 'Centered Popup'},
		{classes: 'divider'},
		{kind: Button, name: 'buttonScrim', content: 'Popup With Scrim', ontap: 'showPopup', popup: 'popupScrim'},
		{kind: Popup, name: 'popupScrim', centered: true, floating: true, scrim: true, classes: 'popup', content: 'Popup With Scrim'},
		{classes: 'divider'},
		{kind: Button, name: 'buttonAtEventPosition', content: 'Popup At Event Position', ontap: 'showPopupAtEventPosition', popup: 'popupEventPosition'},
		{kind: Popup, name: 'popupEventPosition', floating: true, classes: 'popup', content: 'Popup At Event Position'},
		{classes: 'divider'},
		{kind: Button, name: 'buttonAtPosition', content: 'Popup At Specific Position', ontap: 'showPopupAtPosition', popup: 'popupPosition'},
		{kind: Popup, name: 'popupPosition', classes: 'popup', content: 'Popup In Upper Right'},
		{classes: 'divider'},
		{kind: Button, name: 'buttonAutoHide', content: 'Auto Hide Popup', ontap: 'showPopupAutoHide', popup: 'popupAutoHide'},
		{kind: Popup, name: 'popupAutoHide', classes: 'popup', content: 'This Popup Will Disappear In 2s'},
		{classes: 'divider'},
		{kind: Button, name: 'buttonFloating', content: 'Floating Popup', ontap: 'showPopupFloating', popup: 'popupFloating'},
		{kind: Popup, name: 'popupFloating', floating: true, centered: true, classes: 'popup floating', content: 'This Popup Will Not Scroll', onHide: 'hideFloating'},
		{name: 'priority', classes: 'priority', showing: false, content: 'This Content Is Scrollable'},
		{name: 'results', classes: 'results'}
	],
	handlers: {
		ontap: 'tap'
	},
	tap: function(inSender, inEvent) {
		this.$.results.destroyClientControls();
		this.$.results.createComponent({
			content: 'Event  "' + inEvent.type + '" from "' + inEvent.originator.getName() + '".'
		});
		this.$.results.render();
	},
	closeModal: function(inSender, inEvent) {
		this.$.popupModal.setShowing(false);
	},
	hideFloating: function(inSender, inEvent) {
		this.$.priority.hide();
	},
	showPopup: function(inSender, inEvent) {
		var p = this.$[inSender.popup];
		if (p) {
			// toggle the visibility of the popup
			p.setShowing(!p.getShowing());
		}
	},
	showPopupAtEventPosition: function(inSender, inEvent) {
		var p = this.$[inSender.popup];
		if (p) {
			p.showAtEvent(inEvent);
		}
	},
	showPopupAtPosition: function(inSender, inEvent) {
		var p = this.$[inSender.popup];
		if (p) {
			p.showAtPosition({right: 0, top: 0});
		}
	},
	showPopupAutoHide: function(inSender, inEvent) {
		var p = this.$[inSender.popup];
		if (p) {
			p.setShowing(true);
			job('autoHidePopup', function() {
				p.hide();
			}, 2000);
		}
	},
	showPopupFloating: function(inSender, inEvent) {
		this.$.priority.setShowing(true);
		var p = this.$[inSender.popup];
		if (p) {
			p.showAtEvent(inEvent);
		}
	}
});
