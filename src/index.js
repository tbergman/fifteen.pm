import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Header from './Header';
import Release0001 from './Releases/Release0001';
import MorphingBalls from "./Releases/MorphingBalls";

import registerServiceWorker from './registerServiceWorker';
import { BrowserRouter as Router, Route } from 'react-router-dom';

ReactDOM.render(
  <Router>
    <div>
      <Header />
      <Route exact path="/" component={App} />
      <Route path="/gltd" component={MorphingBalls} />
      <Route path="/1" component={Release0001} />
    </div>
  </Router>,
  document.getElementById('root')
);
registerServiceWorker();
