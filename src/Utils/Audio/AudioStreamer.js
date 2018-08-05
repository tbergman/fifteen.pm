class AudioStreamer {
  
  // A class which handles Web Audio API Interaction given an Audio Element

  constructor(audioElement) {
    this.element = audioElement
    this.context = new (window.AudioContext || window.webkitAudioContext)();

    // init nodes
    this.analyser = this.context.createAnalyser();
    this.filter   = this.context.createBiquadFilter();
    
    // set defaults which will be unnoticeable
    this.filter.frequency.value = 25000;
    this.filter.type = "lowpass";
    this.source = undefined;
  }
  
  // TODO: figure out how to parameterize connection / routing of Nodes
  connect() {
    window.onload = () => {
      this.source = this.context.createMediaElementSource(this.element);
      this.source.connect(this.analyser);
      this.analyser.connect(this.filter);
      this.filter.connect(this.context.destination);
    }
  }
}

export {AudioStreamer};