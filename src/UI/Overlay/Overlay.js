import React from 'react';
import './Overlay.css';
import OverlayContent from './OverlayContent';
import OverlaySVG from './OverlaySVG';

export default function Overlay({
    hasBeenClosed,
    contentReady,
    message,
    instructions,
    purchaseLink,
    purchaseLinkText,
    overlayColor,
    overlayContentColor,
    onToggle,
}) {
    return <div className="overlay-modal">
        <OverlayContent
            hasBeenClosed={hasBeenClosed}
            contentReady={contentReady}
            instructions={instructions}
            purchaseLink={purchaseLink}
            purchaseLinkText={purchaseLinkText}
            message={message}
            color={overlayContentColor}
            onToggle={onToggle}
        />
        <OverlaySVG
            color={overlayColor}
        />
    </div>
}