import React, { useState, useMemo } from 'react';
import { formatSoundcloudSrc } from "../../Utils/Audio/SoundcloudUtils"

const VideoPlayerContext = React.createContext([{}, () => {}]);

const VideoPlayerProvider = ({video, ...props}) => {
  
  const videoPlayer = useMemo(() => document.createElement("video"));
    
  const loadedVideos = useMemo(() => {
    return videos.map(video => {
      return {
        // file: formatSoundcloudSrc(
        //   track.id,
        //   track.secretToken
        // ),
        ...video
      }
    })
  })
  const [state, setState] = useState({
    videoPlayer: videoPlayer,
    videos: loadedVideos,
    currentVideoIndex: 0,
    currentVideoName: loadedVideos[0].name,
    isPlaying: false,
  });
  
  return (
    <VideoPlayerContext.Provider value={[state, setState]}>
      {props.children}
    </VideoPlayerContext.Provider>
  );
};

export { VideoPlayerContext, VideoPlayerProvider };