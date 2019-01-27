import React, {Component, Fragment} from 'react';
import {CONTENT} from "../../Main/Content";
import Footer from '../../Main/Footer/Footer';
import {assetPath} from "../../Utils/assets";
import Unity, { UnityContent } from "react-unity-webgl";

export const assetPath7UnityBuild = (p) => {
  return assetPath("7/unity/Build/" + p);
}

class Release0007 extends Component {

  unityContent = new UnityContent(
    assetPath7UnityBuild('GLTDJonFayGoldenGrove.json'),
    assetPath7UnityBuild('UnityLoader.js')
  );
 
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
