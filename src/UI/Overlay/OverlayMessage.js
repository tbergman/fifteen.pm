import React from 'react';

export default function OverlayMessage({ message, color }) {
    return (
        <div className="overlay-header" style={{ color: color }}>
            <div className="overlay-header-message">
                {message}
            </div>
        </div>
    );
}
