import React, {Component} from 'react';
import Player from './Player';

const soundcloudClientId = "ad6375f4b6bc0bcaee8edf53ab37e7f2";
const soundcloudApiUrl  = "https://api.soundcloud.com/tracks";

class SoundcloudPlayer extends Component {
  
  static defaultProps = {
    fillColor: '#ffffff',
    type: 'audio/mpeg',
    secretToken: undefined
  }

  formatSoundcloudSrc(trackId, secretToken) {
    let url = `${soundcloudApiUrl}/${trackId}/stream?client_id=${soundcloudClientId}`;
    if (secretToken !== undefined) {
      url += `&secret_token=${secretToken}`
    }
    return url;
  }

  render() {
    const {message, inputRef, trackId, secretToken, fillColor} = this.props;
    return (
      <Player             
        src={this.formatSoundcloudSrc(trackId, secretToken)}
        message={message}
        inputRef={inputRef}
        fillColor={fillColor}
      />
    );
  }
}

export default SoundcloudPlayer;
