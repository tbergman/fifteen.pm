import React from 'react';
import UI from '../../Common/UI/UI';
import HeidiSabertoothCanvas from './Canvas';
import { CONTENT } from '../../Content';

export default function Release({ }) {
    
    return <>
        <>
            <UI content={CONTENT[window.location.pathname]} />
            <HeidiSabertoothCanvas />
        </>
    }</>
}
