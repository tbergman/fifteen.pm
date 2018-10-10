import React, {Fragment, Component} from 'react';
import TrackPlayer from './TrackPlayer';
import Playlist from './Playlist';
import {PLAYLISTS} from "./PlaylistConstants";

const soundcloudClientId = "ad6375f4b6bc0bcaee8edf53ab37e7f2"; // 😄
const soundcloudApiUrl = "https://api.soundcloud.com/tracks";

class Player extends Component {
  constructor(props){
    super(props);
    this.state = {
      curTrackId: this.props.trackList[0].id
    };

    this.handleTrackIdChange = this.handleTrackIdChange.bind(this);
  }

  static defaultProps = {
    fillColor: '#ffffff',
    type: 'audio/mpeg',
    secretToken: undefined
  }

  componentDidMount() {
    this.setState({
      curTrackId: this.props.trackList[0].id
    })
  }

  formatSoundcloudSrc(trackId, secretToken) {
    let url = `${soundcloudApiUrl}/${trackId}/stream?client_id=${soundcloudClientId}`;
    if (secretToken !== undefined) {
      url += `&secret_token=${secretToken}`
    }
    return url;
  }

  handleTrackIdChange(trackId) {
    this.setState({
      curTrackId: trackId
    })
  }

  render() {
    const {message, inputRef, trackId, secretToken, fillColor, trackList} = this.props;

    return (
      <Fragment>
        <TrackPlayer
          src={this.formatSoundcloudSrc(this.state.curTrackId, secretToken)}
          message={message}
          inputRef={inputRef}
          fillColor={fillColor}
        />
        <Playlist
          onTrackIdChange={this.handleTrackIdChange}
          trackList={trackList}
        />
      </Fragment>
    );
  }
}

export default Player;
