import "babel-polyfill";
import React from "react";
import ReactDOM from "react-dom";
import { Router, Route } from "react-router-dom";
import "./index.css";
import App from "./App";
import Header from "./Common/UI/Header";
import history from "./history";
import Release0001_Yahceph from "./Releases/Release0001_Yahceph/index";
import Release0002_YearUnknown from "./Releases/Release0002_YearUnknown/index";
import Release0003_Othere from "./Releases/Release0003_Othere/index";
import Release0004_JonCannon from "./Releases/Release0004_JonCannon/index";
import Release0005_Plebeian from "./Releases/Release0005_Plebeian/index";
import Release0006_Vveiss from "./Releases/Release0006_Vveiss/index";
import Release0007_JonFay from "./Releases/Release0007_JonFay/index";
import Release0008_GreemJellyfish from "./Releases/Release0008_GreemJellyfish/index";
import Release0009_Javonntte from "./Releases/Release0009_Javonntte/index";
import Release0010_AlienD from "./Releases/Release0010_AlienD/index";
import Release0011_JWords from "./Releases/Release0011_JWords/index";
import { CONTENT } from "./Content";

ReactDOM.render(
  <Router history={history}>
    <div style={{ width: "100%", height: "100%" }}>
      <Header content={CONTENT} />
      <Route exact path="/" component={App} />
      <Route path="/1" component={Release0001_Yahceph} />
      <Route path="/2" component={Release0002_YearUnknown} />
      <Route path="/3" component={Release0003_Othere} />
      <Route path="/4" component={Release0004_JonCannon} />
      <Route path="/5" component={Release0005_Plebeian} />
      <Route path="/6" component={Release0006_Vveiss} />
      <Route path="/7" component={Release0007_JonFay} />
      <Route path="/8" component={Release0008_GreemJellyfish} />
      <Route path="/9" component={Release0009_Javonntte} />
      <Route path="/10" component={Release0010_AlienD} />
      <Route path="/11" component={Release0011_JWords} />
    </div>
  </Router>,
  document.getElementById("root")
);
module.hot.accept();
