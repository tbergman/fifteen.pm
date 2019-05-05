import 'babel-polyfill';
import './Utils/MatchMediaMock';
import React from 'react';
import ReactDOM from 'react-dom';
import { StaticRouter, Route,  BrowserRouter } from 'react-router-dom';
import ReactDOMServer from 'react-dom/server';
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
import Release0008_GreemJellyfish_EventFlyer from "./Releases/Release0008_GreemJellyfish/flyer";

var isNode = false;    
if (typeof process === 'object') {
  if (typeof process.versions === 'object') {
    if (typeof process.versions.node !== 'undefined') {
      isNode = true;
    }
  }
}

// List of routes
const routes = (
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
        <Route path="/greem-and-gltd-opening" component={Release0008_GreemJellyfish_EventFlyer} />
    </div>
);

// // browser side rendering
// if (typeof document != "undefined") {
//     ReactDOM.render(
//         <BrowserRouter history={history}>
//             <div>
//              {routes}
//             </div>
//         </BrowserRouter>,
//         document.getElementById('root')
//     );    
// }

// module.hot.accept();

// server side static site generation

const Html = props =>
  <html>
    <head><title>My Static Site</title></head>
    <body>
      <div id="app">
        {props.children}
      </div>
      <script src="/index.js"></script>
    </body> 
  </html>

export default locals =>
  ReactDOMServer.renderToString(
    <StaticRouter location={locals.path} context={{}}>
      <Html>
        {routes}
      </Html>   
    </StaticRouter>
  )