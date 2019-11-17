import React, { useEffect } from "react";
import useMusicPlayer from "./hooks"
import PlayButton from "./PlayButton";
import TrackList from "./TrackList";
import "./Player.css";
import { isMobile } from '../../Utils/BrowserDetection';

export default function Player({ artist, tracks, playerColor, selectedColor, playOnLoad = true }) {
  const { playTrack, isPlaying } = useMusicPlayer();
  const allStuff = useMusicPlayer();
 
  useEffect(() => {
    if (playOnLoad && !isMobile) playTrack(0);
  }, [])

  useEffect(() => {
    console.log('all stuff', allStuff);
  }, [isPlaying])

  return (
    <div id="player-container">
      <PlayButton color={playerColor} text={artist} />
      <TrackList tracks={tracks} defaultColor={playerColor} selectedColor={selectedColor} />
    </div>
  );
}