import React, {Component} from "react";
import './Playlist.css';

class Playlist extends Component {

  constructor(props) {
    super(props)
    this.handleTrackIdChange = this.handleTrackIdChange.bind(this);
  }


  handleTrackIdChange = (e, trackId) => {
    this.props.onTrackIdChange(trackId)
  }

  render() {
    const {trackList} = this.props;
    const playList = trackList.map((track) =>
      <li onClick={((e) => this.handleTrackIdChange(e, track.id))} key={track.id}>{track.title}</li>
    );
    return (
      <div id="playlist-container">
        <ul id="playlist">{playList}</ul>
      </div>
    );
  }
}


export default Playlist;
