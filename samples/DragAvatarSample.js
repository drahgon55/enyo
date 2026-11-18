/**
* A port of upstream's `samples/DragAvatarSample.js` (enyojs/enyo, tag
* `2.5.1-release`) to ES modules.
*
* Drag anywhere on the page and a `DragAvatar` follows the pointer, offset
* above it, until you let go.
*
* Upstream's root kind had no `kind:` property and relied on the default; it
* is `Control` explicitly here (see README, "The default kind"). The image is
* `assets/enyo-logo.png` rather than the long-dead `enyojs.com` copy.
*
* @module enyo/samples/DragAvatarSample
*/

import kind from '../src/kind.js';
import Control from '../src/Control/Control.js';
import DragAvatar from '../src/DragAvatar.js';
import Image from '../src/Image/Image.js';

export default kind({
	name: 'enyo.sample.DragAvatarSample',
	kind: Control,
	classes: 'drag-avatar-sample',
	components: [
		{content: 'Start dragging anywhere on the screen (open sample in new tab).'},
		{kind: DragAvatar, offsetX: 0, offsetY: 64, components: [
			{kind: Image, name: 'imageAvatar', src: 'assets/enyo-logo.png'}
		]}
	],
	handlers: {
		ondrag: 'drag',
		ondragfinish: 'dragFinish'
	},
	drag: function(inSender, inEvent) {
		this.$.dragAvatar.drag(inEvent);
	},
	dragFinish: function(inSender, inEvent) {
		this.$.dragAvatar.hide();
	}
});
