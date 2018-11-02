import React, {Component, Fragment} from 'react';
import '../Release.css';
import Footer from '../../Footer';
import {CONTENT} from "../../Content";
import {renderScene} from "./scene"

class Release0007 extends Component {

  componentDidMount = () => {
    renderScene(this.container);
  }

  render = () => {
    return (
    <div>
      <Fragment>
        <div ref={element => this.container = element}/>
        <Footer
          content={CONTENT[window.location.pathname]}
          fillColor="white"
          audioRef={el => this.audioElement = el}
        />
      </Fragment>
    </div>
    );
  }
}

export default Release0007;
