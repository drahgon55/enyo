/**
* @module enyo/roots
*/

var roots = {};

/**
* @private
*/
var callbacks = [],
	rootList = [];

/**
* Registers a single callback to be executed whenever a root view is rendered.
* 
* @name enyo.rendered
* @method
* @param {Function} method - The callback to execute.
* @param {Object} [context=enyo.global] The context under which to execute the callback.
* @public
*/
roots.rendered = function (method, context) {
	callbacks.push({method: method, context: context || globalThis});
};

/**
* @private
*/
roots.roots = rootList;

/**
* Invokes all known callbacks (if any) against the root view once it has been rendered.
* This method is not likely to be executed very often.
* 
* @private
*/
function invoke (root) {
	callbacks.forEach(function (ln) {
		ln.method.call(ln.context, root);
	});
}

/**
* @private
*/
roots.addToRoots = function (view) {
	var rendered,
		destroy;
	
	// since it is possible to call renderInto more than once on a given view we ensure we
	// don't register it twice unnecessarily
	if (rootList.indexOf(view) === -1) {
		
		rootList.push(view);
		
		// hijack the rendered method
		rendered = view.rendered;
		
		// hijack the destroy method
		destroy = view.destroy;
		
		// supply our rendered hook
		view.rendered = function () {
			// we call the original first
			rendered.apply(this, arguments);
			
			// and now we invoke the known callbacks against this root
			invoke(this);
		};
		
		// supply our destroy hook
		view.destroy = function () {
			var idx = rootList.indexOf(this);
			
			// remove it from the roots array
			if (idx > -1) rootList.splice(idx, 1);
			
			// now we can call the original
			destroy.apply(this, arguments);
		};
	}
};

export default roots;
