import React, { useEffect } from "react";
import usePlayer from "./hooks/usePlayer"
import PlayButton from "./PlayButton";
import TrackList from "./TrackList";
import "./Player.css";
import { isMobile } from '../../Utils/BrowserDetection';

export default function Player({ artist, tracks, playerColor, selectedColor, playOnLoad = true }) {
  const { playTrack } = usePlayer(tracks[0].mediaType); // assumption: no multi-media playlist

  useEffect(() => {
    if (playOnLoad && !isMobile) playTrack(0);
  }, [])

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