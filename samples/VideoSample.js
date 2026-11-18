/**
* A port of upstream's `samples/VideoSample.js` (enyojs/enyo, tag
* `2.5.1-release`) to ES modules.
*
* An `enyo/Video` with play, pause, fast-forward, rewind and jump driven from
* buttons, position and duration read back out of its events, and two buttons
* that swap the source between a single `src` and a set of
* `sourceComponents`.
*
* This is the one sample whose media upstream hot-linked that is still up, so
* the `media.w3.org` and `vjs.zencdn.net` URLs are unchanged -- which does
* mean this sample, alone, needs a network.
*
* Upstream's root kind had no `kind:` property and relied on the default; it
* is `Control` explicitly here (see README, "The default kind").
*
* @module enyo/samples/VideoSample
*/

import kind from '../src/kind.js';
import Anchor from '../src/Anchor.js';
import Button from '../src/Button/Button.js';
import Control from '../src/Control/Control.js';
import Video from '../src/Video.js';

export default kind({
	name: 'enyo.sample.VideoSample',
	kind: Control,
	classes: 'video-sample',
	components: [
		{content: 'Video', classes: 'section'},
		{classes: 'container-video', components: [
			{
				kind: Video,
				poster: 'http://media.w3.org/2010/05/bunny/poster.png',
				preload: 'auto',
				src: 'http://vjs.zencdn.net/v/oceans.mp4',
				onratechange: 'rateChanged',
				ontimeupdate: 'timeChanged',
				ondurationchange: 'durationChanged',
				onFastforward: 'playbackChanged',
				onRewind: 'playbackChanged',
				onPlay: 'playbackChanged',
				ontap: 'togglePlayback'
			},
			{kind: Anchor, name: 'playOverlay', ontap: 'playVideo'}
		]},
		{kind: Button, content: 'Play', ontap: 'playVideo'},
		{kind: Button, content: 'Pause', ontap: 'pauseVideo'},
		{kind: Button, content: '<< RW', ontap: 'buttonRewindTapped'},
		{kind: Button, content: 'FF >>', ontap: 'buttonFastForwardTapped'},
		{kind: Button, content: '< Jump', ontap: 'buttonJumpBackwardTapped'},
		{kind: Button, content: 'Jump >', ontap: 'buttonJumpForwardTapped'},
		{kind: Button, content: 'Loop', ontap: 'buttonToggleLoopTapped'},
		{kind: Button, content: 'Use src', ontap: 'buttonUseSrcTapped'},
		{kind: Button, content: 'Use sourceComponents', ontap: 'buttonUseSourceComponentsTapped'},
		{name: 'results', classes: 'results', components: [
			{classes: 'result-section', components: [
				{classes: 'result-label', content: 'Position:'},
				{name: 'videoPosition'}
			]},
			{classes: 'result-section', components: [
				{classes: 'result-label', content: 'Duration:'},
				{name: 'videoDuration'}
			]},
			{classes: 'result-section', components: [
				{classes: 'result-label', content: 'Action:'},
				{name: 'videoAction'}
			]}
		]}
	],
	bindings: [
		{from: '.isPlaying', to: '.$.playOverlay.showing', transform: function(inValue) {
			return !inValue;
		}}
	],
	playbackChanged: function(inSender, inEvent) {
		if (inEvent.playbackRate > 1) {
			this.$.videoAction.setContent('Fast-Forward');
		} else if (inEvent.playbackRate < -1) {
			this.$.videoAction.setContent('Rewind');
		} else if (inEvent.playbackRate == 1) {
			this.$.videoAction.setContent('Play');
		}
		return true;
	},
	togglePlayback: function(inSender, inEvent) {
		if (this.get('isPlaying')) {
			this.pauseVideo(arguments);
		} else {
			this.playVideo(arguments);
		}
		return true;
	},
	playVideo: function(inSender, inEvent) {
		this.set('isPlaying', true);
		this.$.video.play();
		this.$.videoAction.setContent('Play');
		return true;
	},
	pauseVideo: function(inSender, inEvent) {
		this.set('isPlaying', false);
		this.$.video.pause();
		this.$.videoAction.setContent('Pause');
		return true;
	},
	buttonRewindTapped: function(inSender, inEvent) {
		this.$.video.rewind();
		return true;
	},
	buttonFastForwardTapped: function(inSender, inEvent) {
		this.$.video.fastForward();
		return true;
	},
	buttonJumpBackwardTapped: function(inSender, inEvent) {
		this.$.video.jumpBackward();
		this.$.videoAction.setContent('Jump Backward ' + this.$.video.getJumpSec() + 's');
		return true;
	},
	buttonJumpForwardTapped: function(inSender, inEvent) {
		this.$.video.jumpForward();
		this.$.videoAction.setContent('Jump Forward ' + this.$.video.getJumpSec() + 's');
		return true;
	},
	buttonToggleLoopTapped: function(inSender, inEvent) {
		this.$.video.setLoop(!this.$.video.getLoop());
		this.$.videoAction.setContent('Looping ' + (this.$.video.getLoop() ? 'Enabled' : 'Disabled'));
		return true;
	},
	buttonUseSrcTapped: function(inSender, inEvent) {
		this.pauseVideo();
		this.$.video.set('src', 'http://media.w3.org/2010/05/bunny/movie.mp4');
	},
	buttonUseSourceComponentsTapped: function(inSender, inEvent) {
		this.pauseVideo();
		this.$.video.set('sourceComponents', [
			{src: 'http://media.w3.org/2010/05/bunny/movie.mp4', type: 'video/mp4'},
			{src: 'http://media.w3.org/2010/05/bunny/movie.ogv', type: 'video/ogg'},
			{src: 'http://media.w3.org/2010/05/bunny/movie.webm', type: 'video/webm'}
		]);
	},
	rateChanged: function(inSender, inEvent) {
		this.$.videoAction.setContent('Playback ' + inEvent.playbackRate + 'x');
		return true;
	},
	timeChanged: function(inSender, inEvent) {
		this.$.videoPosition.setContent(Math.floor(inEvent.currentTime) + 's');
		return true;
	},
	durationChanged: function(inSender, inEvent) {
		this.$.videoDuration.setContent((inEvent.target && inEvent.target.duration ? Math.floor(inEvent.target.duration) : 0) + 's');
		return true;
	}
});
