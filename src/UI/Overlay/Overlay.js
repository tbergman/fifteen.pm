import React, { useEffect, useRef, useState } from 'react';
import Modal from "react-modal";
import './Overlay.css';
import OverlayContent from './OverlayContent';
import OverlaySVG from './OverlaySVG';

export default function Overlay({
    message,
    instructions,
    purchaseLink,
    colors,
    loadWithOverlayOpen,
    shouldUpdateOverlay,
    onToggle,
}) {
    const [isOpen, setIsOpen] = useState(loadWithOverlayOpen ? true : false);
    const [afterOpen, setAfterOpen] = useState(false); // loads opened or closed, there is no after.
    const ref = useRef();


    useEffect(() => {
        if (afterOpen) setIsOpen(!isOpen)
    }, [shouldUpdateOverlay])

    return <>
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
                        color={colors.bg}
                    />
                </>
            </Modal>
        </div >
    </>;
}