import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route } from 'react-router-dom';
import './index.css';
import App from './App';
import Header from './UI/Header/Header';
import history from './history'
import Release0001_Yahceph from './Releases/Release0001_Yahceph';
import Release0002_YearUnknown from "./Releases/Release0002_YearUnknown";
import Release0003_Othere from "./Releases/Release0003_Othere";
import Release0004_JonCannon from "./Releases/Release0004_JonCannon/index";
import Release0005_Plebeian from "./Releases/Release0005_Plebeian/index";
import Release0006_Vveiss from "./Releases/Release0006_Vveiss/index";
import Release0007_JonFay from "./Releases/Release0007_JonFay/index";

ReactDOM.render(
    <Router history={history}>
        <div>
            <Header />
            <Route exact path="/" component={App} />
            <Route path="/1" component={Release0001_Yahceph} />
            <Route path="/2" component={Release0002_YearUnknown} />
            <Route path="/3" component={Release0003_Othere} />
            <Route path="/4" component={Release0004_JonCannon} />
            <Route path="/5" component={Release0005_Plebeian} />
            <Route path="/6" component={Release0006_Vveiss} />
            <Route path="/7" component={Release0007_JonFay} />
        </div>
    </Router>,
    document.getElementById('root')
);
module.hot.accept();