/**
* A port of upstream's `samples/FullscreenSample.js` (enyojs/enyo, tag
* `2.5.1-release`) to ES modules.
*
* A box with a scroller in it that `requestFullscreen()` blows up to the whole
* screen and `cancelFullscreen()` puts back.
*
* Upstream's root kind had no `kind:` property and relied on the default; it
* is `Control` explicitly here (see README, "The default kind").
*
* @module enyo/samples/FullscreenSample
*/

import kind from '../src/kind.js';
import Control from '../src/Control/Control.js';
import Scroller from '../src/Scroller/Scroller.js';

import Button from 'onyx/src/Button/Button.js';
import GroupboxHeader from 'onyx/src/GroupboxHeader/GroupboxHeader.js';

export default kind({
	name: 'enyo.sample.FullscreenSample',
	kind: Control,
	classes: 'fullscreen-sample enyo-fit enyo-unselectable',
	components: [
		{name: 'sampleContent', classes: 'fullscreen-sample-container', components: [
			{kind: GroupboxHeader, content: 'Fullscreen Sample'},
			{kind: Scroller, classes: 'fullscreen-sample-scroller', components: [
				{content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?'}
			]},
			{kind: Button, content: 'Toggle Fullscreen', ontap: 'toggleFullscreen'}
		]}
	],
	//* Set/unset _this.$.sampleContent_ as fullscreen control
	toggleFullscreen: function(inSender, inEvent) {
		var targetControl = this.$.sampleContent;

		// If _targetControl_ is currently fullscreen, cancel fullscreen
		if (targetControl.isFullscreen()) {
			targetControl.cancelFullscreen();

		// If _targetControl_ is not currently fullscreen, request fullscreen
		} else {
			targetControl.requestFullscreen();
		}
	}
});
