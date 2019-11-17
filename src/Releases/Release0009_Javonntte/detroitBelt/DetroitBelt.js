import { default as React, useEffect, useState } from 'react';
import { Asteroids } from './Asteroids';
import { World } from './World';


export default function DetroitBelt({ setContentReady, theme }) {

    const [themeName, setThemeName] = useState();
    const [worldReady, setWorldReady] = useState(false);
    const [asteroidsReady, setAsteroidsReady] = useState(false);

    useEffect(() => {
        if (asteroidsReady && worldReady) setContentReady(true);
    }, [asteroidsReady]);


    useEffect(() => setThemeName(theme.name), [theme])

    return <>
        <Asteroids themeName={themeName} setReady={setAsteroidsReady} />
        <World themeName={themeName} setReady={setWorldReady} />
    </>
}
