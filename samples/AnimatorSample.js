/**
* A port of upstream's `samples/AnimatorSample.js` (enyojs/enyo, tag
* `2.5.1-release`) to ES modules.
*
* The same bar animation run twice over: once while an expensive job is
* deferred to the next frame, once while it is not. The second pass stutters
* visibly, which is the point.
*
* `enyo.easing.linear` is `animation.easing.linear` here. Upstream's root kind
* had no `kind:` property and relied on the default; it is `Control`
* explicitly here (see README, "The default kind").
*
* @module enyo/samples/AnimatorSample
*/

import kind from '../src/kind.js';
import animation from '../src/animation.js';
import Animator from '../src/Animator.js';
import Control from '../src/Control/Control.js';

export default kind({
	name: 'enyo.sample.AnimatorSample',
	kind: Control,
	components: [
		{content: 'Smooth Animation:', name: 'deferText', showing: false},
		{content: 'Choppy Animation:', name: 'nondeferText'},
		{name: 'dot', style: 'width: 10px; height: 10px; background-color: red;'},
		{kind: Animator, duration: 3000, startValue: 0, endValue: 10000, onStep: 'stepAnimation', onEnd: 'animationEnded', easingFunction: animation.easing.linear}
	],
	stepAnimation: function(inSender, inEvent) {
		var v = inSender.value/100;
		this.$.dot.applyStyle('width', v + '%');
	},
	/* an expensive operation: */
	expensive: function(){
		globalThis.RANDSTRING = '';
		for (var i = 1; i < 100000; ++i) {
			globalThis.RANDSTRING += Math.random();
		}
	},
	animationEnded: function(){
		this.doAnimation();
	},
	rendered: function(){
		this.inherited(arguments);
		this.doAnimation();
	},
	defer: false,
	doAnimation: function(){
		this.startJob('doAnimation', function(){
			if(this.defer){
				this.startJob('expensive', 'expensive', 1000, 1);
			} else {
				this.startJob('expensive', 'expensive', 1000);
			}
			this.$.deferText.setShowing(this.defer);
			this.$.nondeferText.setShowing(!this.defer);
			this.$.animator.play();
			this.defer = !this.defer;
		}, 500);
	}
});
