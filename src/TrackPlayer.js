import React, {Component} from 'react';
import './TrackPlayer.css';


class TrackPlayer extends Component {
  static defaultProps = {
    fillColor: '#ffffff',
  }

  // Assume autplay does not work.
  state = {
    paused: true
  }

  componentDidMount() {
    this.audioPlayer = document.getElementById('audio-player');

    this.audioPlayer.addEventListener('playing', this.resetPlayer, false)
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
    }
    if(!this.state.paused) {
      this.handlePause();
    } else {
      this.handlePlay();
    }
  }

  render() {
    const {paused} = this.state;
    const {message, inputRef, src, type, fillColor} = this.props;
    return (
      <div id="player-container">
        <div id="player">
          <svg x="0px" y="0px" width="300px" height="300px" viewBox="0 0 300 300" fill={fillColor}>
            <defs>
              <path id="circlePath" d=" M 150, 150 m -60, 0 a 60,60 0 0,1 120,0 a 60,60 0 0,1 -120,0 "/>
            </defs>
            <circle cx="100" cy="100" r="50" fill="none" stroke="none"/>
            <g>
                <use xlinkHref="#circlePath" fill="none"/>
                <text fill="#000" stroke="red">
                    <textPath xlinkHref="#circlePath" fill={fillColor}>{message}</textPath>
                </text>
            </g>
          </svg>
          <div onClick={this.onClick} className={paused ? 'button' : 'button paused'} style={{borderColor: `transparent transparent transparent ${fillColor}`}}/>
          <audio id="audio-player" loop autoPlay crossOrigin="anonymous" ref={inputRef}>
            <source src={src} type={type}/>
          </audio>
        </div>
      </div>
    );
  }
}

export default TrackPlayer;
