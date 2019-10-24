import React, {useEffect, useState, useMemo} from 'react'; 
import './OverlayEnterButton.css'
/**
 *  Show 'ENTER' for releases on load.
 *  Show 'CLOSE' for releases on additional modal opens 
 *  Show 'CLOSE' for home page
*/
export default function OverlayEnterButton({ color, onClick }) {
    const [ENTER, CLOSE, LOADING] = useMemo(() => {
        return [
            "ENTER",
            "CLOSE",
            "LOADING",
        ]
    })
    const [text, setText] = useState(ENTER);

    // useEffect(() => {
    //     if (!isRelease || hasEnteredWorld) {
    //         setText(CLOSE);
    //     } else if (loading) {
    //         setText(LOADING);
    //     }
    // }, [hasEnteredWorld, loading, isRelease])

    return (
        <div className="enter-container">
            <button
                type="button"
                style={{ color: color }}
                onClick={onClick}
            >
                {text}
            </button>
        </div>
    );
}