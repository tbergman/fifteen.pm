import React from "react";
import useMusicPlayer from "./hooks";
import './Player.css'
// import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
// import {faPlay, faPause} from "@fortawesome/free-solid-svg-icons";
export default function TrackList({ selectedColor, fillColor, ...props }) {
  console.log("TRACKLIST PROPS", props);
  const { trackList, currentTrackName, playTrack, isPlaying } = useMusicPlayer();
  return trackList.length > 1 ?
    <>
      {trackList.map((track, index) => {
        const isCurTrack = currentTrackName === track.title;
        return <li
          style={{ color: isCurTrack ? selectedColor : fillColor }}
          className={isCurTrack ? "active-track" : null}
          //  onClick={this.handlePlaylistClick}
          onClick={() => playTrack(index)}
          key={track.id}
          data-id={index}
        >
          {/* {currentTrackName === track.title && isPlaying ?  'pause' : 'play'} */}
          {isCurTrack && <span id="current-track-smiley">☻</span>}
          {/* {track.id === curTrack.id && <span id="current-track-smiley">☻</span>} */}
          {track.title}
        </li>
      })}
    </> : null;
}

// /*
// <div className="box" key={track.title}>
// <button className="button" onClick={() => playTrack(index)}>
//   {currentTrackName === track.title && isPlaying ?  'pause' : 'play'}
//   <PlayButton />
//   {/*<FontAwesomeIcon icon={faPause} /> : <FontAwesomeIcon icon={faPlay} />}*/}
// </button>
// <div className="song-title">
//   {track.title}
// </div>
// </div>
// */