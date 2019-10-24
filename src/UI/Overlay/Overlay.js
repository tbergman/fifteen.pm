import React, { useRef, useMemo, useState, useEffect } from 'react'
import Modal from "react-modal";
import anime from "animejs";
import { OVERLAY_SHAPES } from './OverlayShapes'
import OverlayContent from './OverlayContent';
import OverlaySVG from './OVerlaySVG';
import './Overlay.css'

export default function Overlay({ message, instructions, loading, isRelease, colors }) {

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
                            instructions={instructions}
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