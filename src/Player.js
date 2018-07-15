import React, {Component} from 'react';
import ReactHowler from 'react-howler';
import {isMobileSafari, isChrome} from "./Utils/BrowserDetection";
import './Player.css';


class Player extends Component {
  state = {
    playing: true
  }

  componentDidMount() {
    this.audioPlayer = document.getElementById('audio-player');
    this.updateState()
  }

  isPlaying = (e) => {
    // Check if the audio is playing
    return this.audioPlayer.duration > 0
            && !this.audioPlayer.paused
            && !this.audioPlayer.ended;
  }

  resetPlayer = () => {
    if (!this.isPlaying()) {
      this.setState({paused: true});
    }
    else {
      if (this.state.paused) {
        this.setState({paused: false});
      }
    }
  }

  updateState = () => {
    this.resetPlayer();
    setTimeout(this.updateState, 300);
  }

  handlePlay = () => {
    this.audioPlayer.play();
    this.setState({ paused: false});
  }

  handlePause = () => {
    this.audioPlayer.pause();
    this.setState({ paused: true});
  }

  onClick = (e) => {
    e.preventDefault();
    if(!this.isPlaying()) {
      this.audioPlayer.play();
      this.setState
    }
    if(!this.state.paused) {
      this.handlePause()
    } else {
      this.handlePlay();
    }
  }

  render() {
    const {props, state, onClick} = this;
    return (
      <div id="player-container">
        <div id="player">
          <ReactHowler
            src={src}
            preoad={true}
            playing={playing}
            ref={ref => this.player = ref}
            loop={true}
          />
          <svg x="0px" y="0px" width="300px" height="300px" viewBox="0 0 300 300">
            <defs>
              <path id="circlePath" d=" M 150, 150 m -60, 0 a 60,60 0 0,1 120,0 a 60,60 0 0,1 -120,0 "/>
            </defs>
            <circle cx="100" cy="100" r="50" fill="none" stroke="none"/>
            <g>
                <use xlinkHref="#circlePath" fill="none"/>
                <text fill="#000">
                    <textPath xlinkHref="#circlePath">{props.message}</textPath>
                </text>
            </g>
          </svg>
          <button onClick={onClick} className={state.paused ? 'button' : 'button paused'}></button>
          <audio id="audio-player" loop autoPlay ref={props.inputRef} preload="none">
            <source src={props.src} type={props.type}/>
          </audio>
        </div>
      </div>
    );
  }
}

export default Player;
