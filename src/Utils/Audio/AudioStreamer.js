import {isChrome, isFirefox, isSafari} from "../BrowserDetection";

class AudioStreamer {
  
  // A class which handles Web Audio API Interaction given an Audio Element

  constructor(audioElement) {
    this.element = audioElement
    this.context = new (window.AudioContext || window.webkitAudioContext)();

    if (!isSafari) { 
      // init nodes
      this.analyser = this.context.createAnalyser();
      this.filter   = this.context.createBiquadFilter();
      this.filter.frequency.value = 25000;
      this.filter.type = "lowpass";
    }
    this.source = undefined;
  }
  
  // build signal path on-demand
  connect() {
    if (!isSafari) { 
      window.onload = () => {
        this.source = this.context.createMediaElementSource(this.element);
        this.source.connect(this.analyser);
        this.analyser.connect(this.filter);
        this.filter.connect(this.context.destination);
      }
    }
  }

  // TODO: function for disconnecting.
}

export default AudioStreamer;