/**
* Contains the declaration for the {@link module:enyo/ToolDecorator~ToolDecorator} kind.
* @module enyo/ToolDecorator
*/



import kind from '../kind.js';
import GroupItem from '../GroupItem.js';

/**
* {@link module:enyo/ToolDecorator~ToolDecorator} lines up [components]{@link module:enyo/Component~Component} in a row,
* centered vertically.
*
* @class ToolDecorator
* @extends module:enyo/GroupItem~GroupItem
* @ui
* @public
*/
export default kind(
	/** @lends module:enyo/ToolDecorator~ToolDecorator.prototype */ {

	/**
	* @private
	*/
	name: 'enyo.ToolDecorator',

	/**
	* @private
	*/
	kind: GroupItem,

	/**
	* @private
	*/
	classes: 'enyo-tool-decorator'
});
