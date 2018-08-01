import {isChrome, isFirefox} from "../BrowserDetection";

export function AudioStreamer(audioElement) {
  this.audioElement = audioElement;
  this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  this.analyser = this.audioCtx.createAnalyser();
  window.onload = () => {
    this.stream = captureStream(this.audioElement, this.audioCtx, this.analyser);
  };

  function captureStream(elt, ctx, analyser) {
    let stream;
    if (isFirefox) {
      stream = elt.mozCaptureStream();
    } else if (isChrome) {
      stream = elt.captureStream();
    }
    if (stream !== undefined) {
      if (isChrome) {
        stream.onactive = () => {
          createAudioSource(ctx, analyser, stream);
        };
      }
      else {
        createAudioSource(ctx, analyser, stream);
      }
      return stream;
    }
  }

  function createAudioSource(ctx, analyser, stream) {
    let source = ctx.createMediaStreamSource(stream);
    source.connect(analyser);
    source.connect(ctx.destination);
  }
}

