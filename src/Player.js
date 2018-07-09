import React, { Component } from 'react';
import {isSafari} from "./Utils/BrowserDetection";
import './Player.css';

class Player extends Component {

  state = {
    paused: !isSafari,
  }

  componentDidMount() {
    this.audioPlayer = document.getElementById('audio-player');
  }

  onClick = (e) => {
    e.preventDefault();
    console.log('clicked');
    if(!this.state.paused) {
      this.audioPlayer.play();
    } else {
      this.audioPlayer.pause();
    }
    this.setState({ paused: !this.state.paused});

  }

  render() {
    console.log('this', this.state.paused);
    return (
      <div id="player-container">
        <div id="player">
          <svg x="0px" y="0px" width="300px" height="300px" viewBox="0 0 300 300">
            <defs>
                <path id="circlePath" d=" M 150, 150 m -60, 0 a 60,60 0 0,1 120,0 a 60,60 0 0,1 -120,0 "/>
            </defs>
            <circle cx="100" cy="100" r="50" fill="none" stroke="none"/>
            <g>
                <use xlinkHref="#circlePath" fill="none"/>
                <text fill="#000">
                    <textPath xlinkHref="#circlePath">YAHCEPH</textPath>
                </text>
            </g>
          </svg>
          <button onClick={this.onClick} className={this.state.paused ? 'button paused' : 'button'}></button>
        </div>
      </div>
    );
  }
}

export default Player;
