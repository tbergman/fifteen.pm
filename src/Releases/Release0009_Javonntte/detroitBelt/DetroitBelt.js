import { default as React, useEffect, useState, Suspense } from 'react';
import { Asteroids } from './Asteroids';
import { World } from './World';
import DetroitLogo from './DetroitLogo';

export default function DetroitBelt({ setDetroitBeltReady, theme }) {

    const [themeName, setThemeName] = useState();
    const [worldReady, setWorldReady] = useState(false);
    const [asteroidsReady, setAsteroidsReady] = useState(false);

    useEffect(() => {
        if (theme && theme.name) console.log('theme name', theme.name)
        setThemeName(theme.name)
    }, [theme])

    useEffect(() => {
        if (asteroidsReady && worldReady) setDetroitBeltReady(true);
    }, [worldReady, asteroidsReady]);

    return <>
        <Asteroids themeName={themeName} setReady={setAsteroidsReady} />
        <World themeName={themeName} setReady={setWorldReady} />
        <Suspense>
            <DetroitLogo />
        </Suspense>
    </>
}
