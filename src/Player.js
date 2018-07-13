import React, {Component} from 'react';
import ReactHowler from 'react-howler';
import {isMobileSafari} from "./Utils/BrowserDetection";
import './Player.css';


class Player extends Component {
  state = {
    playing: isMobileSafari() ? false : true
  }

  handlePlay = () => {
    this.setState({
      playing: true
    })
  }

  handlePause = () => {
    this.setState({
      playing: false
    })
  }

  onClick = (e) => {
    console.log(this.player)
    console.log(this.player.howler)
    e.preventDefault();
    if (this.state.playing) {
      this.handlePause();
    } else {
      this.handlePlay();
    }
  }

  render() {
    return (
      <div id="player-container">
        <div id="player">
          <ReactHowler
            src={this.props.src}
            playing={this.state.playing}
            ref={ref => this.player = ref}
          />
          <svg x="0px" y="0px" width="300px" height="300px" viewBox="0 0 300 300">
            <defs>
              <path id="circlePath" d=" M 150, 150 m -60, 0 a 60,60 0 0,1 120,0 a 60,60 0 0,1 -120,0 "/>
            </defs>
            <circle cx="100" cy="100" r="50" fill="none" stroke="none"/>
            <g>
              <use xlinkHref="#circlePath" fill="none"/>
              <text fill="#000">
                <textPath xlinkHref="#circlePath">{this.props.playerText}</textPath>
              </text>
            </g>
          </svg>
          <button
            onClick={this.onClick}
            className={this.state.playing ? 'button paused' : 'button'}
          />
        </div>
      </div>
    );
  }
}

export default Player;
