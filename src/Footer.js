import React, {PureComponent} from 'react';
import Player from './Player';
import Purchase from './Purchase';

class Footer extends PureComponent {

  render() {
    const {playlist, fillColor, purchaseHref} = this.props;
    return (
      <div className="footer">
        <Player
          trackList={playlist.tracks}
          message={playlist.artist}
          fillColor={fillColor}
        />
        <Purchase
          fillColor={fillColor}
          href={purchaseHref}
        />
      </div>
    );
  }
}

export default Footer;
