/**
* A port of upstream's `samples/ImageSample.js` (enyojs/enyo, tag
* `2.5.1-release`) to ES modules.
*
* An image with its `src` and `alt` two-way bound to inputs, and the built-in
* placeholder graphic underneath.
*
* The image is `assets/enyo-logo.png` rather than the long-dead `enyojs.com`
* copy. `enyo.Image.placeholder` is `Image.placeholder`: still a static on the
* constructor in 2.7, and not to be confused with the `placeholder` *property*
* of the same name that 2.6 added, which is `''` by default and is the image
* shown while `src` loads.
*
* Upstream's root kind had no `kind:` property and relied on the default; it
* is `Control` explicitly here (see README, "The default kind").
*
* @module enyo/samples/ImageSample
*/

import kind from '../src/kind.js';
import Control from '../src/Control/Control.js';
import Image from '../src/Image/Image.js';
import Input from '../src/Input/Input.js';

export default kind({
	name: 'enyo.sample.ImageSample',
	kind: Control,
	classes: 'image-sample',
	components: [
		{content: 'Image', classes: 'section'},
		{kind: Image, src: 'assets/enyo-logo.png', alt: 'Enyo Logo'},
		{kind: Input, name: 'inputSrc', type: 'text', placeholder: 'Image URL'},
		{kind: Input, name: 'inputAlt', type: 'text', placeholder: 'Image Alt Text'},
		{content: 'Placeholder Image', classes: 'section'},
		{kind: Image, src: Image.placeholder, alt: 'Placeholder Image', classes: 'placeholder'}
	],
	bindings: [
		{from: '.$.image.src', to: '.$.inputSrc.value', oneWay: false},
		{from: '.$.image.alt', to: '.$.inputAlt.value', oneWay: false}
	]
});
