import React, { useEffect, useState, useMemo } from 'react';
import './OverlayEnterButton.css'
/**
 *  Show 'ENTER' for releases on load.
 *  Show 'CLOSE' for releases on additional modal opens 
 *  Show 'CLOSE' for home page
*/
export default function OverlayEnterButton({ color, onClick, hasBeenClosed, contentReady }) {

    const [ENTER, CLOSE, LOADING] = useMemo(() => {
        return [
            "ENTER",
            "CLOSE",
            "LOADING...",
        ]
    })
    
    const [text, setText] = useState(ENTER);

    useEffect(() => {
        if (hasBeenClosed && contentReady) {
            setText(CLOSE);
        } else if (!contentReady) {
            setText(LOADING);
        } else {
            setText(ENTER);
        }
    }, [hasBeenClosed, contentReady])

    return (
        <div className="enter-container">
            <button
                type="button"
                style={{ color: color, borderColor: color }}
                onClick={text == LOADING ? null : onClick}
            >
                {text}
            </button>
        </div>
    );
}