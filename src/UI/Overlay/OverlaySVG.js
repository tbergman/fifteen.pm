import React from 'react';

export default function OverlaySVG({ svgRef, color, shape }) {
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
