import React, { useState, useEffect, Fragment } from "react";
import { TOTAL_RELEASES } from "../Content";
import "./Navigation.css";


export default function Navigation({ defaultColor }) {

    const [currentLocation, setCurrentLocation] = useState(window.location.pathname);
    const [currentIndex, setCurrentIndex] = useState(parseInt(window.location.pathname.replace("/", "")));

    function setLocation(path) {
        window.location.pathname = path;
    };

    // useEffect(() => {
    //     console.log(window.location.pathname);
    //     if(!currentLocation) return;
    //     window.location.pathname = currentLocation;
    // }, [currentLocation])

    function isHome() {
        return currentLocation === "/";
    }

    function getPrevReleasePath() {
        let prevRelease;
        if (isHome()) {
            prevRelease = "/" + TOTAL_RELEASES.toString();
        } else if (currentIndex == 1) {
            prevRelease = "/";
        } else {
            prevRelease = "/" + (currentIndex - 1).toString();
        }
        return prevRelease;
    };

    function renderPrevArrow() {
        return <div className="arrow arrow-prev">
            <svg
                viewBox="0 0 25 25"
                width="100%"
                height="100%"
                onClick={() => setLocation(getPrevReleasePath())}
            >
                <g className="arrow-path" fill={defaultColor}>
                    <path d="M14.41,16l5.3-5.29a1,1,0,0,0-1.42-1.42l-6,6a1,1,0,0,0,0,1.42l6,6a1,1,0,0,0,1.42,0,1,1,0,0,0,0-1.42Z" />
                </g>
            </svg>
        </div>
    };

    function getNextReleasePath() {
        let nextRelease;
        if (currentIndex == TOTAL_RELEASES) {
            nextRelease = "/";
        } else if (isHome()) {
            nextRelease = "/1";
        } else {
            nextRelease = "/" + (currentIndex + 1).toString();
        }
        return nextRelease;
    };

    function renderNextArrow() {
        <div className="arrow arrow-next">
            <svg
                viewBox="0 0 25 25"
                width="100%"
                height="100%"
                onClick={() => setLocation(getNextReleasePath())}
            >
                <g className="arrow-path" fill={defaultColor}>
                    <path d="M19.71,15.29l-6-6a1,1,0,0,0-1.42,1.42L17.59,16l-5.3,5.29a1,1,0,0,0,0,1.42,1,1,0,0,0,1.42,0l6-6A1,1,0,0,0,19.71,15.29Z" />
                </g>
            </svg>
        </div>
    };


    return (
        <Fragment>
            {renderPrevArrow()}
            {renderNextArrow()}
        </Fragment>
    );
}
