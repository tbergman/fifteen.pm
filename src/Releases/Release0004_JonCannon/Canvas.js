import React from 'react';
import useAudioPlayer from '../../UI/Player/hooks';
import '../Release.css';
import Scene from './Scene';


export default function Canvas({ hasEnteredWorld }) {
  return <Scene hasEnteredWorld={hasEnteredWorld} />
}




