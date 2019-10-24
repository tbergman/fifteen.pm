import React, { useState, useEffect, useMemo } from 'react';
import Logo from './Logo';
import Player from './Player/Player'
import InfoIcon from './InfoIcon';
import Navigation from './Navigation';
import Overlay from './Overlay/Overlay';

import './UI.css';

export default function UI({
    content,
    loadWithLogo = true,
    loadWithNavigation = true,
    loadWithOverlay = true,
    loadWithInfoIcon = false,
    loadWithPlayer = false,
}) {
    const logo = useState(loadWithLogo ? true : false);
    const navigation = useState(loadWithNavigation ? true : false);
    const [player, togglePlayer] = useState(loadWithPlayer ? true : false);
    const [infoIcon, toggleInfoIcon] = useState(loadWithInfoIcon ? true : false);
    const [overlay, toggleOverlay] = useState(loadWithOverlay ? true : false);
    const [overlayHasBeenClosed, setOverlayHasBeenClosed] = useState(!loadWithOverlay);
    const hasTracks = useMemo(() => content.tracks.length); // TODO will this work with multiple releases?
    
    useEffect(() => {
        toggleInfoIcon(loadWithInfoIcon || overlayHasBeenClosed);
        togglePlayer(loadWithPlayer || overlayHasBeenClosed && hasTracks);
    }, [overlayHasBeenClosed])

    useEffect(() => {
        if (!overlay && !overlayHasBeenClosed) setOverlayHasBeenClosed(true);
    }, [overlay])

    return (
        <>
            {logo && <Logo />}
            {navigation && <Navigation defaultColor={content.colors.default} />}
            <Overlay
                
                message={content.message}
                instructions={content.instructions}
                purchaseLink={content.purchaseLink}
                colors={content.colors}
                loadWithOverlayOpen={loadWithOverlay}
                shouldUpdateOverlay={overlay}
                onToggle={() => toggleOverlay(!overlay)}
            />
            <div className="footer">
                {player && <Player
                    artist={content.artist}
                    colors={content.colors}
                    tracks={content.tracks}
                />}
                {infoIcon && <InfoIcon
                    color={content.colors.default}
                    hasPlayer={player}
                    hasTrackList={player && content.tracks.length > 1}
                    onClick={(e) => {
                        e.preventDefault();
                        toggleOverlay(!overlay);
                    }}
                />}
            </div>
        </>
    )
}