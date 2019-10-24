import React, { useMemo } from 'react';
import './InfoIcon.css'

export default function InfoIcon({ color, hasPlayer, hasTrackList, onClick }) {
    const svgPath = useMemo(() => "M49.539,0C22.188-0.01,0.018,22.381,0,50.023c0.018,27.601,22.188,49.993,49.539,49.979  c27.344,0.014,49.518-22.378,49.541-49.979C99.057,22.381,76.883-0.01,49.539,0z M49.512,21.634c4.372,0,7.922,3.546,7.922,7.922  s-3.55,7.923-7.922,7.923c-4.38,0-7.927-3.547-7.927-7.923S45.132,21.634,49.512,21.634z M61.117,74.787H38.169v-3.922h3.342  c0.48,0,0.873-0.396,0.873-0.881V44.711c0-0.484-0.389-0.881-0.873-0.881h-3.342v-3.795h18.466v29.567  c0,0.696,0.396,1.263,0.881,1.263h3.602V74.787z");
    const icon = (
        <svg width="100%" height="100%" viewBox="0 0 111 100">
            <g fill={color}>
                {/* <path ref={el => (this.iconPath = el)} d={MENU_ICON_OPEN} /> */}
                <path d={svgPath} />
            </g>
        </svg>
    );
    let style = {
        marginBottom: "20px",
        marginLeft: "20px"
    };
    if (hasPlayer) {
        style = {
            marginLeft: hasTrackList ? "0px" : "-40px",
        };
    }
    return (
        <div
            id="info-icon"
            onClick={onClick}
            style={style}
        >
            {icon}
        </div>
    );
}