# enyo samples

Upstream's own samples, ported to ES modules.

Enyo 2.6 deleted the `samples/` folder, so these come from `enyojs/enyo` at tag
`2.5.1-release`, the last tag that still had them. All 33 are here, with
upstream's per-sample stylesheets unchanged.

This mirrors what the `onyx` and `layout` forks do: a library's samples live in
the library they demonstrate, exactly as upstream had them.

## Running them

```bash
python3 ../../layout/test-layout/serve.py 8000 ~/Documents/ChatGPT
```

then open <http://localhost:8000/enyo/samples/index.html>.

The second argument is the directory that *holds* the checkouts, not a
checkout: the pages resolve bare specifiers through an import map, so `enyo`,
`layout` and `onyx` all have to sit side by side under the served root. (No
sample here needs `enyo-ilib`.)

`serve.py` lives in the layout fork and exists for exactly this. Use it rather
than `python3 -m http.server`: the latter lets the browser cache ES modules, so
a reload can silently re-run stale code.

## How this is laid out, and why it differs from upstream

Upstream gave each sample its own `.html`, which in 2015 cost three `<script>`
tags per page. Without a loader each page needs an import map and a dozen
stylesheet links, and 33 copies of that is 33 files to edit every time a path
moves. So instead:

| file | what it is |
| --- | --- |
| `index.html` | the menu: every sample, with a line on what it shows |
| `sample.html` | the host page: `sample.html?s=ButtonSample` renders any one |
| `samples.js` | the manifest both pages read |
| `<Name>Sample.js` | the ported sample, one module each |
| `<Name>Sample.css` | upstream's, unchanged |
| `assets/` | the images and audio upstream hot-linked (see below) |

Adding a sample is one `.js` file and one line in `samples.js`.

`sample.html` renders the sample into a bare `<body class="onyx">` with no
chrome of its own, exactly as upstream's pages did, so nothing here can shift a
sample's layout — several of them are `enyo-fit` and own the whole viewport.
Use the browser's Back button to get back to the index. `?s=` is checked
against the manifest rather than being interpolated straight into the import.

**The per-sample stylesheets are still per-sample**, loaded by the host page
from the manifest and awaited before the sample renders. That is not only
fidelity: several of them define the same unscoped selector — `.popup` is in
`AudioSample.css`, `PopupSample.css` and `VideoSample.css`, with different
colours — so one concatenated sheet would have samples restyling each other.
Awaiting the `<link>` matters too, because several samples are `enyo-fit` and
lay themselves out from what they measure at render time. Four samples had no
stylesheet upstream and are marked `css: false` in the manifest, so the page
does not ask for a file that is not there.

### Which spelling imports what

The samples import **enyo itself by relative path** (`../src/kind.js`) and
**the sibling libraries by bare specifier** (`layout/src/Panels/Panels.js`,
`onyx/src/Button/Button.js`). That is the rule the rest of this repository
already follows — `MIGRATION.md` explains why `src/` rewrote every `enyo/x`
into a relative path — and it keeps the samples working whatever an embedding
page decides to call this checkout in its import map.

`sample.html`'s map still carries `enyo/` anyway, because onyx and layout
import enyo that way. Both spellings have to resolve to the same URL or the
framework would be instantiated twice; served from a common parent they do.

## What the port changed

The 2.5 originals are global-style enyo: `enyo.kind({...})` with every kind
named by string (`kind: 'enyo.Button'`). Nothing resolves those strings here,
so each became an import and a direct constructor reference. That is the bulk
of the diff, and it is mechanical. Handler names stay strings (`ontap:
'buttonTapped'`) — those are looked up on the owner at dispatch time and still
work unchanged.

The global helpers moved to their modules: `enyo.forEach`/`clone`/`mixin` are
`utils.*`, `enyo.job` is the default export of `src/job.js`, `enyo.platform`,
`enyo.easing.linear` is `animation.easing.linear`, and `enyo.getPosition` and
`enyo.makeBubble` are both on `src/dispatcher.js`.

Beyond that, five things needed more than a rename.

### The default kind

Twenty of these samples declare their root kind with no `kind:` property, which
makes enyo fall back to `kind.getDefaultCtor()` — a value that is only set when
`src/Control/Control.js` is *evaluated* (its last line is
`kind.setDefaultCtor(Control)`). Under ES modules that is a load-order
question, and when the answer is "not yet" the kind is silently built on an
empty prototype: no error anywhere, the control simply never appears in the
DOM. Every such kind says `kind: Control` explicitly here.

In practice the imports of most samples drag `Control` in anyway.
`PageVisibilitySample` is the one that would not have: its only other import is
`Signals`, which descends from `Component`, not `Control`.

### Strings that used to name kinds

Two samples passed a kind name as a string to something other than `kind:`.
2.7 resolves such a name through `kind.constructorForKind`, which looks it up
on a global `enyo` namespace that ES modules do not create, so both now fail —
one loudly, one silently.

- **`ScrollerSample`** set `strategyKind: 'TouchScrollStrategy'` on three of
  its seven scrollers. That throws `[TouchScrollStrategy] is not the name of a
  valid kind.` The property has taken a constructor since 2.6 — `Scroller`'s
  own default is one — so the three strategies are imported and passed
  directly.
- **`StylesheetSupportSample`** wrote `mixins: ['enyo.StylesheetSupport']`.
  That one does not throw: `MixinSupport` logs `Could not find the mixin
  enyo.StylesheetSupport` and carries on, leaving the control without any of
  the API the sample then calls. The imported mixin object goes in the array.

### Modules that work by being loaded

`PageVisibilitySample` has to `import pageVisibility from '../src/pageVisibility.js'`
even though it never names it beyond reading `pageVisibility.hidden`: that
module installs the `visibilitychange` listener as a side effect of being
evaluated. With no loader pulling in the whole framework, nothing else here
reaches it, and the sample would render one line and never move again.

### Helper kinds that were globals

`GestureSample` (`EventItem`), `ComponentOverrideSample` (`SampleKind`,
`SubSampleKind`) and `PositionSample` (`PositionSampleNested`) declared helper
kinds as globals and then referred to them by name — including
`PositionSample`'s `defaultKind:`. They are module-local constants now,
referenced directly, and keep their `name:` so the kind names you see in an
inspector are unchanged.

### `Image.placeholder`

`ImageSample` reads the placeholder data URI off the constructor
(`enyo.Image.placeholder` → `Image.placeholder`), which is still a static in
2.7. Note that 2.6 also added a published `placeholder` *property* with the
same name and a different meaning — the image shown while `src` loads, `''` by
default. `Image.prototype.placeholder` is that one, and gives you an empty
string.

## The assets upstream hot-linked

Upstream linked images, sprite sheets and audio from other people's servers.
Ten years on, most of those URLs are gone, and the samples that used them
showed empty boxes. What is in `assets/` now:

| what | where it came from |
| --- | --- |
| `enyo-logo.png` | upstream's own `enyojs.com/img/enyo-logo.png`, recovered from the Internet Archive (used by Anchor, Button, DragAvatar and Image) |
| `burst-sprite.png`, `fish-sprite.png` | **generated** by `assets/make-sprites.py`, with the exact geometry `SpriteAnimationSample` declares |
| `count-*.m4a` | **generated** with macOS `say`: four voices counting to seventy-five |
| `sample-data.json`, `sample-data-jsonp.js` | canned responses for the three network samples |

The two sprite sheets upstream used (an explosion from `polybeast.de`, a fish
from `media.pyweek.org`) are both gone, and they were other people's artwork in
any case. The stand-ins keep 4×5 cells of 320×240 stepped horizontally and
16×3 cells of 50×50 stepped vertically, so the sample still demonstrates what
it set out to: the two `cellOrientation` values, and what `duration` does to
each. `make-sprites.py` writes them with nothing but `zlib`.

`AudioSample` streamed four clips from `noiseaddicts.com`, which 404s. The
clips are counting rather than music so that fast-forward, rewind and the
thirty-second jumps are audible rather than merely plausible.

`VideoSample` is the one sample whose media is still up, so its `media.w3.org`
and `vjs.zencdn.net` URLs are unchanged — and it is therefore the one sample
that needs a network.

## The services upstream called

`AjaxSample`, `JsonpSample` and `WebServiceSample` all called Yahoo's YQL
service, which was shut down in 2019. Their one interesting action produced
nothing but a network error.

They now call files in `assets/`: `sample-data.json` over XHR, and
`sample-data-jsonp.js` for JSON-P. The second needs no server of its own — a
JSON-P response *is* a script, so the file reads the callback name out of its
own `<script>` src (`enyo_jsonp_callback_<n>`, which `src/Jsonp.js` puts
there) and calls it, which is all a JSON-P endpoint ever does. The request
machinery is exercised exactly as before; the URL box in `AjaxSample` still
takes anything you type.

`AjaxSample` and `WebServiceSample` also used to do this in their error
handlers:

```js
(JSON.parse(inSender.xhrResponse.body)).error.description
```

which is what YQL sent back, and which throws inside the error handler for any
other kind of failure — a static server's HTML 404 page, say, or an empty body.
Both report whatever they actually got now.

## A bug in the original sample

**`WebServiceSample`'s AJAX / JSON-P picker never switched anything.** It read

```js
this.$.yql.send({q: ..., jsonp: (this.$.picker.getSelected().indexInContainer()==2)});
```

but `jsonp` is a property of the `WebService` control, not a request parameter:
`send()` reads `this.jsonp` to choose between `Ajax` and `JsonpRequest`. Passed
in the params object it was merely serialised into the query string, so both
settings made the same XHR. Against YQL that was invisible, since the response
was the same either way. It is set on the service now, and the two transports
really are two transports.

## Three bugs in `src/`, all fixed

None is in the samples. All three were invisible until something exercised
them in a current browser.

**`dom.updateScaleFactor()` could store a scale factor of 0.** It set
`_bodyScaleFactorX/Y` from the body's measured size over the window size,
unconditionally. On a cold load the body can measure 0 — a page that renders an
`enyo-fit` control into `document.body` has only an absolutely positioned
child, so the body's own size comes from `enyo-body-fit` in `css/enyo.css`,
which may not have applied at the instant `Control.renderInto()` calls this.
A 0 is not merely wrong: `gesture/util.makeEvent()` multiplies every
`down`/`move`/`up` coordinate by it, so the drag deltas stay 0, no
`ondragstart` is ever dispatched, and **all dragging stops for the life of the
page** — taps still work, nothing is logged. `renderInto()` is the only caller
and there is no resize hook, so a page that lost that race stayed undraggable.
It now refuses a zero or non-finite factor. Found in the `layout` fork, where
`PanelsSample` came up undraggable on a cold first load.

**`Media.setPlaybackRate()` threw on every rewind.** `rewind()` walks
`playbackRateHash.rewind` — `['-2', '-4', '-8', '-16']` — and
`setPlaybackRate()` assigned the result straight to `node.playbackRate` before
asking whether the platform needs the software fallback. No current browser
implements reverse playback, and they do not ignore a negative rate: assigning
one throws `NotSupportedError`. So the assignment took the method down before
it could reach `beginRewind()`, the fallback written for exactly this case and
documented as "until browsers support negative playback rate". The assignment
is now made only where a negative rate is accepted. `AudioSample`'s Rewind
button threw on the first tap.

**DataList and DataGridList shipped no usable stylesheet.** Nearly every module
under `src/` has a compiled `.css` beside its `.js`; eight have only `.less`,
which reaches a page only through a build step that runs the LESS compiler —
and this branch has no build step. For DataList those rules are not decoration:
`.enyo-data-list` is where the list gets `height: 100%`, and `.page`/`.active`/
`.buffer` get the positioning its virtual pages are laid out with. Without them
the list measures 0 however big its container is and renders two rows into a
box of no size; DataGridList loses `position: absolute` on its items and stacks
them in one column. Both now ship a `.css` flattened from their `.less` (the
`.less` is untouched, and `package.json` still points the enyo-dev pipeline at
it).

The other six LESS-only modules — `LightPanels`, `Scrollable`,
`SlideViewLayout`, `ViewLayout`, `ViewManager` and `Control/fullscreen` — are
left alone: nothing here exercises them, and `fullscreen.less` pulls in
`css/mixins.less`, so it is not a flattening to do blind. **If you write a page
against one of those modules with no build step, it will have no styles.**

## Two things the samples cannot show you here

Neither is a fault in the sample; both are the environment.

**Media seeking needs a server that answers Range requests, and `serve.py`
does not.** `SimpleHTTPRequestHandler` has no `Accept-Ranges`, so Chrome marks
the stream non-seekable (`audio.seekable` is empty even once the whole file is
buffered) and every seek clamps to 0. `AudioSample`'s Jump Forward / Jump
Backward therefore jump to the beginning. Checked against a range-capable
server: with `206` responses the same buttons step ±30s exactly as they should.
Everything else in that sample — play, pause, fast-forward, rewind, loop, the
source picker, the duration and position readouts — works over `serve.py`.
`VideoSample` is unaffected because `media.w3.org` serves ranges.

**`FullscreenSample` cannot take the screen inside an embedded browser pane.**
`requestFullscreen()` is rejected there with `TypeError: Permissions check
failed`, by policy, before enyo is involved. Nothing throws and nothing is
logged; the box just does not grow. In an ordinary browser window it is fine.
Enyo's own fallback path (`enyo-fullscreen`, used where the native API is
missing) was exercised instead, and the box goes full-bleed and back.

## Verified

All 33 samples load with no console messages of any kind — checked by walking
the whole menu in a clean tab and reading the console once at the end — and
each one's interactive parts were driven in a browser:

- **Tapping, typing, binding**: Button (disabled toggle, highlander group,
  image button), Checkbox, Group (all five groups), Input and TextArea
  (`oninput` and `onchange` readouts, the disabled toggle), Anchor and Image
  (typing in a box rewrites the live control, and back), Select (three selects
  into one applied transition), RichText (select-all, bold, value with its
  markup), Table (the current month, today marked).
- **Dragging**: DragAvatar (the avatar appears on drag, tracks the pointer and
  hides on release), Gesture (`down`, `dragstart`, `drag`, `dragover`, `move`,
  `flick`, `up`, `tap` all dispatched and listed, plus the options panel, the
  truncate switch and the single-event filter), Scroller (the picker switches
  all seven panels, and a drag-and-flick scrolls the touch strategy).
- **Popups and drawers**: Popup (centred, scrimmed, modal — including that a
  tap outside does not dismiss it — at the event position, in the upper right,
  and the one that hides itself after two seconds), Drawer (vertical, the
  nested one with its animation switch, horizontal in a `FittableColumns`),
  Fullscreen (via the fallback, see above).
- **Data**: DataRepeater (100 rows), DataList (virtualised — scrolled to index
  80 and the rows change), DataGridList (a reflowing three-column grid),
  Repeater and NestedRepeater (26 and 3×26, indices and colours).
- **Network**: Ajax (response, and the error path with its popup), Jsonp,
  WebService (both transports, now that the picker works).
- **Media**: Audio (play/pause, the source picker, fast-forward, rewind, loop,
  and the jumps against a range-capable server), Video (play, the position and
  duration readouts, jump, and the switch from `src` to `sourceComponents`).
- **The rest**: Animator (the bar runs 0→100% and restarts, alternating its
  smooth and choppy labels), SpriteAnimation (both sheets, `steps(4, start)`
  and `steps(3, start)`, with the pickers bound to `duration`),
  StylesheetSupport (typing CSS restyles the control, and Erase clears it),
  PageVisibility (a `visibilitychange` reaches the sample through `Signals` and
  the log grows), Platform (the readout follows a resize), Position (the six
  coordinates follow the pointer), ComponentOverride (the subkind's two
  overridden components really are buttons).

Animation-driven checks were made with `animation.requestAnimationFrame`
shimmed onto timers: the verifying browser ran the page in a hidden pane, where
the compositor stops calling `requestAnimationFrame` altogether and nothing
Animator- or ScrollMath-driven advances. That is a property of the test
harness, not of the samples.
