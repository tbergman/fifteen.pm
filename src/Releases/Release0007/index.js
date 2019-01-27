import React, {Component, Fragment} from 'react';
import {CONTENT} from "../../Main/Content";
import Footer from '../../Main/Footer/Footer';
import {assetPath} from "../../Utils/assets";
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
      assetPath7UnityBuild('GLTDJonFayGoldenGrove.json'),
      assetPath7UnityBuild('UnityLoader.js')
    );

    this.unityContent.on("progress", progression => {
      this.setState({
        progression: progression
      })
    });
  };

  render() {
    return (
      <Fragment>
        <Unity unityContent={this.unityContent} />;
        <Footer
          content={CONTENT[window.location.pathname]}
          fillColor="black"
          audioRef={el => this.audioElement = el}
        />
      </Fragment>
    );
  }
}

export default Release0007;
