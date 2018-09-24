import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Header from './Header';
import history from './history'
import Release0001 from './Releases/Release0001';
import MorphingBalls from "./Releases/MorphingBalls";
import Release0002 from "./Releases/Release0002";
import Release0003 from "./Releases/Release0003";
import Release0004 from "./Releases/Release0004";
import registerServiceWorker from './registerServiceWorker';
import {Router, Route} from 'react-router-dom';

ReactDOM.render(
  <Router history={history}>
    <div>
      <Header />
      <Route exact path="/" component={App} />
      <Route path="/gltd" component={MorphingBalls} />
      <Route path="/1" component={Release0001} />
      <Route path="/2" component={Release0002} />
      <Route path="/3" component={Release0003} />
      <Route path="/4" component={Release0004} />
    </div>
  </Router>,
  document.getElementById('root')
);
registerServiceWorker();
