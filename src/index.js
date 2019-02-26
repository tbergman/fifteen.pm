import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './Main/App';
import Header from './Main/Header/Header';
import history from './history'
import Release0001 from './Releases/Release0001';
// import MorphingBalls from "./SpikeWork/MorphingBalls";
import Release0002 from "./Releases/Release0002";
import Release0003 from "./Releases/Release0003";
import Release0004 from "./Releases/Release0004/index";
import Release0005 from "./Releases/Release0005/index";
import Release0006 from "./Releases/Release0006/index";
import ReleaseJV from "./Releases/ReleaseJV/index";
import registerServiceWorker from './registerServiceWorker';
import {Router, Route} from 'react-router-dom';

ReactDOM.render(
    <Router history={history}>
        <div>
            <Header/>
            <Route exact path="/" component={App}/>
            {/* <Route path="/gltd" component={MorphingBalls}/> */}
            <Route path="/1" component={Release0001}/>
            <Route path="/2" component={Release0002}/>
            <Route path="/3" component={Release0003}/>
            <Route path="/4" component={Release0004}/>
            <Route path="/5" component={Release0005}/>
            <Route path="/6" component={Release0006}/>
            <Route path="/jv" component={ReleaseJV}/>
        </div>
    </Router>,
    document.getElementById('root')
);
registerServiceWorker();
