/**
* The list of samples, shared by `index.html` (which renders it as the menu)
* and `sample.html` (which uses it to validate `?s=` before importing, and to
* know which stylesheet to pull in).
*
* Keeping it in one module is the reason a sample can be added by dropping in
* one `.js` file and one line here, instead of hand-writing another page.
*
* `css: false` marks the four samples upstream shipped with no stylesheet of
* their own -- without it the host page would ask for a file that is not
* there, and a 404 in the network log is exactly the kind of noise these pages
* are supposed to be free of.
*
* @module enyo/samples/samples
*/

export default [
	{name: 'AjaxSample', label: 'Ajax', blurb: 'An XHR through enyo/Ajax, with the response and the error path both shown.'},
	{name: 'AnchorSample', label: 'Anchor', blurb: 'Text and image anchors whose href, title and content are two-way bound to inputs.'},
	{name: 'AnimatorSample', label: 'Animator', css: false, blurb: 'The same animation with an expensive job deferred and not, so you can see it stutter.'},
	{name: 'AudioSample', label: 'Audio', blurb: 'Play, fast-forward, rewind, jump and loop over enyo/Audio, with position read back.'},
	{name: 'ButtonSample', label: 'Button', blurb: 'Buttons plain, disabled, grouped in a highlander Group, and with an image inside.'},
	{name: 'CheckboxSample', label: 'Checkbox', blurb: 'Checkboxes on their own and in a highlander Group.'},
	{name: 'ComponentOverrideSample', label: 'Component Override', css: false, blurb: 'A subkind rewriting two of its parent’s components through componentOverrides.'},
	{name: 'DataGridListSample', label: 'Data Grid List', blurb: 'A hundred models laid out as a reflowing grid by DataGridList.'},
	{name: 'DataListSample', label: 'Data List', blurb: 'The same hundred models through a virtualised, scrolling DataList.'},
	{name: 'DataRepeaterSample', label: 'Data Repeater', blurb: 'A DataRepeater over a Collection, one bound row per model.'},
	{name: 'DragAvatarSample', label: 'Drag Avatar', blurb: 'An image that follows the pointer while you drag, anywhere on the page.'},
	{name: 'DrawerSample', label: 'Drawer', blurb: 'A drawer inside a drawer, animated or not, and a horizontal one in a FittableColumns.'},
	{name: 'FullscreenSample', label: 'Fullscreen', blurb: 'requestFullscreen() and cancelFullscreen() on one control inside the page.'},
	{name: 'GestureSample', label: 'Gesture', blurb: 'Every gesture event enyo dispatches, listed with its properties as it arrives.'},
	{name: 'GroupSample', label: 'Group', blurb: 'Highlander groups, a named group a child opts out of, and multi-active groups.'},
	{name: 'ImageSample', label: 'Image', blurb: 'An image bound to its own src and alt, plus the built-in placeholder graphic.'},
	{name: 'InputSample', label: 'Input', blurb: 'One Input of every type, selectOnFocus, and a disabled one a button enables.'},
	{name: 'JsonpSample', label: 'Jsonp', blurb: 'A JSON-P request through enyo/Jsonp, response in a text area.'},
	{name: 'NestedRepeaterSample', label: 'Nested Repeater', blurb: 'A Repeater of Repeaters, reading its group out of inEvent.indices.'},
	{name: 'PageVisibilitySample', label: 'Page Visibility', css: false, blurb: 'A log of visibility changes. Switch tabs and come back to see it grow.'},
	{name: 'PlatformSample', label: 'Platform', blurb: 'What enyo thinks it is running on: user agent, window size, enyo/platform as JSON.'},
	{name: 'PopupSample', label: 'Popup', blurb: 'Nine popups: auto-dismiss, modal, centred, scrimmed, at an event, floating.'},
	{name: 'PositionSample', label: 'Position', css: false, blurb: 'The six pointer coordinates dispatcher.getPosition() keeps, live.'},
	{name: 'RepeaterSample', label: 'Repeater', blurb: 'A Repeater of twenty-six people, each row filled in by onSetupItem.'},
	{name: 'RichTextSample', label: 'Rich Text', blurb: 'Bold, italic, underline, select-all and cursor moves over a RichText.'},
	{name: 'ScrollerSample', label: 'Scroller', blurb: 'Seven scrollers — every strategy and axis — on a Panels the picker switches.'},
	{name: 'SelectSample', label: 'Select', blurb: 'Selects and OptionGroups driving a CSS transition applied to the sample itself.'},
	{name: 'SpriteAnimationSample', label: 'Sprite Animation', blurb: 'A sprite sheet stepped across its rows and another stepped down its columns.'},
	{name: 'StylesheetSupportSample', label: 'Stylesheet Support', blurb: 'A control carrying its own stylesheet, with the CSS editable in a text area.'},
	{name: 'TableSample', label: 'Table', blurb: 'The current month as a calendar, rows and cells created at runtime.'},
	{name: 'TextAreaSample', label: 'Text Area', blurb: 'A TextArea and a disabled one a button enables, with every change read back.'},
	{name: 'VideoSample', label: 'Video', blurb: 'enyo/Video driven from buttons, swapping between src and sourceComponents. Needs a network.'},
	{name: 'WebServiceSample', label: 'Web Service', blurb: 'One WebService making the same request over XHR and over JSON-P.'}
];
