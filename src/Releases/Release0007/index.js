import React, { Component, Fragment } from 'react';
import { CONTENT } from "../../Main/Content";
import Menu from '../../Main/Menu/Menu';
import { assetPath } from "../../Utils/assets";
import Unity, { UnityContent } from "react-unity-webgl";


export const assetPath7UnityBuild = (p) => {
  return assetPath("7/unity/Build/" + p);
}

class Release0007 extends Component {
  state = {
    progression: 0
  }

  constructor(props) {
    super(props)
    this.unityContent = new UnityContent(
      assetPath7UnityBuild('unity.json'),
      assetPath7UnityBuild('UnityLoader.js'), {
        adjustOnWindowResize: true
      }
    );
    this.unityContent.on("progress", progression => {
      this.setState({
        progression: progression
      })
    });

    this.unityContent.on("loaded", () => {
      this.unityComponent.adjustCanvasToContainer()
    });
  };

  componentDidMount() {
    this.setWindowDimensions();
    window.addEventListener('resize', this.onWindowResize, false);
  }

  setWindowDimensions() {
    this.height = window.innerHeight;
    this.width = window.innerWidth;
  }

  onWindowResize = () => {
    this.setWindowDimensions();
    this.unityComponent.adjustCanvasToContainer()
  }

  render() {
    return (
      <Fragment>
        <Menu
          content={CONTENT[window.location.pathname]}
          menuIconFillColor="black"
        />
        <div className="unity-content" >
          <Unity unityContent={this.unityContent}
            height = {this.height}
            width = {this.width}
            ref={component => this.unityComponent = component} />
        </div>
      </Fragment >
    );
  }
}

export default Release0007;
