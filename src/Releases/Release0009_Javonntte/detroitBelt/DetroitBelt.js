import { default as React, useEffect, useState } from 'react';
import { Asteroids } from './Asteroids';
import { World } from './World';


export default function DetroitBelt({ setContentReady, theme }) {

    const [themeName, setThemeName] = useState();
    
    // TODO determine proper set content ready callbacks + logic 
    useEffect(() => {
        setContentReady(true);
    });

    useEffect(() => setThemeName(theme.name), [theme])

    return <>
        <Asteroids themeName={themeName} />
        <World themeName={themeName} />
    </>
}
