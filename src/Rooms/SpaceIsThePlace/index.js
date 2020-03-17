import React, { useMemo } from 'react';
import { CONTENT } from "../../Content";
import UI from '../../UI/UI';
import SpaceIsThePlaceCanvas from './Canvas';
import './index.css';

export default function Room_SpaceIsThePlace({ }) {
    const content = useMemo(() => CONTENT[window.location.pathname]);
    return (
        <>
            <UI content={content} renderPlayer={false} loadWithNavigation={false} />
            <SpaceIsThePlaceCanvas content={content} />
        </>
    );
}