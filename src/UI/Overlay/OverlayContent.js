import React from 'react';
import OverlayEnterButton from './OverlayEnterButton';
import OverlayInstructions from './OverlayInstructions';
import OverlayPurchaseLink from './OverlayPurchaseLink';
import OverlayMessage from './OverlayMessage';
import './OverlayContent.css';

/**
*  Renders content inside react modal
*    - description of artists
*    - instructions
*    - action button
*/
export default function OverlayContent({ loading, hasEnteredWorld, toggleOverlay, isRelease, color, instructions, message, purchaseLink }) {
    return (
        <div className="overlay-content">
            <div className="overlay-header-and-controls">
                <OverlayMessage message={message} color={color} />
                {isRelease && <OverlayInstructions instructions={instructions} color={color} />}
                {isRelease && <OverlayPurchaseLink href={purchaseLink} color={color} />}
            </div>
            <OverlayEnterButton
                loading={loading}
                isRelease={isRelease}
                hasEnteredWorld={hasEnteredWorld}
                onEnter={toggleOverlay}
                color={color}
            />
        </div>
    );
}