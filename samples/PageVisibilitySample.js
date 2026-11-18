/**
* A port of upstream's `samples/PageVisibilitySample.js` (enyojs/enyo, tag
* `2.5.1-release`) to ES modules.
*
* A running log of every page visibility change. Switch to another tab and
* back, or minimise the window, and a line is added.
*
* Two things had to change. `enyo.hidden` is `pageVisibility.hidden`. And
* `src/pageVisibility.js` has to be imported at all: it installs the
* `visibilitychange` listener as a side effect of being evaluated, and with no
* loader pulling in the whole framework, nothing else here reaches it --
* `Signals` alone would give you a sample that renders one line and then never
* moves. See README, "Modules that work by being loaded".
*
* Upstream's root kind had no `kind:` property and relied on the default; it
* is `Control` explicitly here (see README, "The default kind").
*
* @module enyo/samples/PageVisibilitySample
*/

import kind from '../src/kind.js';
import Control from '../src/Control/Control.js';
import pageVisibility from '../src/pageVisibility.js';
import Signals from '../src/Signals.js';

export default kind({
	name: 'enyo.sample.PageVisibilitySample',
	kind: Control,
	components: [
		{kind: Signals, onvisibilitychange: 'visibilitychanged'},
		{name: 'text', allowHtml: true}
	],
	rendered: function () {
		this.inherited(arguments);
		this.visibilitychanged();
	},
	visibilitychanged: function(){
		this.$.text.setContent(this.$.text.content + (Date().toString()) + (pageVisibility.hidden ? ': hidden' : ': visible') + '<br>');
	}
});
