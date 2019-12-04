import React, { useState, useMemo } from 'react';
import { formatSoundcloudSrc } from "../../Utils/Audio/SoundcloudUtils"

const AudioPlayerContext = React.createContext([{}, () => {}]);

const AudioPlayerProvider = ({tracks, ...props}) => {
  const loadedTracks = useMemo(() => {
    return tracks.map(track => {
      return {
        file: formatSoundcloudSrc(
          track.id,
          track.secretToken
        ),
        ...track
      }
    })
  })
  const [state, setState] = useState({
    audioPlayer: new Audio(),
    tracks: loadedTracks,
    currentTrackIndex: null,
    currentTrackName: null,
    isPlaying: false,
  });
  
  return (
    <AudioPlayerContext.Provider value={[state, setState]}>
      {props.children}
    </AudioPlayerContext.Provider>
  );
};

export { AudioPlayerContext, AudioPlayerProvider };