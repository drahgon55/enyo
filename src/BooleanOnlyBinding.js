/**
* Contains the declaration for the {@link module:enyo/BooleanOnlyBinding~BooleanOnlyBinding} kind.
* @module enyo/BooleanOnlyBinding
*/

import kind from './kind.js';
import Binding from './Binding.js';

/**
* An {@link module:enyo/Binding~Binding} that will only propagate changes if the value is a {@glossary Boolean}.
*
* @class BooleanOnlyBinding
* @extends module:enyo/Binding~Binding
* @public
*/
export default kind(
	/** @lends module:enyo/BooleanOnlyBinding~BooleanOnlyBinding.prototype */ {
	
	name: 'enyo.BooleanOnlyBinding',
	
	/**
	* @private
	*/
	kind: Binding,
	
	/**
	* @private
	*/
	transform: function (value, direction, binding) {
		return (typeof value == 'boolean') ? value : binding.stop();
	}
});
