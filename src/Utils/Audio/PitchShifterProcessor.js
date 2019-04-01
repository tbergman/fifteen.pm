import * as THREE from "three";

export function generatePitchShiftProcessor(sound, pitchRatio=undefined) {
  let validGranSizes = [256, 512, 1024, 2048, 4096, 8192]
  let grainSize = validGranSizes[1]
  let spectrumFFTSize = 128,
    spectrumSmoothing = 0.8,
    sonogramFFTSize = 2048,
    sonogramSmoothing = 0,
    overlapRatio = 0.50;
  let spectrumAudioAnalyser = sound.context.createAnalyser();
  spectrumAudioAnalyser.fftSize = spectrumFFTSize;
  spectrumAudioAnalyser.smoothingTimeConstant = spectrumSmoothing;

  let sonogramAudioAnalyser = sound.context.createAnalyser();
  sonogramAudioAnalyser.fftSize = sonogramFFTSize;
  sonogramAudioAnalyser.smoothingTimeConstant = sonogramSmoothing;

  let pitchShifterProcessor = sound.context.createScriptProcessor(grainSize, 1, 1);
  pitchShifterProcessor.buffer = new Float32Array(grainSize * 2);
  pitchShifterProcessor.grainWindow = hannWindow(grainSize);
  pitchShifterProcessor.onaudioprocess = function (event) {

    let linearInterpolation = (a, b, t) => {
      return a + (b - a) * t;
    }

    var inputData = event.inputBuffer.getChannelData(0);
    var outputData = event.outputBuffer.getChannelData(0);

    for (let i = 0; i < inputData.length; i++) {

      // Apply the window to the input buffer
      inputData[i] *= this.grainWindow[i];

      // Shift half of the buffer
      this.buffer[i] = this.buffer[i + grainSize];

      // Empty the buffer tail
      this.buffer[i + grainSize] = 0.0;
    }

    // Calculate the pitch shifted grain re-sampling and looping the input

    var grainData = new Float32Array(grainSize * 2);

    if (pitchRatio === undefined){
      pitchRatio = THREE.Math.randFloat(.5,5);
    }
    for (var i = 0, j = 0.0;
         i < grainSize;
         i++, j += pitchRatio) {

      var index = Math.floor(j) % grainSize;
      var a = inputData[index];
      var b = inputData[(index + 1) % grainSize];
      grainData[i] += linearInterpolation(a, b, j % 1.0) * this.grainWindow[i];
    }

    // Copy the grain multiple times overlapping it
    for (i = 0; i < grainSize; i += Math.round(grainSize * (1 - overlapRatio))) {
      for (j = 0; j <= grainSize; j++) {
        this.buffer[i + j] += grainData[j];
      }
    }

    // Output the first half of the buffer
    for (i = 0; i < grainSize; i++) {
      outputData[i] = this.buffer[i];
    }
  };

  pitchShifterProcessor.connect(spectrumAudioAnalyser);
  pitchShifterProcessor.connect(sonogramAudioAnalyser);
  pitchShifterProcessor.connect(sound.context.destination);
  return pitchShifterProcessor;
}

function hannWindow(length) {
  var window = new Float32Array(length);
  for (var i = 0; i < length; i++) {
    window[i] = 0.5 * (1 - Math.cos(2 * Math.PI * i / (length - 1)));
  }
  return window;
}
