import React, { useState, useMemo } from 'react';

const VideoPlayerContext = React.createContext([{}, () => { }]);

const VideoPlayerProvider = ({ tracks, ...props }) => {

  const videoPlayer = useMemo(() => document.createElement("video"));

  const [state, setState] = useState({
    videoPlayer: videoPlayer,
    tracks: tracks,
    currentTrackIndex: null,
    currentTrackName: null,
    isPlaying: false,
  });

  return (
    <VideoPlayerContext.Provider value={[state, setState]}>
      {props.children}
    </VideoPlayerContext.Provider>
  );
};

export { VideoPlayerContext, VideoPlayerProvider };