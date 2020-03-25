import React from 'react';
import useAudioPlayer from '../../Common/UI/Player/hooks/useAudioPlayer';
import '../Release.css';
import Scene from './Scene';

export default function Canvas({ }) {
    const { audioPlayer } = useAudioPlayer();
    return <Scene audioPlayer={audioPlayer} />
}