import { useContext, useEffect } from 'react';
import { AudioPlayerContext } from "../AudioPlayerContext";
import AudioStreamer from '../../../Utils/Audio/AudioStreamer';

// TODO autoAdvance track like LegacyPlayer
const useAudioPlayer = () => {

  const [state, setState] = useContext(AudioPlayerContext);

  function playTrack(index) {
    if (index === state.currentTrackIndex) {
      togglePlay();
    } else {
      state.audioPlayer.pause();
      state.audioPlayer =   new Audio(state.tracks[index].file);
      state.audioPlayer.crossOrigin = "anonymous";
      state.audioStream = new AudioStreamer(state.audioPlayer);
      state.audioPlayer.play();
      setState(state => ({ ...state, currentTrackIndex: index, isPlaying: true }));
    }
  }

  function togglePlay() {
    if (state.isPlaying) {
      state.audioPlayer.pause();
    } else {
      state.audioPlayer.play();
    }
    setState(state => ({ ...state, isPlaying: !state.isPlaying }));
  }

  function playPreviousTrack() {
    const newIndex = ((state.currentTrackIndex + -1) % state.tracks.length + state.tracks.length) % state.tracks.length;
    playTrack(newIndex);
  }

  function playNextTrack() {
    const newIndex = (state.currentTrackIndex + 1) % state.tracks.length;
    playTrack(newIndex);
  }

  return {
    playTrack,
    togglePlay,
    currentTrackName: state.currentTrackIndex !== null && state.tracks[state.currentTrackIndex].name,
    currentTrackId: state.currentTrackIndex !== null && state.tracks[state.currentTrackIndex].id,
    trackList: state.tracks,
    isPlaying: state.isPlaying,
    playPreviousTrack,
    playNextTrack,
    audioStream: state.audioStream,
    currentTime: state.audioPlayer.currentTime,
    audioPlayer: state.audioPlayer,
    bpm: state.currentTrackIndex !== null && state.tracks[state.currentTrackIndex].bpm,
  }
};

export default useAudioPlayer;