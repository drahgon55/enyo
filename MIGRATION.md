# Enyo 2.7.0 — CommonJS to native ES modules

This branch (`esm`, cut from tag `2.7.0`) converts `src/` and `index.js` from
CommonJS to native ES modules, so the framework loads in a browser from
`<script type="module">` with no bundler and no build step.

Nothing else is touched: `test/`, `tools/`, `gulpfile.js`, `package.json` and
the CSS are unchanged.

```
165 files changed, 1055 insertions(+), 1426 deletions(-)
```

To see it work, serve the repository root and open the harness:

```bash
python3 -m http.server 8000
```

then <http://localhost:8000/test-esm/index.html>. The page title reads
`ALL PASS` or `FAIL (n)`.

## What the conversion covers

- All 684 top-level `require()` calls in `src/` and `index.js` are now `import`
  declarations.
- Every `module.exports` / `exports.x` assignment is now an `export`.
- The free `global` identifier that enyo-dev injected into each module scope is
  now `globalThis`.

After conversion, no `require(`, `module.exports` or bare `exports` remains in
executable code under `src/` or in `index.js`.

## Bare specifiers: rewritten, not mapped

No import map is needed, and none is shipped. Zero-config was the point, and an
import map would have to be repeated in every page that loads enyo.

Three kinds of specifier needed rewriting:

| Was | Now | Why |
| --- | --- | --- |
| `require('./kind')` | `import kind from './kind.js'` | The browser resolver does not add extensions. |
| `require('enyo/kind')` (16 calls) | `import kind from '../kind.js'` | `enyo/x` is a package specifier only a bundler or an import map resolves; `src/x.js` is always a sibling, so a relative path is exact. |
| `require('../Control')` (20 distinct, 55 calls) | `import Control from '../Control/Control.js'` | ESM has no directory resolution. Each of these pointed at a directory whose `package.json` named a `main` (e.g. `src/Control/package.json` → `Control.js`); that file is now named directly. The `package.json` files are left in place for enyo-dev. |

### How the doc examples reference the package

The 58 CommonJS code samples inside JSDoc comments were converted too — they
were the last `require()` and `module.exports` left anywhere in `src/`:

```diff
-* var
-* 	kind = require('enyo/kind'),
-* 	Control = require('enyo/Control');
+* import kind from 'enyo/src/kind.js';
+* import Control from 'enyo/src/Control/Control.js';
 *
-* module.exports = kind({
+* export default kind({
```

Each specifier was resolved against the real tree, so directory requires name
their actual file (`enyo/Control` → `enyo/src/Control/Control.js`,
`enyo/RelationalModel` → `enyo/src/RelationalModel/index.js`). Two examples were
wrong before the conversion and are now correct: `enyo/floatingLayer` pointed at
a path that does not exist (the module is `src/Control/floatingLayer.js`), and
one example read `require('enyo/CoreObject').Object` when that module exports
the kind directly.

`enyo/src/kind.js` is a bare package specifier, so a page with no build step
needs a one-line import map telling the browser where the checkout is:

```html
<script type="importmap">
{ "imports": { "enyo/": "/node_modules/enyo/" } }
</script>
```

That is a choice the examples make, not a requirement of the framework. Nothing
in `src/` uses a bare specifier — every import inside the package is relative,
and `test-esm/index.html` imports straight from `../src/` with no map at all.
The examples use the package form because the alternative, `./enyo/src/kind.js`,
bakes a directory layout into every example in the documentation.

`test-esm/importmap.html` is the same framework loaded the documented way, so
the recipe above is checked rather than asserted.

### `require('enyo')` was dropped

134 files opened with a bare `require('enyo');` — no binding, just the
statement. It resolved to the package root `index.js`, which re-exports
`src/options.js`. Neither has side effects (`options.js` only reads
`globalThis.enyo.options`, and nothing in `src/` ever writes `global.enyo`), so
outside the bundler these statements did nothing. Keeping them would have added
134 imports of the package root to no purpose, so they are gone. Modules that
actually use the options hash still `import options from './options.js'`
directly.

### Runtime `require()` calls

There were none. All 684 calls were at module top level, so nothing needed
hoisting and no `await import()` was introduced. The two `require('./x').prop`
forms (`SystemMonitor` reaching for `utils.perfNow`, `BackgroundTaskManager`
for `PriorityQueue.Priorities`) were split into an import plus a property read.

## Circular dependencies: there were none

This was expected to be the hard part. It wasn't — the top-level dependency
graph of `src/` + `index.js` is **acyclic**.

That was established before any code was changed, by building the graph from
all 684 resolved `require()` calls (165 nodes, 684 edges) and running both
Tarjan's SCC algorithm and an independent DFS back-edge check. Both found zero
cycles and zero self-loops. The suspected `kind.js → enyo → kind` cycle does not
exist: `index.js` imports only `src/options.js`, which imports nothing.

Because the graph is acyclic, ESM's evaluation order is a valid topological
order — the same order CommonJS produced — so no module needed restructuring,
no import was moved to its point of use, no shared leaf module was split out,
and no dynamic `import()` was used anywhere.

This is checked continuously rather than taken on trust:
`test-esm/all-modules.html` imports each of the 164 modules under `src/`
individually. A cycle introduced later would surface there as a TDZ
`ReferenceError`.

## Export shapes

Three patterns, chosen per file by how the module already exported:

1. **Single value** (140 files, nearly all `kind()` calls).
   `module.exports = kind({...})` became `export default kind({...})` in place.
   Where the value was also bound locally — `var Control = module.exports = kind(...)` —
   the local binding stays and `export default Control;` is appended at the end
   of the file.

2. **Namespace objects** (19 files: `utils`, `kind`, `logger`, `platform`,
   `job`, `macroize`, `animation`, `cookie`, `i18n`, `roots`, `dev`,
   `gesture`, `Binding`, `Application`, `Collection`, `PriorityQueue`,
   `LightPanel`, `LightPanels`, `ViewManager`). These built up an object by hanging
   properties off `exports`. Each now declares a module-local object under the
   name importers already use for it, and default-exports it:

   ```js
   var utils = {};
   ...
   utils.mixin = function () { ... };
   ...
   export default utils;
   ```

   Only the `exports` token changes; the bodies are untouched. `roots.js` also
   renames its internal array to `rootList`, because the module object takes the
   name `roots`.

3. **Conditional exports** (`Blob.js`, `FormData.js`, `LocalStorageSource.js`).
   These assigned `module.exports` from inside a feature test, which `export`
   cannot appear in. Each now assigns a module-local binding inside the test and
   exports it at the end. `LocalStorageSource` still yields an empty object on
   platforms without `localStorage`, as it did before.

### Named exports

Only two exist: `Priorities` from `src/PriorityQueue.js` (which
`BackgroundTaskManager` imports directly), and `version` from `index.js`.

Everything else is default-export-only, deliberately. Every call site inside
`src/` uses the whole-namespace form (`utils.mixin(...)`, `kind.singleton(...)`),
which works unchanged against a default-exported object. Generating named
exports for all ~60 properties of `utils` and the rest would have roughly
doubled the diff, and for properties that are reassigned at runtime the named
binding would go stale. If a consumer wants `import { mixin } from 'enyo/utils'`,
that is a follow-up and a separate, additive change.

## `global` became `globalThis`

enyo-dev injected `global` as a parameter of every module wrapper. There is no
wrapper now, and `global` is not defined in a browser, so all 86 free-identifier
uses across 27 files are rewritten to `globalThis`. Property keys (`global: false`
in `Controller.js`), property reads (`this.global`) and comments are untouched.

The alternative — asking each page to set `window.global = window` before loading
enyo — was rejected because it reintroduces exactly the configuration this branch
removes.

## The one behaviour change

ES modules are always strict mode, and `arguments.callee` and `Function.prototype.caller`
throw a `TypeError` there. `src/CoreObject.js` read both, to prefix log output
with the calling method's name:

- `Object#log()` read `arguments.callee.caller`
- the `log()` helper behind `Object#warn()` / `Object#error()` read `args.callee.caller`

Left alone, every `this.log()`, `this.warn()` and `this.error()` call would throw
— including the duplicate-component-name warning in `Component.js` that fires in
ordinary apps. Both sites now log without the caller's name. `Object#log()` prints
the `(instance method)` prefix that was already the fallback when the name could
not be determined.

(`Component.addEvent`'s `val.caller` is a plain property on a config hash, not
`Function.prototype.caller`, and is unaffected.)

### `this.inherited(arguments)` in `Scrim.js`

Found later, while converting onyx: `kind.inherited` reads `originals.callee`,
which throws the same `TypeError` under strict mode. Two places in `src/` called
it — `Scrim#create` and `Scrim#showingChanged` — and both now use the explicit
form the rest of `src/` already uses:

```diff
-		this.inherited(arguments);
+		Control.prototype.create.apply(this, arguments);
```

Those were the only two `this.inherited(` calls in `src/`. Without this, every
`enyo/Popup` with `autoDismiss` or `modal` set threw as soon as it was shown,
because `Popup#showHideScrim` constructs a `Scrim`. That is most onyx popups:
`onyx/Menu`, `onyx/Picker`, `onyx/Tooltip` and `onyx/ContextualPopup` were all
dead until this was fixed.

**`kind.inherited` is fixed.** It needed to know which function was executing,
which it got from `arguments.callee`. Methods that use the idiom now record
themselves instead: `kind.extendMethods` wraps them at kind-creation time, and
`kind.inherited` reads the recorded method rather than `arguments.callee`.

Only methods whose source mentions `.inherited(` are wrapped, decided once per
kind with `Function.prototype.toString()`. That matters, because the obvious
implementation — wrapping every method so every method knows its own identity —
would tax a framework built for mobile. Measured in Chrome:

| | |
| --- | --- |
| one-time scan of all 2128 methods enyo defines | 0.8 ms |
| methods wrapped in enyo's own `src/` | 0 |
| wrapper overhead on a method that *does* use the idiom | 1.7 ns/call |
| what `this.inherited(arguments)` already cost per call | ~174 ns |

Nothing in `src/` uses the idiom — 238 calls across 86 files use
`kind.inherit()` instead — so
the framework pays only the 0.8 ms. Application code that uses the documented
form pays 1.7 ns on top of a call that was already the slow path, which is why
`kind.inherit()` remains the faster option and is still what enyo recommends:

```js
// still the fast path
foo: kind.inherit(function (sup) {
	return function () { sup.apply(this, arguments); };
})
```

The nesting is handled: the recorded method is saved and restored around each
call, so a method that calls another method which also uses the idiom resolves
correctly, and a super that itself calls `this.inherited(arguments)` walks the
chain as before. Replacement arguments (`this.inherited(arguments, [...])`)
work unchanged. `test-esm/index.html` covers a three-deep chain, replacement
arguments, the missing-super warning, and that methods not using the idiom are
left unwrapped. `test-esm/inherited.node.mjs` runs the same five headlessly
(`node test-esm/inherited.node.mjs`, non-zero on failure) — the machinery is
independent of the DOM, and a check that needs no browser is one that actually
gets run.

Disabling the mechanism (`usesInherited` returning `false`) turns all five red.
That is worth stating precisely, because **the failure is silent**: nothing
throws. The super simply is not called, so a chain quietly loses a level and
returns `undefined` where a value was expected. An earlier version of the
missing-super check asserted only that the call did not throw, and it passed
with the mechanism completely disabled — a broken mechanism also warns and
returns `undefined`. It now asserts that the warning names the method
(`InhBase.orphan()` rather than `(unknown method)`), which is only possible if
the executing method was identified. Same lens as the vacuous checks above:
assert the observed effect, not the absence of an exception.

## Verification

Static:

- All 165 files parse as ES modules (`node --check` on each, renamed `.mjs`).
- All 550 import specifiers resolve to a file that exists.
- No `require(` or `module.exports` remains anywhere in `src/` or `index.js` —
  not in executable code, and not in a comment.

In a browser (Chrome, console clean — no errors, every request 200; the suite
deliberately emits one `kind.inherited` warning, from the check that a missing
super-method warns rather than throwing). **Serve with `python3 test-esm/serve.py [port]`, not `python3 -m
http.server`:** a plain server lets the browser cache the ES modules, and a
query string on the page URL does not bust them because the module specifiers
are unchanged. A reload then silently re-runs the *old* code and reports a pass
for a change that is not there. That is not hypothetical — it is how the
`Scrim.js` fix above first appeared to need no test. `serve.py` sends
`Cache-Control: no-store`.

- `test-esm/index.html` — 43 checks, all passing. It builds a three-deep Control
  tree, renders it into the page, dispatches a real DOM click at a kind with an
  `ontap` handler, checks that `set('content', ...)` re-rendered, and drives a
  `bindings:` declaration end to end (initial delivery plus propagation of an
  update). It also asserts the wiring of every module whose exports object was
  rebuilt by hand — that `job` is callable and still carries `.stop`/`.throttle`,
  that `macroize('hi {$who}', ...)` expands, that `Binding.DIRTY_FROM` and
  `Binding.defaultBindingKind === Binding` survived, that
  `PriorityQueue.Priorities === Priorities`, and so on. Evaluating cleanly is not
  the same as being wired correctly, so these are checked separately. Three
  checks cover the `Scrim` regression above: a floating `enyo/Popup` with a
  scrim is shown, and the scrim node must appear. Reverting `Scrim.js` makes
  those fail with the `callee` `TypeError`, which is how they were confirmed to
  be worth having. One clause asserted
  `typeof LocalStorageSource !== 'undefined'`, which could never fail — an
  import binding is always defined if the module resolved — and now asserts it
  is a real kind. A throw part-way through the suite is also reported as a
  failed check rather than leaving no result at all.

  Three classes of silent failure are now guarded, each verified by causing it:

  | broken on purpose | before | now |
  | --- | --- | --- |
  | removed a module's `export default` | page never ran, title unchanged, no result object | `FAIL (load)`, naming the module and the missing export |
  | `export default kind` instead of `export default kind(...)` | passed every `typeof x === 'function'` check | `FAIL`, `kindName = undefined` |
  | a module under `src/` with no default export | footnote on a passing run | counted as a failure |

  A missing export or unresolvable specifier is a *link*-time error: the module
  script never executes, so nothing inside it can report. A classic (non-module)
  script now watches for that and for the suite never finishing, because
  "produced no result" and "passed" looked identical from the outside.

  A related trap, in the prose rather than the code: **counting with `grep` over
  raw lines conflates comments with executable code.** Two figures in this file
  were wrong for that reason — `require('enyo/...')` read 66 when only 16 were
  executable (the other 50 were the JSDoc samples, converted separately), and
  `kind.inherit()` read 87 files when one of them mentions it only in a comment.
  Both now come from the tokenizer in `test-esm/`'s tooling, which blanks
  comments and strings before counting. The same confusion inflated onyx's
  require count from 184 to 282.

  There is a fifth shape, and it is not an assertion that cannot fail — it is a
  **gap**. The harness asserts everything except the thing that is wrong, and
  being green means nothing because nobody looked. The onyx session's svg
  harness scored 12/12 while every shape rendered black: the checks read
  `width`, `r`, `viewBox` and bounding boxes, all genuinely correct, and not one
  read a colour. This page had its own version — the checkbox existed, matched
  its stylesheet and occupied zero height, and `hasNode()` was perfectly happy.
  The cheap defence is the one that worked both times: **take a screenshot of a
  passing run and actually look at it.** A visual package is not verified until
  someone has. Then turn what you saw into an assertion, which is how
  `every rendered widget occupies a non-zero box` got written.

  There is a fourth case that needs no test at all to go wrong. While this work
  was running, a command printed `M src/glue.js` and the line directly below it
  announced that the repository was clean. The label won, and a broken loader
  was committed and pushed. **Evidence and summary were adjacent and
  contradicted each other, and only the summary was read.** It is the same
  disease one level up: an assertion whose truth the surrounding output already
  disproved. The habit that follows is dull and worth it — read `git status`
  before every commit, and never `git add -A` without looking at what it swept
  up.

  The pattern behind all of these, and behind the warm-registry bug above, is
  the same: **the check asserted something the harness itself guaranteed** — its
  own successful link, its own warm module registry, its own import. It is worth
  asking of any check here what part of it is already guaranteed by the page
  running at all. (The onyx session found the same three shapes independently;
  two of these came from its review.)
- `test-esm/all-modules.html` — loads each of the 164 modules under `src/`
  **in a document of its own**, via an iframe, so the module and its whole
  subgraph evaluate cold. 164/164, in about three seconds; only `touch.js` has
  no default export, which is correct (it never exported anything).

  It originally imported everything into one page, and that version was
  worthless as a cycle canary. A shared module registry means that after the
  first import most of the graph is already evaluated, so a later import cannot
  reproduce a first-load error. Injecting a real `utils` ↔ `kind` cycle, it
  still reported 164/164 OK; the cold-load version reports `FAIL (120)` with
  `Cannot access 'kind' before initialization`. Both numbers came from the same
  broken tree.
- `test-esm/check-cycles.mjs` — a static check of the same thing, and the one to
  trust. `node test-esm/check-cycles.mjs` builds the import graph and runs
  Tarjan over it, exiting non-zero on a cycle. Whether a cycle *throws* depends
  on evaluation order, so a browser check can miss one that happens to
  initialize workably from one entry point; the graph either has a cycle or it
  does not. Currently: 165 modules, 550 static imports, no cycles.
- `test-esm/importmap.html` — imports `enyo/src/kind.js` and
  `enyo/src/Control/Control.js` through an import map, exactly as the doc
  comments are now written, and clicks a handler. 4/4 pass.

Regenerate the module list after adding or removing a file in `src/`:

```bash
node -e "const fs=require('fs'),path=require('path');function w(d,o=[]){for(const e of fs.readdirSync(d,{withFileTypes:true}).sort((a,b)=>a.name<b.name?-1:1)){const p=path.join(d,e.name);e.isDirectory()?w(p,o):e.name.endsWith('.js')&&o.push(p)}return o};fs.writeFileSync('test-esm/modules.js','export default '+JSON.stringify(w('src').map(f=>'../'+f),null,1)+';\n')"
```

## The phone stack, composed

Each package has its own harness and each passes alone. That does not show they
compose, and the seams between packages are exactly where this kind of
conversion goes wrong — every cross-package specifier used to be the bundler's
job and is now the browser's.

`test-esm/stack.html` puts all four in one page — enyo, layout, onyx and
enyo-ilib, four separate checkouts, one import map, no build step — and renders
onyx widgets inside a layout fittable with a date formatted from real locale
data. **12/12.** It asserts computed styles rather than HTTP 200s, because a
stylesheet can return 200 with its variables unresolved and every selector
matching nothing.

Three things it found:

- **A bare specifier needs its own import-map entry.** `"onyx/": "/onyx/"` is a
  *prefix* mapping and does not resolve `import 'onyx'`. The page failed to
  link on exactly that the first time it ran. Every package that can be
  imported bare needs both entries — the same trap the onyx session found for
  `enyo-ilib`, which turns out to be general rather than specific to that
  package.
- **onyx's body-class effect is deferred.** `dom.addBodyClass` queues until a
  root view exists and `Control.renderInto` flushes it, so a check that runs
  before the first render sees an empty `className` and reads as a broken
  import. Assert that effect *after* the render, which is also when it has to
  be true.
- **A real cross-package cascade conflict.** layout ships
  `.enyo-fittable-columns-layout.enyo-stretch > * { height: 100% }`, which
  outranks onyx's `.onyx-checkbox { height: 32px }` on specificity — (0,2,0)
  against (0,1,0). The row's height is `auto`, so the percentage cannot resolve
  and an empty checkbox div collapses to nothing. Every check still passed; the
  render showed an invisible widget. This is upstream behaviour rather than a
  conversion defect, and it is precisely the kind of seam that only appears when
  two packages are on the same page.

And one limitation stated rather than hidden: **that body-class check cannot be
broken from this page.** Commenting out `import 'onyx'` leaves it passing,
because every onyx widget module begins `import '../../index.js'`, so the side
effect arrives transitively through Button, Checkbox, Toolbar and Item. The
break that targets it belongs in the onyx repository, where it was run. The
check is real at the stack level; it is simply verified elsewhere.

## Still outstanding

**Onyx is converted, on its own branch.** `drahgon55/onyx` branch `esm` is the
same treatment applied to the widget set, and its own `MIGRATION.md` covers what
differed there (notably that `require('onyx')` could not be dropped the way
`require('enyo')` was, and that cross-package `enyo/*` specifiers need an import
map). Onyx's `.less` files are compiled once into a committed `css/onyx.css`.

**`layout` and `enyo-ilib` are not converted.** Seven onyx modules import them
(`TabPanels`, `TabBar`, `MoreToolbar`, `FlyweightPicker`, `DatePicker`, and the
two under `src/i18n/`), so those stay unusable until those repositories get the
same treatment.

**`.jshintrc` and the gulp lint task are stale.** `.jshintrc` declares `require`,
`exports` and `module` as globals and sets `es3: true`; jshint cannot parse
`import`/`export` at all, so `gulp` lint over `src/` now fails outright. Fixing
it means moving to a linter that understands ESM (ESLint with
`sourceType: "module"`), which is a separate decision and out of scope here.

**`package.json` has no `"type": "module"`.** Deliberate. The browser does not
need it — `<script type="module">` and the `.js` extensions are enough. Adding it
would make Node treat every `.js` in the package as ESM, which would break
`gulpfile.js` and the CommonJS test tooling, both of which this branch leaves
alone. A Node consumer importing `enyo` today should use an explicit
`import ... from 'enyo/src/kind.js'` path, or the package needs an `exports`
map — again a separate change.

**Stylesheets are the page's job now.** Enyo 2.5 injected stylesheets with
`document.write`, which modern Chrome discards; enyo-dev concatenated them at
build time. With no loader and no build, a page links what it needs:

```html
<link rel="stylesheet" href="path/to/enyo/css/enyo.css">
```

`test-esm/index.html` does this, and the harness confirms the rules actually
apply.
