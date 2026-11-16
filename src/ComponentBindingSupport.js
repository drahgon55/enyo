/**
* Exports the {@link module:enyo/ComponentBindingSupport~ComponentBindingSupport} mixin.
* @module enyo/ComponentBindingSupport
*/


import kind from './kind.js';

/**
* An internally-used {@glossary mixin} applied to {@link module:enyo/Component~Component}
* instances to better support [bindings]{@link module:enyo/Binding~Binding}.
*
* @mixin
* @protected
*/
var ComponentBindingSupport = {
	
	/**
	* @private
	*/
	name: 'ComponentBindingSupport',
	
	/**
	* @private
	*/
	adjustComponentProps: kind.inherit(function (sup) {
		return function (props) {
			sup.apply(this, arguments);
			props.bindingTransformOwner || (props.bindingTransformOwner = this.getInstanceOwner());
		};
	})
};

module.exports = ComponentBindingSupport;
