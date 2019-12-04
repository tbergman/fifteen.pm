import React, {useEffect, useRef, useMemo} from 'react';
import anime from "animejs";
import { OVERLAY_SHAPES } from './OverlayShapes'
import './OverlaySVG.css';

/**
  *  Renders svg modal background (animated blob)
  */
export default function OverlaySVG({ color }) {
    const ref = useRef(); 
    const shape = useMemo(() => OVERLAY_SHAPES[0]);
    useEffect(() => { 
        anime({
            targets: ref.current,
            easing: shape.easing,
            elasticity: shape.elasticity || 0,
            d: [
                { value: shape.pathAlt, duration: shape.duration },
                { value: shape.path, duration: shape.duration }
            ],
            loop: true,
            direction: "alternate"
        });
    });

    return (
        <div className="overlay-svg">
            <svg viewBox={`0 0 1098 724`}>
                <g fill={color}>
                    <path
                        ref={ref}
                        d={shape.path}
                    />
                </g>
            </svg>
        </div>
    );
}