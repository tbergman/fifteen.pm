import React from "react";
import PlayButton from "./PlayButton";
import "./Player.css";
import TrackList from "./TrackList";

export default function Player({ artist, tracks, playerColor, selectedColor }) {
  return (
    <div id="player-container">
      <PlayButton
        mediaType={tracks[0].mediaType}
        color={playerColor}
        text={artist}
      />
      <TrackList
        tracks={tracks}
        defaultColor={playerColor}
        selectedColor={selectedColor}
      />
    </div>
  );
}