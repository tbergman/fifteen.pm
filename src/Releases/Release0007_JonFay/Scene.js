import React, { Component, Suspense } from 'react';
import { assetPath } from "../../Utils/assets";
import Unity, { UnityContent } from "react-unity-webgl";


export const assetPath7UnityBuild = (p) => {
  return assetPath("7/unity/Build/" + p);
}

export const assetPath7Images = (p) => {
  return assetPath("7/images/" + p);
}


export default class Scene extends Component {
  state = {
    progression: 0,
    unityControllerOff: false,
    hasEntered: false,
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
      this.unityComponent.adjustCanvasToContainer();
      this.lockMouseLookBeforeEntering();
      setTimeout(() => { this.props.onContentReady(); }, 2000);
    });
  };

  lockMouseLookBeforeEntering() {
    if (!this.state.hasEntered && !this.state.unityControllerOff) {
      this.unityContent.send("ToggleController", "LockMouseLook");
      this.setState({ unityControllerOff: true });
    }
  }

  unlockMouseLook() {
    this.unityContent.send("ToggleController", "UnlockMouseLook");
    this.setState({ unityControllerOff: false });
  }

  componentDidMount() {
    this.setWindowDimensions();
    window.addEventListener('resize', this.onWindowResize, false);
  }

  componentDidUpdate() {
    if (this.state.hasEntered && this.state.unityControllerOff) {
      this.unlockMouseLook();
    }
  }

  setWindowDimensions() {
    this.height = window.innerHeight;
    this.width = window.innerWidth;
  }

  onWindowResize = () => {
    this.setWindowDimensions();
    this.unityComponent.adjustCanvasToContainer()
  }

  renderLoadingGif = () => {
    if (!this.props.contentReady) {
      return (
        <div id={"progress-bar"}>
          <img className="stretch" alt="" src={assetPath7Images("loading.gif")} />
        </div>
      );
    }
  };

  render() {
    return (
      <>
        <div className="unity-content" >
          <Unity unityContent={this.unityContent}
            height={this.height}
            width={this.width}
            ref={component => this.unityComponent = component} />
          {this.renderLoadingGif()}
        </div>
      </>
    );
  }
}