import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Header from './Header';
import Release0001 from './Releases/Release0001';
import MorphingBalls from "./Releases/MorphingBalls";
import Release0002 from "./Releases/Release0002";
import Release0003 from "./Releases/Release0003";
import Release0004 from "./Releases/Release0004";
import Release0004Video from "./Releases/Release0004Video";
import Release0004Universe from "./Releases/Release0004Universe";
import registerServiceWorker from './registerServiceWorker';
import { BrowserRouter as Router, Route } from 'react-router-dom';

ReactDOM.render(
  <Router>
    <div>
      <Header />
      <Route exact path="/" component={App} />
      <Route path="/gltd" component={MorphingBalls} />
      <Route path="/1" component={Release0001} />
      <Route path="/2" component={Release0002} />
      <Route path="/3" component={Release0003} />
      <Route path="/4" component={Release0004} />
      <Route path="/4v" component={Release0004Video} />
      <Route path="/4u" component={Release0004Universe} />
    </div>
  </Router>,
  document.getElementById('root')
);
registerServiceWorker();
