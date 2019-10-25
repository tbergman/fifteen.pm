import React, { useState, useMemo } from 'react';
import { formatSoundcloudSrc } from "../../Utils/Audio/SoundcloudUtils"

const MusicPlayerContext = React.createContext([{}, () => {}]);

const MusicPlayerProvider = ({tracks, ...props}) => {
  console.log("THE PROPS", props)
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
    isPlaying: false,
  });
  return (
    <MusicPlayerContext.Provider value={[state, setState]}>
      {props.children}
    </MusicPlayerContext.Provider>
  );
};

export { MusicPlayerContext, MusicPlayerProvider };