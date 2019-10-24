import React, { useRef, useMemo, useState, useEffect } from 'react'
import Modal from "react-modal";
import anime from "animejs";
import { OVERLAY_SHAPES } from './OverlayShapes'
import './Overlay.css'
import './EnterButton.css'

/**
 *  Show 'ENTER' for releases on load.
 *  Show 'CLOSE' for releases on additional modal opens 
 *  Show 'CLOSE' for home page
*/
function OverlayEnterButton({ loading, isRelease, hasEnteredWorld, color, onClickEnter }) {
    const [ENTER, CLOSE, LOADING] = useMemo(() => {
        return [
            "ENTER",
            "CLOSE",
            "LOADING",
        ]
    })
    const [text, setText] = useState(ENTER);

    useEffect(() => {
        if (!isRelease || hasEnteredWorld) {
            setText(CLOSE);
        } else if (loading) {
            setText(LOADING);
        }
    }, [hasEnteredWorld, loading, isRelease])

    return (
        <div className="enter-container">
            <button
                type="button"
                style={{ color: color }}
                onClick={onClickEnter}
            >
                {text}
            </button>
        </div>
    );
}

function OverlayControlsHelp({ controlsHelp, color }) {
    return <div className="overlay-controls-help">
        {controlsHelp.map((c, i) => (
            <div
                key={i}
                className={c.alwaysShow !== undefined ? "overlay-content-item" : "overlay-content-item hide-in-mobile"}
            >
                <div className="overlay-content-icon">
                    <c.icon fillColor={color} />
                </div>
                <div
                    className="overlay-content-item-text"
                    style={{ color: color }}
                >
                    {c.instructions}
                </div>
            </div>
        ))}
    </div>;
}

function PurchaseLink({ href, color }) {
    return (
        <div className="overlay-content-item">
            <div className="overlay-content-icon">
                <a
                    target="_blank"
                    className="purchase-link"
                    href={href}
                >
                    <svg fill={color} viewBox="0 0 180 100">
                        <path d="M49.999,85.744c-19.708,0-35.742-16.036-35.742-35.745s16.034-35.743,35.742-35.743  c19.71,0,35.746,16.034,35.746,35.743S69.709,85.744,49.999,85.744z M49.999,15.825c-18.844,0-34.172,15.331-34.172,34.174  c0,18.845,15.328,34.175,34.172,34.175c18.845,0,34.175-15.33,34.175-34.175C84.174,31.156,68.844,15.825,49.999,15.825z" />
                        <circle cx="36.135" cy="40.684" r="3.907" />
                        <path d="M68.014,40.684c0,2.157-1.748,3.906-3.906,3.906c-2.16,0-3.906-1.749-3.906-3.906s1.746-3.907,3.906-3.907  C66.266,36.776,68.014,38.526,68.014,40.684z" />
                        <path d="M49.999,72.704c-9.901,0-18.589-6.337-21.615-15.768l1.496-0.479c2.815,8.778,10.901,14.677,20.119,14.677  c9.22,0,17.306-5.898,20.121-14.677l1.498,0.479C68.59,66.367,59.902,72.704,49.999,72.704z" />
                    </svg>

                </a>
            </div>
            <div className="overlay-content-item-text">
                <a
                    className="purchase-link"
                    target="_blank"
                    href={href}
                    style={{
                        color: color
                    }}
                >buy me
            </a>
            </div>
        </div>
    );

}

function OverlayMessage({ message, color }) {
    return (
        <div className="overlay-header" style={{ color: color }}>
            <div className="overlay-header-message">
                {message}
            </div>
        </div>
    );
}

/**
*  Renders content inside react modal
*    - description of artists
*    - instructions
*    - action button
*/
function OverlayContent({ loading, hasEnteredWorld, toggleOverlay, isRelease, color, controlsHelp, message, purchaseLink }) {
    return (
        <div className="overlay-content">
            <div className="overlay-header-and-controls">
                <OverlayMessage message={message} color={color} />
                {isRelease && <OverlayControlsHelp controlsHelp={controlsHelp} color={color} />}
                {isRelease && <PurchaseLink href={purchaseLink} color={color} />}
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

function OverlaySVG({ svgRef, color, shape }) {
    /**
   *  Renders svg modal background (animated blob)
   */
    return (
        <div className="overlay-svg">
            <svg
                // ref={element => (this.svg = element)}
                viewBox={`0 0 1098 724`}
            >
                <g fill={color}>
                    <path
                        ref={svgRef}
                        d={shape.path}
                    />
                </g>
            </svg>
        </div>
    );
}


export default function Overlay({ message, controlsHelp, loading, isRelease, colors }) {
    console.log(controlsHelp)
    const [hasEnteredWorld, setHasEnteredWorld] = useState(!isRelease);
    const [open, setOpen] = useState(isRelease);
    const ref = useRef();
    const svgRef = useRef();
    const shape = useMemo(() => OVERLAY_SHAPES[0]);


    function toggleOverlay(e) {
        e.preventDefault();
        if (loading) return;
        setOpen(!open)
        if (!hasEnteredWorld) setHasEnteredWorld(true);
        // this prop can be used as a callback from a parent component
        // if (this.props.didEnterWorld) {
        // this.props.didEnterWorld();
        // }
    }

    function animateOverlay() {
        anime({
            targets: svgRef.current,
            easing: shape.easing,
            elasticity: shape.elasticity || 0,
            d: [
                { value: shape.pathAlt, duration: shape.duration },
                { value: shape.path, duration: shape.duration }
            ],
            loop: true,
            direction: "alternate"
        });
    }


    return <>
        {open ?
            <div ref={ref} className="modal">
                <Modal
                    isOpen={open}
                    appElement={ref.current}
                    onAfterOpen={() => animateOverlay()}
                    onRequestClose={() => {
                        setOpen(false);
                        if (!hasEnteredWorld) setHasEnteredWorld(true);
                    }}
                    shouldCloseOnOverlayClick={true}
                    ariaHideApp={false}
                    className="overlay-modal"
                    style={{
                        overlay: { backgroundColor: "transparent" } // for the built-in react-modal overlay style
                    }}
                >
                    <>

                        <OverlayContent
                            controlsHelp={controlsHelp}
                            hasEnteredWorld={hasEnteredWorld}
                            toggleOverlay={toggleOverlay}
                            message={message}
                            isRelease={isRelease}
                            color={colors.default}
                        />

                        <OverlaySVG
                            svgRef={svgRef}
                            color={colors.bg}
                            shape={shape}
                        />
                    </>
                </Modal>
            </div > : null
        }
    </>;
}