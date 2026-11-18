/**
* A port of upstream's `samples/AudioSample.js` (enyojs/enyo, tag
* `2.5.1-release`) to ES modules.
*
* Play/pause, fast-forward, rewind, jump and loop over an `enyo/Audio`, with
* the duration and position read back out of its events.
*
* Upstream streamed four clips from `noiseaddicts.com`; none of those URLs
* resolves any more, so the sample had nothing to play. The four clips in
* `assets/` are generated stand-ins -- four voices counting to seventy-five --
* and they are counting precisely so that fast-forward, rewind and the
* thirty-second jumps are audible rather than merely plausible.
*
* `enyo.mixin` is `utils.mixin`, `enyo.job` is the default export of
* `src/job.js`. Upstream's root kind had no `kind:` property and relied on the
* default; it is `Control` explicitly here (see README, "The default kind").
*
* @module enyo/samples/AudioSample
*/

import kind from '../src/kind.js';
import utils from '../src/utils.js';
import job from '../src/job.js';
import Audio from '../src/Audio.js';
import Button from '../src/Button/Button.js';
import Control from '../src/Control/Control.js';
import Popup from '../src/Popup/Popup.js';
import Select from '../src/Select.js';

export default kind({
	name: 'enyo.sample.AudioSample',
	kind: Control,
	classes: 'audio-sample',
	components: [
		{
			kind: Audio,
			onratechange: 'rateChanged',
			ontimeupdate: 'timeChanged',
			onFastforward: 'playbackChanged',
			onRewind: 'playbackChanged',
			onPlay: 'playbackChanged',
			onPause: 'playbackChanged',
			onLoadedMetaData: 'metaDataLoaded'
		},
		{content: 'Audio', classes: 'section'},
		{kind: Select, name: 'selectAudio', onchange: 'selectChanged', components: [
			{content: 'Counting to 75 (Samantha)', active: true},
			{content: 'Counting to 75 (Daniel)'},
			{content: 'Counting to 75 (Karen)'},
			{content: 'Counting to 75 (Moira)'}
		]},
		{content: 'Playback', classes: 'section'},
		{kind: Button, content: 'Play', ontap: 'togglePlay'},
		{kind: Button, content: '<< Rewind', ontap: 'buttonRewindTapped'},
		{kind: Button, content: 'Fast Forward >>', ontap: 'buttonFastForwardTapped'},
		{kind: Button, content: '< Jump Backward', ontap: 'buttonJumpBackwardTapped'},
		{kind: Button, content: 'Jump Forward >', ontap: 'buttonJumpForwardTapped'},
		{kind: Button, content: 'Loop', ontap: 'buttonLoopTapped'},
		{name: 'results', classes: 'results'},
		{kind: Popup, name: 'popupStatus', floating: true, centered: true, classes: 'popup'}
	],
	sounds: [
		'assets/count-samantha.m4a',
		'assets/count-daniel.m4a',
		'assets/count-karen.m4a',
		'assets/count-moira.m4a'
	],
	rendered: function() {
		this.inherited(arguments);
		this.loadAudio(this.$.selectAudio.getSelected());
	},
	metaDataLoaded: function(inSender, inEvent) {
		this.timeChanged(inSender, utils.mixin(inEvent, {duration: this.$.audio.getDuration(), currentTime: this.$.audio.getCurrentTime()}));
	},
	playbackChanged: function(inSender, inEvent) {
		if (inEvent.type === 'onPause') {
			this.displayPopup('Pause');
		} else if (inEvent.originator.playbackRate > 1) {
			this.displayPopup('Fast-Forward');
		} else if (inEvent.originator.playbackRate < -1) {
			this.displayPopup('Rewind');
		} else if (inEvent.originator.playbackRate == 1) {
			this.displayPopup('Play');
		}
	},
	loadAudio: function(inIndex) {
		this.$.audio.setSrc(this.sounds[inIndex]);
		this.$.button.setContent('Play');
	},
	playAudio: function() {
		this.$.audio.play();
		this.$.button.setContent('Pause');
	},
	pauseAudio: function() {
		this.$.audio.pause();
		this.$.button.setContent('Play');
	},
	togglePlay: function(inSender, inResponse) {
		if (this.$.audio.getPaused()) {
			this.playAudio();
		} else {
			this.pauseAudio();
		}
	},
	buttonRewindTapped: function(inSender, inEvent) {
		this.$.audio.rewind();
	},
	buttonFastForwardTapped: function(inSender, inEvent) {
		this.$.audio.fastForward();
	},
	buttonJumpBackwardTapped: function(inSender, inEvent) {
		this.$.audio.jumpBackward();
		this.displayPopup('Jump Backward ' + this.$.audio.getJumpSec() + 's');
	},
	buttonJumpForwardTapped: function(inSender, inEvent) {
		this.$.audio.jumpForward();
		this.displayPopup('Jump Forward ' + this.$.audio.getJumpSec() + 's');
	},
	buttonLoopTapped: function(inSender, inEvent) {
		this.$.audio.setLoop(!this.$.audio.getLoop());
		this.displayPopup('Looping ' + (this.$.audio.getLoop() ? 'Enabled' : 'Disabled'));
	},
	rateChanged: function(inSender, inEvent) {
		this.displayPopup('Playback ' + inEvent.playbackRate + 'x');
	},
	timeChanged: function(inSender, inEvent) {
		this.$.results.setContent('Duration: ' + Math.floor(inEvent.duration) + 's, Current Position: ' + Math.floor(inEvent.currentTime) + 's');
	},
	selectChanged: function(inSender, inEvent) {
		this.loadAudio(inSender.selected);
	},
	displayPopup: function(inContent) {
		var popup = this.$.popupStatus;
		popup.setContent(inContent);
		popup.setShowing(true);
		job('autoHidePopup', function() {
			popup.hide();
		}, 1000);
	}
});
