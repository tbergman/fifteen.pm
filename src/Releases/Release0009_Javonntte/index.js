import React, { useRef } from 'react';
import { Canvas } from 'react-three-fiber';
import { CONTENT } from '../../Content';
import Menu from '../../UI/Menu/Menu'; // TODO code stutter :/
import "./index.css";
import { Scene } from './scene';

export default function Release0009_Javonntte({ }) {
    const mediaRef = useRef()
    return (
        <>
            <Menu
                content={CONTENT[window.location.pathname]}
                menuIconFillColor={CONTENT[window.location.pathname].theme.iconColor}
                mediaRef={mediaRef}
            />
            <Canvas id="canvas" onCreated={({ gl }) => {
                gl.shadowMap.enabled = true;
            }}>
                <Scene mediaRef={mediaRef} />
            </Canvas>
        </>
    );
}