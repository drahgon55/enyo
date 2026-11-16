/*jshint node:true */
'use strict';

/**
* Returns the global enyo options hash
* @module enyo/options
*/

export default (globalThis.enyo && globalThis.enyo.options) || {};
