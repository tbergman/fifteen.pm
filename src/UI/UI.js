import React, { useEffect, useMemo, useState } from 'react';
import InfoIcon from './InfoIcon';
import Logo from './Logo';
import Navigation from './Navigation';
import Overlay from './Overlay/Overlay';
import Player from './Player/Player';
import './UI.css';
import useMusicPlayer from './Player/hooks';


export default function UI({
    content,
    contentReady = true,
    loadWithLogo = true,
    loadWithNavigation = true,
    loadWithOverlay = true,
    loadWithInfoIcon = false,
    loadWithPlayer = false,
    onOverlayHasBeenClosed = () => {},
}) {
    const logo = useState(loadWithLogo ? true : false);
    const navigation = useState(loadWithNavigation ? true : false);
    const [player, togglePlayer] = useState(loadWithPlayer ? true : false);
    const [infoIcon, toggleInfoIcon] = useState(loadWithInfoIcon ? true : false);
    const [overlay, toggleOverlay] = useState(loadWithOverlay ? true : false);
    const [overlayHasBeenClosed, setOverlayHasBeenClosed] = useState(!loadWithOverlay);
    const hasTracks = useMemo(() => content.tracks ? true : false);

    useEffect(() => {
        if (!overlay && !overlayHasBeenClosed) {
            setOverlayHasBeenClosed(true);
            onOverlayHasBeenClosed();
        }
    }, [overlay])

    useEffect(() => {
        toggleInfoIcon(loadWithInfoIcon || overlayHasBeenClosed);
        togglePlayer(loadWithPlayer || overlayHasBeenClosed && hasTracks);
    }, [overlayHasBeenClosed])

    return (
        <>
            {logo && <Logo color={content.colors.logo} />}
            {navigation && <Navigation color={content.colors.default} />}
            <Overlay
                hasBeenClosed={overlayHasBeenClosed}
                contentReady={contentReady}
                message={content.message}
                instructions={content.instructions}
                purchaseLink={content.purchaseLink}
                overlayColor={content.colors.overlay}
                overlayContentColor={content.colors.overlayContent}
                loadWithOverlayOpen={loadWithOverlay}
                shouldUpdateOverlay={overlay}
                onToggle={() => toggleOverlay(!overlay)}
            />
            <div className="footer">
                {player && <Player
                    artist={content.artist}
                    playerColor={content.colors.player}
                    selectedColor={content.colors.onHover}
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