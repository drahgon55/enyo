/**
* Contains the declaration for the {@link module:enyo/Table~Table} kind.
* @module enyo/Table
*/

import kind from '../kind.js';
import Control from '../Control/Control.js';
import TableRow from '../TableRow/TableRow.js';

/*
* TODO: Should facade certain useful table functionality (specific set TBD).
*/

/**
* {@link module:enyo/Table~Table} implements an HTML [&lt;table&gt;]{@glossary table} element.
* This is a work in progress.
*
* @class Table
* @extends module:enyo/Control~Control
* @ui
* @public
*/
export default kind(
	/** @lends module:enyo/Table~Table.prototype */ {

	/**
	* @private
	*/
	name: 'enyo.Table',

	/**
	* @private
	*/
	kind: Control,

	/**
	* @private
	*/
	tag: 'table',

	/**
	* @private
	*/
	attributes: {
		cellpadding: '0',
		cellspacing: '0'
	},

	/**
	* @private
	*/
	defaultKind: TableRow,

	// Accessibility

	/**
	* @default grid
	* @type {String}
	* @see enyo/AccessibilitySupport~AccessibilitySupport#accessibilityRole
	* @public
	*/
	accessibilityRole: 'grid'
});
