/**
* A port of upstream's `samples/AnchorSample.js` (enyojs/enyo, tag
* `2.5.1-release`) to ES modules.
*
* A text anchor and an image anchor, each with inputs two-way bound to its
* `href`, `title` and content, so typing in a box rewrites the live anchor.
*
* Upstream's root kind had no `kind:` property and relied on the default; it
* is `Control` explicitly here (see README, "The default kind"). The image is
* `assets/enyo-logo.png` rather than the long-dead `enyojs.com` copy.
*
* @module enyo/samples/AnchorSample
*/

import kind from '../src/kind.js';
import Anchor from '../src/Anchor.js';
import Control from '../src/Control/Control.js';
import Image from '../src/Image/Image.js';
import Input from '../src/Input/Input.js';

export default kind({
	name: 'enyo.sample.AnchorSample',
	kind: Control,
	classes: 'anchor-sample',
	components: [
		{content: 'Text Anchor', classes: 'section'},
		{kind: Anchor, name: 'anchorText', href: 'http://www.enyojs.com', title: 'EnyoJS Framework Website', content: 'Visit the EnyoJS website'},
		{kind: Input, name: 'inputTextHref', type: 'text', placeholder: 'Anchor URL'},
		{kind: Input, name: 'inputTextTitle', type: 'text', placeholder: 'Anchor Title'},
		{kind: Input, name: 'inputTextContent', type: 'text', placeholder: 'Anchor Content'},
		{content: 'Image Anchor', classes: 'section'},
		{kind: Anchor, name: 'anchorImage', href: 'http://www.enyojs.com', title: 'EnyoJS Framework Website', components: [
			{kind: Image, name: 'anchorImageItem', src: 'assets/enyo-logo.png', alt: 'Enyo Logo'}
		]},
		{kind: Input, name: 'inputImageHref', type: 'text', placeholder: 'Anchor URL'},
		{kind: Input, name: 'inputImageTitle', type: 'text', placeholder: 'Anchor Title'},
		{kind: Input, name: 'inputImageSrc', type: 'text', placeholder: 'Anchor Image URL'}
	],
	bindings: [
		{from: '.$.anchorText.href', to: '.$.inputTextHref.value', oneWay: false},
		{from: '.$.anchorText.title', to: '.$.inputTextTitle.value', oneWay: false},
		{from: '.$.anchorText.content', to: '.$.inputTextContent.value', oneWay: false},
		{from: '.$.anchorImage.href', to: '.$.inputImageHref.value', oneWay: false},
		{from: '.$.anchorImage.title', to: '.$.inputImageTitle.value', oneWay: false},
		{from: '.$.anchorImageItem.src', to: '.$.inputImageSrc.value', oneWay: false}
	]
});
