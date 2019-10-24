import React, { useState } from 'react';
import Logo from './Logo';
import Player from './Player/Player'
import InfoIcon from './InfoIcon';
import Navigation from './Navigation';
import Overlay from './Overlay/Overlay';

import './UI.css';

export default function UI({
    content,
    logo = true,
    player = true,
    infoButton: infoIcon = true,
    navigation = true,
    overlay = true,
    loading = false
}) {
    return (
        <>
            <div className="footer">
                {logo && <Logo />}
                {player && <Player
                    artist={content.artist}
                    colors={content.colors}
                    tracks={content.tracks}
                />}
                {infoIcon && <InfoIcon
                    color={content.colors.default}
                    hasPlayer={player}
                    hasTrackList={player && content.tracks.length > 1}
                    onClick={() => toggleOverlay(!overlay)}
                />}
            </div>
            {navigation && <Navigation defaultColor={content.colors.default} />}
            {overlay && <Overlay
                loading={loading}
                isRelease={content.isHome ? false : true}
                colors={content.colors}
                message={content.message}
                controlsHelp={content.controls}    
            />}
        </>
    )
}