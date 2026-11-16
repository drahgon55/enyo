#!/usr/bin/env node
/**
 * Headless checks for `this.inherited(arguments)`.
 *
 *     node test-esm/inherited.node.mjs
 *
 * Exits non-zero if any check fails. These duplicate part of index.html, but
 * run with no browser at all, which matters for the one piece of enyo that is
 * both easy to break and independent of the DOM: `kind`'s super-call
 * machinery. `kind.inherited` used `arguments.callee`, a TypeError under
 * strict mode, so methods using the idiom are wrapped at kind-creation time to
 * record themselves.
 *
 * Every check here asserts an observed effect -- a return value, a call trace,
 * the text of the warning. An earlier version asserted only that the call did
 * not throw, and that version passed with the mechanism completely disabled,
 * because a broken mechanism also warns and returns undefined.
 */

// enyo's core reaches for a few browser globals on the way in.
globalThis.window = globalThis;
try {
	Object.defineProperty(globalThis, 'navigator',
		{value: {userAgent: 'node', platform: 'node'}, configurable: true});
} catch (e) { /* already present */ }
globalThis.document = {
	createElement: () => ({style: {}, setAttribute () {}, appendChild () {}}),
	documentElement: {style: {}},
	addEventListener () {}, removeEventListener () {},
	readyState: 'complete', body: null
};

const kind = (await import('../src/kind.js')).default;
const CoreObject = (await import('../src/CoreObject.js')).default;

const results = [];
const check = (name, pass, detail) => results.push({pass, name, detail: detail ?? ''});

const trace = [];
const Base = kind({name: 'InhBase', kind: CoreObject,
	greet: function (who) { trace.push('Base:' + who); return 'base(' + who + ')'; },
	orphan: function () { return this.inherited(arguments); }});
const Middle = kind({name: 'InhMiddle', kind: Base,
	greet: function (who) { trace.push('Middle:' + who); return 'middle[' + this.inherited(arguments) + ']'; }});
const Leaf = kind({name: 'InhLeaf', kind: Middle,
	greet: function (who) { trace.push('Leaf:' + who); return 'leaf[' + this.inherited(arguments) + ']'; }});
const Swapper = kind({name: 'InhSwapper', kind: Leaf,
	greet: function (who) { return this.inherited(arguments, ['swapped']); }});

const out = new Leaf().greet('x');
check('three-deep chain returns the composed value', out === 'leaf[middle[base(x)]]', JSON.stringify(out));
check('each level ran exactly once, deepest last',
	trace.join(',') === 'Leaf:x,Middle:x,Base:x', trace.join(','));

trace.length = 0;
const swapped = new Swapper().greet('original');
check('replacement arguments reach the super',
	swapped === 'leaf[middle[base(swapped)]]' &&
	trace.join(',') === 'Leaf:swapped,Middle:swapped,Base:swapped',
	JSON.stringify(swapped) + ' / ' + trace.join(','));

check('methods not using the idiom are left unwrapped',
	!Base.prototype.greet._inheritedWrapped && !!Middle.prototype.greet._inheritedWrapped,
	'Base.greet wrapped=' + !!Base.prototype.greet._inheritedWrapped +
	' Middle.greet wrapped=' + !!Middle.prototype.greet._inheritedWrapped);

// The warning must name the method it came from, which needs the executing
// method to have been identified. Asserting only "did not throw" here passed
// with the mechanism disabled.
const warnings = [];
const realWarn = console.warn;
console.warn = (...a) => warnings.push(a.join(' '));
let threw = null, res;
try { res = new Base().orphan(); }
catch (e) { threw = String(e); }
finally { console.warn = realWarn; }
check('missing super warns, naming the method',
	!threw && res === undefined && warnings.some(w => w.includes('InhBase.orphan()')),
	threw || JSON.stringify(warnings));

for (const r of results) {
	console.log((r.pass ? 'PASS  ' : 'FAIL  ') + r.name + (r.detail ? '  — ' + r.detail : ''));
}
const failed = results.filter(r => !r.pass).length;
console.log('\n' + (failed ? failed + ' of ' + results.length + ' FAILED' : results.length + '/' + results.length + ' passed'));
process.exit(failed ? 1 : 0);
