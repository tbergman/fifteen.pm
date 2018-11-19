import React, {PureComponent} from 'react';
import Player from '../Player/Player';
import Purchase from '../Purchase/Purchase';
import {isNoUIMode} from '../../Utils/modes'

class Footer extends PureComponent {

  render() {
    const {content, fillColor, audioRef} = this.props;
    const style = isNoUIMode() ? {display: 'none'} : {};
    return (
      <div style={style}>
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
      </div>
    );
  }
}

export default Footer;
