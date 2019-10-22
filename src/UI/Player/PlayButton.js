import React from "react"
import './Player.css'


// function PlayerButton({fillColor, message}) {
//     // const { paused } = this.state;
//     // const { message, fillColor } = this.props;
//     return (
//       <div id="play-button-container">
//         <svg x="0px" y="0px" width="300px" height="300px" viewBox="0 0 300 300" fill={fillColor}>
//           <defs>
//             <path id="circlePath" d=" M 150, 150 m -60, 0 a 60,60 0 0,1 120,0 a 60,60 0 0,1 -120,0 " />
//           </defs>
//           <circle cx="100" cy="100" r="50" fill="none" stroke="none" />
//           <g>
//             <use xlinkHref="#circlePath" fill="none" />
//             <text fill="#000" stroke="red">
//               <textPath xlinkHref="#circlePath" fill={fillColor}>{message}</textPath>
//             </text>
//           </g>
//         </svg>
//         <div
//           onClick={this.handlePlayButtonClick}
//           className={paused ? 'button' : 'button paused'}
//           style={{ borderColor: `transparent transparent transparent ${fillColor}` }} />
//       </div>
//     );
//   }

export default function PlayButton({ fillColor, message }) {
    return <svg x="0px" y="0px" width="300px" height="300px" viewBox="0 0 300 300" fill={fillColor}>
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
}

