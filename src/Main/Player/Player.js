import React, { Fragment, Component } from 'react';
import './Player.css'
import { formatSoundcloudSrc } from "../../Utils/SoundcloudUtils";

class Player extends Component {
  state = {
    pausedState: true,
    src: formatSoundcloudSrc(
      this.props.trackList[0].id,
      this.props.trackList[0].secretToken
    ),
    audioElement: document.getElementById('audio-player'),
    curTrackIdx: 0,
  }

  static defaultProps = {
    fillColor: '#ffffff',
    selectedColor: '#fa0afa',
    type: 'audio/mpeg'
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.paused !== prevState.pausedState) {
      return { paused: nextProps.paused };
    }
    else return null;
  }

  componentDidMount() {
    this.updateAudioElement();
    if (!("ontouchstart" in document.documentElement)) {
      document.documentElement.className += "no-touch";
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if(prevProps.paused!==this.props.paused && !this.props.paused){
        this.handlePlay();
    }
  }

  componentWillUnmount() {
    const { audioElement } = this.state;
    audioElement.removeEventListener('playing', this.resetPlayer, false);
    audioElement.removeEventListener('ended', this.advanceTrack, false);
  }

  updateAudioElement() {
    this.setState({
      audioElement: document.getElementById('audio-player')
    }, () => {
      const { audioElement } = this.state;
      audioElement.addEventListener('playing', this.resetPlayer, false);
      audioElement.addEventListener('ended', this.advanceTrack, false);
    });
  }

  isPlaying() {
    // Check if the audio is playing
    const { audioElement } = this.state;
    return audioElement.duration > 0
      && !audioElement.paused
      && !audioElement.ended;
  }

  resetPlayer = () => {
    if (this.isPlaying() || !this.state.pausedState) {
      this.setState({ pausedState: false });
    }
  }

  setCurrentTrack(trackIdx, { id, secretToken }) {
    this.setState({
      curTrackIdx: trackIdx,
      src: formatSoundcloudSrc(id, secretToken),
      pausedState: false
    });
  }

  advanceTrack = (e) => {
    e.preventDefault();
    const { trackList } = this.props;
    const { curTrackIdx } = this.state;
    const nextTrackIdx = curTrackIdx + 1 === trackList.length ? 0 : curTrackIdx + 1;
    const track = trackList[nextTrackIdx];

    this.setCurrentTrack(nextTrackIdx, track);
  }

  handlePlay() {
    this.setState({ pausedState: false }, () => {
      this.state.audioElement.play();
    });
  }

  handlePause() {
    this.setState({ pausedState: true }, () => {
      this.state.audioElement.pause();
    });
  }

  handlePlayButtonClick = (e) => {
    e.preventDefault();
    !this.state.pausedState
      ? this.handlePause()
      : this.handlePlay()
  }

  handlePlaylistClick = (e) => {
    e.preventDefault();
    const { trackList } = this.props;
    const trackIdx = Number(e.target.getAttribute('data-id'));
    const track = trackList[trackIdx];

    this.setCurrentTrack(trackIdx, track);
  }

  renderPlaylist() {
    const { trackList, fillColor, selectedColor } = this.props;
    const { curTrackIdx } = this.state;
    const curTrack = trackList[curTrackIdx];

    if (trackList.length > 1) {
      const playList = trackList.map((track, idx) =>
        <li
          style={{ color: track.id === curTrack.id ? selectedColor : fillColor }}
          className={track.id === curTrack.id ? "active-track" : null}
          onClick={this.handlePlaylistClick}
          key={track.id}
          data-id={idx}
        >
          {track.id === curTrack.id && <span id="current-track-smiley">☻</span>}
          {track.title}
        </li>
      );
      return (
        <div id="playlist-container">
          <ul key='playlist' id="playlist">{playList}</ul>
        </div>
      );
    }
  }

  renderPlayerButton() {
    const { pausedState } = this.state;
    const { message, fillColor } = this.props;
    return (
      <div id="play-button-container">
        <svg x="0px" y="0px" width="300px" height="300px" viewBox="0 0 300 300" fill={fillColor}>
          <defs>
            <path id="circlePath" d=" M 150, 150 m -60, 0 a 60,60 0 0,1 120,0 a 60,60 0 0,1 -120,0 " />
          </defs>
          <circle cx="100" cy="100" r="50" fill="none" stroke="none" />
          <g>
            <use xlinkHref="#circlePath" fill="none" />
            <text fill={fillColor} stroke={fillColor}>
              <textPath xlinkHref="#circlePath" fill={fillColor}>{message}</textPath>
            </text>
          </g>
        </svg>
        <div
          onClick={this.handlePlayButtonClick}
          className={pausedState ? 'button' : 'button paused'}
          style={{ borderColor: `transparent transparent transparent ${fillColor}` }} />
      </div>
    );
  }

  renderPlayerElements() {
    return (
      <div id="player-container">
        {this.renderPlayerButton()}
        {this.renderPlaylist()}
      </div>
    );
  }

  renderAudioTag() {
    const { type, audioRef } = this.props;
    const { src } = this.state;

    return (
      <audio
        key={src}
        id="audio-player"
        crossOrigin="anonymous"
        ref={audioRef}
      >
        <source src={src} type={type} />
      </audio>
    );
  }


  render() {
    return (
      <Fragment>
        {this.renderPlayerElements()}
        {this.renderAudioTag()}
      </Fragment>
    );
  }
}

export default Player;
