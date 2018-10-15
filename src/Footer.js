import React, {PureComponent} from 'react';
import Player from './Player';
import Purchase from './Purchase';

class Footer extends PureComponent {

  render() {
    const {content, fillColor, audioRef} = this.props;
    return (
      <div className="footer">
        <Player
          trackList={content.tracks}
          message={content.artist}
          fillColor={fillColor}
          audioRef={audioRef}
        />
        <Purchase
          fillColor={fillColor}
          href={content.purchaseLink}
        />
      </div>
    );
  }
}

export default Footer;
