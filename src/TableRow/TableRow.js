/**
* Contains the declaration for the {@link module:enyo/TableRow~TableRow} kind.
* @module enyo/TableRow
*/

import kind from '../kind.js';
import Control from '../Control/Control.js';
import TableCell from '../TableCell/TableCell.js';

/**
* {@link module:enyo/TableRow~TableRow} implements an HTML [&lt;tr&gt;]{@glossary tr} element.
*
* @class TableRow
* @extends module:enyo/Control~Control
* @ui
* @public
*/
module.exports = kind(
	/** @lends module:enyo/TableRow~TableRow.prototype */ {

	/**
	* @private
	*/
	name: 'enyo.TableRow',

	/**
	* @private
	*/
	kind: Control,

	/**
	* @private
	*/
	tag: 'tr',

	/**
	* @private
	*/
	defaultKind: TableCell,

	// Accessibility

	/**
	* @default row
	* @type {String}
	* @see enyo/AccessibilitySupport~AccessibilitySupport#accessibilityRole
	* @public
	*/
	accessibilityRole: 'row'
});
