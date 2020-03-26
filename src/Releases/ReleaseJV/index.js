import React, {Component, Fragment} from 'react';
import '../Release.css';
import {renderScene,} from "./scene"

class ReleaseJV extends Component {

  componentDidMount = () => {
    renderScene(this.container);
  }

  render = () => {
    return (
      <Fragment>
        <div className={'background'}>
          <div ref={element => this.container = element}/>
        </div>
      </Fragment>
    );
  }
}

export default ReleaseJV;
