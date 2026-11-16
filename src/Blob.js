/**
* A polyfill for IE < 10. Returns the Browser's implementation of Blob, if available.
*
* @module enyo/Blob
* @public
*/

import utils from './utils.js';

var BlobCtor = null;

if (typeof Blob != 'undefined') {
	try {
		new Blob();
		BlobCtor = Blob;
	} catch (e) {}
}

if (!BlobCtor) {
	BlobCtor = _Blob;
}

function _Blob(inBufs, inOpts) {
	this.name = inOpts.name;
	this.type = inOpts.type || 'application/octet-stream';
	if (!utils.isArray(inBufs)) {
		throw new Error('enyo.Blob only handles Arrays of Strings');
	}
	if ((inBufs.length > 0) && typeof inBufs[0] !== 'string') {
		throw new Error('enyo.Blob only handles Arrays of Strings');
	}
	this._bufs = inBufs; // leave byte arrays un-touched
}

_Blob.prototype.getAsBinary = function() {
	var empty = '',
		content = empty.concat.apply(empty, this._bufs);
	return content;
};

export default BlobCtor;
