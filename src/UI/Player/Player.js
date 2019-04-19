import React, { Fragment, PureComponent } from 'react';
import './Player.css'
import { formatSoundcloudSrc } from "../../Utils/Audio/SoundcloudUtils";
import { multiSourceVideo } from "../../Utils/Video/paths";

class Player extends PureComponent {
  state = {
    paused: true, // Assume autoplay doesn't work.
    mediaSource: this.getMediaSource(this.props.trackList[0]),
    mediaElement: document.getElementById('media-player'),
    curTrackIdx: 0,
  }

  static defaultProps = {
    fillColor: '#ffffff',
    selectedColor: '#fa0afa',
  }

  componentDidMount() {
    this.setState({ paused: true });
    this.updateMediaElement();
    if (!("ontouchstart" in document.documentElement)) {
      document.documentElement.className += "no-touch";
    }
  }

  componentDidUpdate = (prevProps, prevState) => {
    if (prevState.curTrackIdx !== this.state.curTrackIdx) {
      this.updateMediaElement();
      if (!this.state.paused) {
        this.handlePlay();
      }
    } 
    else if (!prevProps.initialized && this.props.initialized) {
      this.handlePlay();
    }
  }

  componentWillUnmount() {
    const { mediaElement } = this.state;
    mediaElement.removeEventListener('playing', this.resetPlayer, false);
    mediaElement.removeEventListener('ended', this.advanceTrack, false);
  }

  getMediaSource(trackInfo) {
    // TODO: Does it make the most sense for multi-audio tracks to create a single audio tag with multiple sources?
    if (trackInfo.type === "soundcloud") {
      // videos have multiple src for same content, so sources stored as lists
      return [{
        src: formatSoundcloudSrc(trackInfo.id, trackInfo.secretToken),
        type: "audio/mpeg"
      }]
    } else if (trackInfo.type === "video") {
      return multiSourceVideo(trackInfo.id)
    } else throw "Unsupported track type."
  }


  updateMediaElement() {
    this.setState({
      mediaElement: document.getElementById('media-player')
    }, () => {
      const { mediaElement } = this.state;
      mediaElement.addEventListener('playing', this.resetPlayer, false);
      mediaElement.addEventListener('ended', this.advanceTrack, false);
    });
  }

  isPlaying() {
    // Check if the audio is playing
    const { mediaElement } = this.state;
    return mediaElement.duration > 0
      && !mediaElement.paused
      && !mediaElement.ended;
  }

  resetPlayer = () => {
    let {paused} = this.state;
    if (this.isPlaying() && paused) {
      this.setState({ paused: false });
    }
  }

  setCurrentTrack(trackIdx) {
    const {trackList} = this.props;
    this.setState({
      curTrackIdx: trackIdx,
      mediaSource: this.getMediaSource(trackList[trackIdx]),
      paused: false
    });
  }

  advanceTrack = (e) => {
    e.preventDefault();
    const { trackList } = this.props;
    const { curTrackIdx } = this.state;
    const nextTrackIdx = curTrackIdx + 1 === trackList.length ? 0 : curTrackIdx + 1;
    this.setCurrentTrack(nextTrackIdx);
  }
  
  handlePlay() {
    this.setState({ paused: false }, () => {
      this.state.mediaElement.play();
    });
  }

  handlePause() {
    this.setState({ paused: true }, () => {
      this.state.mediaElement.pause();
    });
  }

  handlePlayButtonClick = (e) => {
    e.preventDefault();
    this.state.paused
      ? this.handlePlay()
      : this.handlePause()
  }

  handlePlaylistClick = (e) => {
    e.preventDefault();
    const trackIdx = Number(e.target.getAttribute('data-id'));
    console.log("trackIdx is", trackIdx)
    this.setCurrentTrack(trackIdx);
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
    const { paused } = this.state;
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
            <text fill="#000" stroke="red">
              <textPath xlinkHref="#circlePath" fill={fillColor}>{message}</textPath>
            </text>
          </g>
        </svg>
        <div
          onClick={this.handlePlayButtonClick}
          className={paused ? 'button' : 'button paused'}
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
    const { mediaRef } = this.props; // NOTE: This mediaRef causes this component to constantly re-render.
    const { mediaSource } = this.state;
    const source = mediaSource[0];
    return (
      <audio
        key={source.src}
        id="media-player"
        crossOrigin="anonymous"
        ref={mediaRef}
      >
        <source src={source.src} type={source.type} />
      </audio>
    );
  }

  renderVideoTag() {
    const { mediaRef } = this.props;
    const { mediaSource } = this.state;
    return (
      <video
        key={mediaSource[0].src}
        id="video-player"
        crossOrigin="anonymous"
        ref={mediaRef}
      >
        {mediaSource.map((source, idx) => (
          <source src={source.src} type={source.type} />
        ))}
      </video>
    )
  }

  renderMediaTag() {
    let { mediaSource } = this.state;
    const typ = mediaSource[0].type; // videos have multiple src for same content, so sources stored as lists
    if (typ === "audio/mpeg") {
      return this.renderAudioTag();
    } else if (typ === "video/mp4") {
      return this.renderVideoTag();
    } else throw "Unsupported media type for Player."
  }


  render() {
    return (
      <Fragment>
        {this.renderPlayerElements()}
        {this.renderMediaTag()}
      </Fragment>
    );
  }
}

export default Player;