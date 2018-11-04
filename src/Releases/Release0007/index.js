import React, {Component, Fragment} from 'react';
import '../Release.css';
import './index.css';
import Footer from '../../Footer';
import {CONTENT} from "../../Content";
import {renderScene, assetPath7} from "./scene"

class Release0007 extends Component {

  componentDidMount = () => {
    renderScene(this.container);
  }

  render = () => {
    return (
      <Fragment>
        <div className={'background'}>
        <div ref={element => this.container = element}/>
        <Footer
          content={CONTENT[window.location.pathname]}
          fillColor="white"
          audioRef={el => this.audioElement = el}
        />
        </div>
      </Fragment>
    );
  }
}

export default Release0007;
