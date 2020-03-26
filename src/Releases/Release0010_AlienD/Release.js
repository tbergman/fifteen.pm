import React, { useEffect, useState, Component} from "react";
import { CONTENT } from "../../Content";
import UI from "../../Common/UI/UI";
import AlienDCanvas from "./Canvas";
import { renderScene } from './sceneJV';


export default class Release extends Component {

  componentDidMount = () => {
    this.content = 
    console.log(this.container)
    this.container && renderScene(this.container);
  }

  render = () => (
      <>
        <UI content={CONTENT[window.location.pathname]} />
        <div ref={element => this.container = element}/> */}
      </>
    );
};