import React from 'react';
import './OverlayMessage.css'

export default function OverlayMessage({ message, color }) {
    return (
        <div className="overlay-header" style={{ color: color }}>
            <div className="overlay-header-message">
                {message}
            </div>
        </div>
    );
}
