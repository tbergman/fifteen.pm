import React, { useEffect } from "react";
import usePlayer from "./hooks/usePlayer";
import './TrackList.css'

export default function TrackList({ tracks, defaultColor, selectedColor }) {
  const { currentTrackName, playTrack } = usePlayer(tracks[0].mediaType);

  return (tracks.length > 1 ?
    <div id="tracklist-container">
      <div id="tracklist">
        <ul>
          {tracks.map((track, index) => {
            const isCurTrack = currentTrackName === track.name;
            return <li
              key={track.name}
              data-id={index}
              style={{ color: isCurTrack ? selectedColor : defaultColor }}
              className={isCurTrack ? "active-track" : null}
              onClick={() => playTrack(index)}
            >
              {isCurTrack && <span id="current-track-smiley">☻</span>}
              {track.name}
            </li>
          })}
        </ul>
      </div>
    </div> : null
  );
}