/**
* Contains the declaration for the {@link module:enyo/RelationalModel~Collection} kind.
* @module enyo/RelationalModel/Collection
* @private
*/

import kind from '../kind.js';
import Collection from '../Collection.js';

import Model from './Model.js';

/**
* Private class for a collection with a default model kind of
* {@link module:enyo/RelationalModel~RelationalModel} as opposed to {@link module:enyo/Model~Model}.
* 
* @class Collection
* @name module:enyo/RelationalModel~Collection
* @extends module:enyo/Collection~Collection
* @private
*/
module.exports = kind(
	/** @lends module:enyo/RelationalModel~Collection.prototype */ {
		
	/**
	* @private
	*/
	name: 'Collection',
	
	/**
	* @private
	*/
	kind: Collection,
	
	/**
	* @private
	*/
	model: Model
});
