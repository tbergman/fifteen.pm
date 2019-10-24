import React, { useRef, useMemo, useState, useEffect } from 'react'
import Modal from "react-modal";
import anime from "animejs";
import { OVERLAY_SHAPES } from './OverlayShapes'
import OverlayContent from './OverlayContent';
import OverlaySVG from './OVerlaySVG';
import './Overlay.css'

export default function Overlay({
    message,
    instructions,
    purchaseLink,
    colors,
    loadWithOverlayOpen,
    shouldUpdateOverlay,
    onToggle,
}) {

    const [open, setOpen] = useState(loadWithOverlayOpen ? true : false);
    const [isOpen, setIsOpen] = useState(loadWithOverlayOpen ? true : false);
    const [afterOpen, setAfterOpen] = useState(false); // loads opened or closed, there is no after.
    const [closingModal, shouldCloseModal] = useState(true);
    const ref = useRef();
    const svgRef = useRef();
    const shape = useMemo(() => OVERLAY_SHAPES[0]);

    useEffect(() => {
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
    }, [afterOpen])

    useEffect(() => {
        if (afterOpen) setIsOpen(!isOpen)
    }, [shouldUpdateOverlay])

    return <>
        {open ?
            <div ref={ref} className="modal">
                <Modal
                    isOpen={isOpen}
                    appElement={ref.current}
                    onAfterOpen={() => setAfterOpen(true)}
                    onRequestClose={() => setIsOpen(false)}
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
                            purchaseLink={purchaseLink}
                            message={message}
                            color={colors.default}
                            onToggle={onToggle}
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