import React, { useEffect } from "react";
import useMusicPlayer from "./hooks";
import './TrackList.css'

export default function TrackList({ tracks, colors }) {
  const { currentTrackName, playTrack } = useMusicPlayer('TrackList');

  return (tracks.length > 1 ?
    <div id="playlist">
      <ul>
        {tracks.map((track, index) => {
          const isCurTrack = currentTrackName === track.name;
          return <li
            key={track.name}
            data-id={index}
            style={{ color: isCurTrack ? colors.selected : colors.default }}
            className={isCurTrack ? "active-track" : null}
            onClick={() => playTrack(index)}
          >
            {isCurTrack && <span id="current-track-smiley">☻</span>}
            {track.name}
          </li>
        })}
      </ul>
    </div> : null
  );
}