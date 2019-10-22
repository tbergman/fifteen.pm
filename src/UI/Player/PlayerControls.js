import React from "react"
import useMusicPlayer from "./hooks";
import './Player.css'
import PlayButton from './PlayButton';
// import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
// import {faPause, faPlay, faStepBackward, faStepForward} from "@fortawesome/free-solid-svg-icons";

function PlayerControls({ fillColor, message }) {
    const { isPlaying, currentTrackName, togglePlay, playPreviousTrack, playNextTrack } = useMusicPlayer();
    console.log('isPlaying', isPlaying, 'currentTrackName', currentTrackName, 'togglePlay', togglePlay)
    return (
        <>
            <div id="play-button-container">
                <svg x="0px" y="0px" width="300px" height="300px" viewBox="0 0 300 300" fill={fillColor}>
                    <defs>
                        <path id="circlePath" d=" M 150, 150 m -60, 0 a 60,60 0 0,1 120,0 a 60,60 0 0,1 -120,0 " />
                    </defs>
                    <circle cx="100" cy="100" r="50" fill="none" stroke="none" />
                    <g>
                        <use xlinkHref="#circlePath" fill="none" />
                        <text fill="#000" stroke="red">
                            <textPath xlinkHref="#circlePath" fill={fillColor}>{message}</textPath>
                        </text>
                    </g>
                </svg>
                <div
                    onClick={togglePlay}
                    className={isPlaying ? 'button' : 'button paused'}
                    style={{ borderColor: `transparent transparent transparent ${fillColor}` }} />

            </div>
        </>
    )
}

export default PlayerControls

// const { paused } = this.state;
// const { message, fillColor } = this.props;
// return (
//   <div id="play-button-container">
//     <svg x="0px" y="0px" width="300px" height="300px" viewBox="0 0 300 300" fill={fillColor}>
//       <defs>
//         <path id="circlePath" d=" M 150, 150 m -60, 0 a 60,60 0 0,1 120,0 a 60,60 0 0,1 -120,0 " />
//       </defs>
//       <circle cx="100" cy="100" r="50" fill="none" stroke="none" />
//       <g>
//         <use xlinkHref="#circlePath" fill="none" />
//         <text fill="#000" stroke="red">
//           <textPath xlinkHref="#circlePath" fill={fillColor}>{message}</textPath>
//         </text>
//       </g>
//     </svg>
// //     <div
//       onClick={this.handlePlayButtonClick}
//       className={paused ? 'button' : 'button paused'}
//       style={{ borderColor: `transparent transparent transparent ${fillColor}` }} />
//   </div>
// );


// {/* <div className="box controls has-background-grey-dark">
//                 {/* <div className="current-track has-text-light">
//                     <marquee>{currentTrackName}</marquee>
//                 </div> */}
//                 {/* <div>
//                     <button className="button has-text-light has-background-grey-dark" onClick={playPreviousTrack} disabled={!currentTrackName}>
//                         <PlayButton />
//                         {/* <FontAwesomeIcon icon={faStepBackward} /> */}
//                         </button>
//                         <button className="button has-text-light has-background-grey-dark" onClick={togglePlay} disabled={!currentTrackName}>
//                             <PlayButton />
//                             {/* {isPlaying ? <FontAwesomeIcon icon={faPause} /> : <FontAwesomeIcon icon={faPlay} />} */}
//                         </button>
//                         <button className="button has-text-light has-background-grey-dark" onClick={playNextTrack} disabled={!currentTrackName}>
//                             <PlayButton />
//                             {/* <FontAwesomeIcon icon={faStepForward} /> */}
//                         </button> */}
//                     </div> */}