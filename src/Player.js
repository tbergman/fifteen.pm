import React, {Fragment, PureComponent} from 'react';
import './Player.css'
import {formatSoundcloudSrc} from "./Utils/SoundcloudUtils";

class Player extends PureComponent {
  state = {
    paused: true, // Assume autoplay doesn't work.
    src: formatSoundcloudSrc(
      this.props.trackList[0].id,
      this.props.trackList[0].secretToken
    ),
    audioElement: document.getElementById('audio-player'),
    curTrackIdx: 0
  }

  static defaultProps = {
    fillColor: '#ffffff',
    selectedColor: '#fa0afa',
    type: 'audio/mpeg'
  }

  componentDidMount() {
    this.updateAudioElement()

  }

  componentDidUpdate() {
    this.updateAudioElement()
  }

  componentWillUnmount() {
    this.state.audioElement.removeEventListener('playing', this.resetPlayer, false);
    this.state.audioElement.removeEventListener('ended', this.advanceTrack, false);
  }

  updateAudioElement() {
    this.setState({
      audioElement: document.getElementById('audio-player')
    }, () => {
      this.state.audioElement.addEventListener('playing', this.resetPlayer, false);
      this.state.audioElement.addEventListener('ended', this.advanceTrack, false);
    });
  }

  isPlaying = (e) => {
    // Check if the audio is playing
    return this.state.audioElement.duration > 0
      && !this.state.audioElement.paused
      && !this.state.audioElement.ended;
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

  advanceTrack = () => {
    const {trackList} = this.props;
    const {curTrackIdx} = this.state;
    const nextTrackIdx = curTrackIdx + 1 === trackList.length ? 0 : curTrackIdx + 1;
    const nextTrack = trackList[nextTrackIdx];
    this.setState({
      curTrackIdx: nextTrackIdx,
      src: formatSoundcloudSrc(nextTrack.id, nextTrack.secretToken),
      paused: false
    });
  }

  handlePlay = () => {
    this.state.audioElement.play();
    this.setState({paused: false});
  }

  handlePause = () => {
    this.state.audioElement.pause();
    this.setState({paused: true});
  }

  handlePlayButtonClick = (e) => {
    e.preventDefault();
    if (!this.isPlaying()) {
      this.state.audioElement.play();
    }
    if (!this.state.paused) {
      this.handlePause();
    } else {
      this.handlePlay();
    }
  }

  handlePlaylistClick = (e, idx) => {
    const {trackList} = this.props;
    const track = trackList[idx];
    e.preventDefault();
    this.setState({
      curTrackIdx: idx,
      src: formatSoundcloudSrc(track.id, track.secretToken),
      paused: false
    });
  }

  renderPlaylist = () => {
    const {trackList, fillColor, selectedColor} = this.props;
    const {curTrackIdx} = this.state;
    const curTrack = trackList[curTrackIdx];
    if (trackList.length > 1) {
      const playList = trackList.map((track, idx) =>
        <li
          style={{color: track.id === curTrack.id ? selectedColor : fillColor}}
          className={track.id === curTrack.id ? "active-track" : null}
          onClick={((e) => this.handlePlaylistClick(e, idx))} key={track.id}>
          {track.id === curTrack.id && <span id="current-track-smiley">☻</span>}
          {track.title}
        </li>
      );
      return (
        <div id="playlist-container">
          <ul key={curTrack.id} id="playlist">{playList}</ul>
        </div>
      );
    }
  }

  renderPlayerButton = () => {
    const {paused} = this.state;
    const {message, fillColor} = this.props;
    return (
      <div id="play-button-container">
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
    );
  }

  renderPlayerElements = () => {
    const playButton = this.renderPlayerButton();
    const playList = this.renderPlaylist();
    return (
      <div id="player-container">
        {playButton}
        {playList}
      </div>
    );
  }

  renderAudioTag = () => {
    const {type, audioRef} = this.props;
    const {src} = this.state;
    return (
      <Fragment>
        <audio key={src} id="audio-player"
               autoPlay
               crossOrigin="anonymous"
               ref={audioRef}
        >
          <source src={src} type={type}/>
        </audio>
      </Fragment>
    );
  }


  render() {
    const playerElements = this.renderPlayerElements();
    const audioTag = this.renderAudioTag();
    return (
      <Fragment>
        {playerElements}
        {audioTag}
      </Fragment>
    );
  }
}

export default Player;
