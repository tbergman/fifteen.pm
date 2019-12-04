
import React from 'react';
import './OverlayInstructions.css';
import { isMobile } from '../../Utils/BrowserDetection';

export default function OverlayInstructions({ instructions, color }) {

    return <div className="overlay-instructions">
        {instructions.map((instruction, index) => (
            <div
                key={index}
                className={
                    (isMobile && instruction.alwaysShow || !isMobile) ?
                        "overlay-content-item" : "overlay-content-item hide-in-mobile"
                }
            >
                <div className="overlay-content-icon">
                    <instruction.icon fillColor={color} />
                </div>
                <div
                    className="overlay-content-item-text"
                    style={{ color: color }}
                >
                    {instruction.text}
                </div>
            </div>
        ))}
    </div>;
}