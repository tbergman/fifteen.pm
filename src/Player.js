import React, { Component } from 'react';
import './Player.css';

class Player extends Component {
  shouldComponentUpdate() {
    return false;
  }

  state = {
    paused: true,
  }

  componentDidMount() {
    this.audioPlayer = document.getElementById('audio-player');
  }

  onClick = (e) => {
    e.preventDefault();
    if(!this.state.paused) {
      this.play.beginElement();
      this.audioPlayer.play();
    } else {
      this.pause.beginElement();
      this.audioPlayer.pause();
    }
    this.setState({ paused: !this.state.paused});
  }

  render() {
    return (
      <div id="player-container">
        <div id="player">
          <svg x="0px" y="0px" width="300px" height="300px" viewBox="0 0 300 300">
            <defs>
                <path id="circlePath" d=" M 150, 150 m -60, 0 a 60,60 0 0,1 120,0 a 60,60 0 0,1 -120,0 "/>
            </defs>
            <circle cx="100" cy="100" r="50" fill="none" stroke="none"/>
            <g>
                <use href="#circlePath" fill="none"/>
                <text fill="#000">
                    <textPath href="#circlePath">YAHCEPH</textPath>
                </text>
            </g>
          </svg>
        </div>
        <div id="button">
          <svg width="50" height="50" id='pause' onClick={this.onClick}>
            <circle id="circle" cx="25" cy="25" r="12.5" fill="none" className="play" />
            <line id='line1' x1="19" y1="15" x2="19" y2="35" stroke="white" strokeWidth="5px" strokeLinecap="round"/>
            <path id='line2' d="M 33 15 L 33 25 L 33 35" rx="5" ry="5" fill="white" stroke="white" strokeWidth="5px"  strokeLinecap="round" >
              <animate
                ref={element => this.pause = element}
                attributeName="d"
                dur="300ms"
                from="M 33 15 L 33 25 L 33 35"
                to="M 19 15 L 35 25 L 19 35"
                begin="indefinite"
                fill="freeze"
              />
            </path>
            <animate
              ref={element => this.play = element}
              href="#line2"
              attributeName="d"
              dur="300ms"
              from="M 19 15 L 35 25 L 19 35"
              to="M 33 15 L 33 25 L 33 35"
              fill="freeze"
              begin="indefinite"
            />
          </svg>
        </div>
      </div>
    );
  }
}

export default Player;
