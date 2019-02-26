import React, {Component, Fragment} from 'react';
import '../Release.css';
import './index.css';
import Menu from '../../Main/Menu/Menu';
import {CONTENT} from "../../Main/Content";
import {renderScene, assetPath7} from "./scene"

class ReleaseJV extends Component {

  componentDidMount = () => {
    renderScene(this.container);
  }

  render = () => {
    return (
      <Fragment>
        <div className={'background'}>
        <div ref={element => this.container = element}/>
        <Menu
          content={CONTENT[window.location.pathname]}
          audioRef={el => this.audioElement = el}
        />
        </div>
      </Fragment>
    );
  }
}

export default ReleaseJV;
