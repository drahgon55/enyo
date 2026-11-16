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
| `require('enyo/kind')` (66 calls) | `import kind from '../kind.js'` | `enyo/x` is a package specifier only a bundler or an import map resolves; `src/x.js` is always a sibling, so a relative path is exact. |
| `require('../Control')` (20 distinct, 55 calls) | `import Control from '../Control/Control.js'` | ESM has no directory resolution. Each of these pointed at a directory whose `package.json` named a `main` (e.g. `src/Control/package.json` → `Control.js`); that file is now named directly. The `package.json` files are left in place for enyo-dev. |

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

## Verification

Static:

- All 165 files parse as ES modules (`node --check` on each, renamed `.mjs`).
- All 550 import specifiers resolve to a file that exists.
- No `require(`, `module.exports` or bare `exports` remains in executable code.

In a browser (Chrome, served by `python3 -m http.server`, console clean — no
errors, no warnings, every request 200):

- `test-esm/index.html` — imports `kind`, `Control`, `ready`, `utils` and the
  package root from `../src/`, builds a three-deep Control tree, renders it into
  the page, dispatches a real DOM click at a kind with an `ontap` handler, and
  checks that the handler ran and that `set('content', ...)` re-rendered. 10/10 pass.
- `test-esm/all-modules.html` — imports each of the 164 modules under `src/`
  separately. 164/164 evaluate; only `touch.js` has no default export, which is
  correct (it never exported anything).

Regenerate the module list after adding or removing a file in `src/`:

```bash
node -e "const fs=require('fs'),path=require('path');function w(d,o=[]){for(const e of fs.readdirSync(d,{withFileTypes:true}).sort((a,b)=>a.name<b.name?-1:1)){const p=path.join(d,e.name);e.isDirectory()?w(p,o):e.name.endsWith('.js')&&o.push(p)}return o};fs.writeFileSync('test-esm/modules.js','export default '+JSON.stringify(w('src').map(f=>'../'+f),null,1)+';\n')"
```

## Still outstanding

**Onyx is not converted.** The widget set lives in its own repository
(`enyojs/onyx`) and is still CommonJS. It needs the same treatment — the same
three export shapes, the same `.js` extensions, the same `enyo/x` → relative
rewrite — before the widget set is usable from ESM. Until then this branch gives
you the framework (kinds, Controls, layout, data, bindings) but no Onyx widgets.
Onyx also ships `.less` files that enyo-dev compiled; without a build step those
need compiling ahead of time or replacing with the generated CSS.

**Doc-comment examples still say `require()`.** 51 code samples inside JSDoc
blocks across 22 files show the CommonJS form:

```js
* var kind = require('enyo/kind'),
*     Control = require('enyo/Control');
```

They are inside comments, so nothing breaks, but anyone copying them gets a
hard error. Left alone deliberately: rewriting them is pure documentation churn
in a diff that is meant to stay reviewable against upstream, and the indentation
and wrapping vary enough that it is not a safe one-pass substitution. Worth a
separate commit.

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
