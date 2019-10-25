import React, {useEffect} from "react";
import useMusicPlayer from "./hooks"
import PlayButton from "./PlayButton";
import TrackList from "./TrackList";
import "./Player.css";

export default function Player({ artist, tracks, colors, playOnLoad=true }) {
  const {playTrack} = useMusicPlayer();
  
  useEffect(() => {
    if (playOnLoad) playTrack(0);
  }, [])

  return (
    <div id="player-container">
      <PlayButton color={colors.default} text={artist} />
      <TrackList tracks={tracks} colors={colors} />
    </div>
  );
}