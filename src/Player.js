import React, {Fragment, Component} from 'react';
import './Player.css'

const soundcloudClientId = "ad6375f4b6bc0bcaee8edf53ab37e7f2"; // 😄
const soundcloudApiUrl = "https://api.soundcloud.com/tracks";

class Player extends Component {
  state = {
    paused: true, // Assume autoplay doesn't work.
    src: this.formatSoundcloudSrc(
      this.props.trackList[0].id,
      this.props.trackList[0].secretToken
    )
  }

  static defaultProps = {
    fillColor: '#ffffff',
    type: 'audio/mpeg',
    inputRef: 'audio'
  }

  componentDidMount() {
    this.audioPlayer = document.getElementById('audio-player');
    this.audioPlayer.addEventListener('playing', this.resetPlayer, false);
  }

  formatSoundcloudSrc(trackId, secretToken) {
    let url = `${soundcloudApiUrl}/${trackId}/stream?client_id=${soundcloudClientId}`;
    if (secretToken !== undefined) {
      url += `&secret_token=${secretToken}`
    }
    return url;
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
    this.audioPlayer.pause();
    this.audioPlayer.load();
    this.audioPlayer.play();
    this.setState({paused: false});
  }

  handlePause = () => {
    this.audioPlayer.pause();
    this.setState({paused: true});
  }

  handlePlayButtonClick = (e) => {
    e.preventDefault();
    if (!this.isPlaying()) {//} && this.audioPlayer.currentSrc === this.state.src) {
      this.audioPlayer.play();
    }
    if (!this.state.paused) {
      this.handlePause();
    } else {
      this.handlePlay();
    }
  }


  handlePlaylistClick = (e, track) => {
    e.preventDefault();
    this.setState({
      src: this.formatSoundcloudSrc(track.id, track.secretToken),
      paused: false
    }, () => {
      this.audioPlayer = document.getElementById('audio-player');
    });
  }


  renderPlayButton = () => {
    const {paused} = this.state;
    const {message, fillColor} = this.props;
    return (
      <div id="track-player-container">
        <div id="play-button">
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
          <div onClick={this.handlePlayButtonClick} className={paused ? 'button' : 'button paused'}
               style={{borderColor: `transparent transparent transparent ${fillColor}`}}/>
        </div>
      </div>
    );
  }

  renderAudioTag = () => {
    const {inputRef, type} = this.props;
    const {src} = this.state;
    return (
      <Fragment>
        <audio key={src} id="audio-player" autoPlay loop crossOrigin="anonymous" ref={inputRef}>
          <source src={src} type={type}/>
        </audio>
      </Fragment>
    );
  }

  renderPlaylist = () => {
    const {trackList} = this.props;
    const playList = trackList.map((track) =>
      <li onClick={((e) => this.handlePlaylistClick(e, track))} key={track.id}>{track.title}</li>
    );
    if (trackList.length > 1) {
      return (
        <div id="playlist-container">
          <ul id="playlist">{playList}</ul>
        </div>
      );
    }
  }

  render() {
    const playButton = this.renderPlayButton();
    const audioTag = this.renderAudioTag();
    const playList = this.renderPlaylist();
    return (
      <Fragment>
        {playButton}
        {audioTag}
        {playList}
      </Fragment>
    );
  }
}

export default Player;
