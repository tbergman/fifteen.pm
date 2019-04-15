import React, { Component, Fragment } from 'react';
import { Route } from 'react-router-dom';
import HomeDefault from './Home/HomeDefault';
import HomeMobile from './Home/HomeMobile';

import Media from 'react-media';
import './App.css';

class App extends Component {

  render() {
    return (
      <Fragment>
        <Media query="(max-width: 599px)">
          {matches =>
            matches ? (
              <Route exact path="/" component={HomeMobile} />
            ) : (
                <Route exact path="/" component={HomeDefault} />
              )
          }
        </Media>
      </Fragment>
    );
  }
}

export default App;
