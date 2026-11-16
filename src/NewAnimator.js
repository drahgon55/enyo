/**
* Contains the declaration for the {@link module:enyo/NewAnimator~NewAnimator} kind.
* @wip
* @private
* @module enyo/NewAnimator
*/


import kind from './kind.js';
import utils from './utils.js';

import CoreObject from './CoreObject.js';
import Loop from './Loop.js';

/**
* {@link module:enyo/NewAnimator~NewAnimator} is a work-in-progress
*
* @class NewAnimator
* @extends module:enyo/CoreObject~Object
* @wip
* @private
*/
export default kind.singleton(
	/** @lends module:enyo/NewAnimator~NewAnimator.prototype */ {
	name: 'enyo.NewAnimator',
	kind: CoreObject,
	animate: function(fn, duration) {
		var t0 = utils.perfNow(),
			cb = function() {
				var t = utils.perfNow(),
					p = Math.min(1, ((t - t0) / duration));

				fn(p);

				if (p < 1) {
					Loop.request(cb);
				}
			};

		Loop.request(cb);
	}
});
