import React, { useEffect, useState } from 'react';
import useMusicPlayer from '../../UI/Player/hooks';
import '../Release.css';
import Scene from './Scene';


export default function Canvas({ }) {
    const { isPlaying, audioStream, currentTime } = useMusicPlayer();
    const [audioAttributes, setAudioAttributes] = useState();

    useEffect(() => {
        if (audioStream && !audioAttributes) {
            audioStream.analyser.fftSize = 256;
            const volArray = new Uint8Array(audioStream.analyser.fftSize);
            const numVolBuckets = 4;
            const freqArray = new Uint8Array(audioStream.analyser.frequencyBinCount);
            const numFreqBuckets = 64;
            setAudioAttributes({
                volArray: volArray,
                numVolBuckets: numVolBuckets,
                volBucketSize: volArray.length / numVolBuckets,
                freqArray: freqArray,
                freqBucketSize: freqArray.length / numFreqBuckets,
                bassIndex: 0, // the vol bucket indices, assigned by freq range
                midIndex1: 1,
                midIndex2: 2,
                trebIndex: 3,
                bassThresh: 100,
                midThresh: 130,
                trebThresh: 140.0,
                normalizingConst: 200.0,
            })
        }
    }, [isPlaying])

    return <Scene
        isPlaying={isPlaying}
        currentTrackTime={currentTime}
        audioStream={audioStream}
        audioAttributes={audioAttributes}
    />
}




