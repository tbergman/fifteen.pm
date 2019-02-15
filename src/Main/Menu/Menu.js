import React, { PureComponent } from "react";
import Modal from "react-modal";
import Purchase from "../Purchase/Purchase";
import Player from "../Player/Player";
import anime from "../../Utils/Anime.min.js";
import { SHAPES } from "./MenuConstants";
import { CONTENT } from "../Content";

import "./Menu.css";
import { isNoUIMode } from "../../Utils/modes";

class Menu extends PureComponent {

  state = {
    content: CONTENT[window.location.pathname],
    currentRel: window.location.pathname,
    showMenu: true,
    hasEnteredWorld: false
  };

  componentDidMount() {
    const { menuOpen } = this.props;
    this.setState({ showMenu: menuOpen });
    this.windowLocation = window.location.pathname;
  }

  toggleModal() {
    this.setState({ showMenu: !this.state.showMenu, hasEnteredWorld: true });
  }

  afterOpenModal() {
    // references are now sync'd and can be accessed.
  }

  closeModal() {
    this.setState({
      showMenu: false,
      hasEnteredWorld: true
    }, () => {

    });
  }

  renderControls = () => {
    const controls = this.state.content.controls.map((c, i) => (
      <div className="control-item" key={i}>
        <div className="control-icon">
          <c.icon fillColor={"#fff"} />
        </div>
        <div className="control-instructions">{c.instructions}</div>
      </div>
    ));
    return <div className="controls">{controls}</div>;
  };

  renderMenuIcon = () => {
    const { menuIconFillColor } = this.props;
    const style = isNoUIMode() ? { display: "none" } : {};
    return (
      <div className="menu-icon" style={style}>
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 100 100"
          onClick={() => this.toggleModal()}
        >
          <g>
            <path
              fill={menuIconFillColor}
              d="M50,100c27.614,0,49.999-22.386,49.999-50C99.999,22.386,77.614,0,50,0C22.386,0,0.001,22.386,0.001,50    C0.001,77.614,22.386,100,50,100z M49.679,15.666c4.596,0,7.721,3.493,7.721,7.998c0,4.781-3.401,8.089-7.721,8.089    c-4.229,0-7.631-3.309-7.631-8.089C42.048,18.976,45.45,15.666,49.679,15.666z M37.544,80.475c5.424,0,5.884-0.827,5.884-7.629    V51.792c0-6.802-0.367-7.262-5.884-7.262v-3.676c5.608-0.369,11.583-1.84,17.927-4.505l1.563,0.827v35.76    c0,6.711,0.551,7.538,5.423,7.538v3.859H37.544V80.475z"
            />
          </g>
        </svg>
      </div>
    );
  };

  renderMenuContent = () => {
    // const { fillColor, loading } = this.props;
    return (
      <div>
        <h2 className="modal-message"> {this.state.content.message} </h2>
        <button className="menu-button" onClick={() => this.closeModal()}>
          {this.state.hasEnteredWorld || this.state.content.home ? "CLOSE" : "ENTER"}
        </button>
        {!this.state.content.home && (
          <div>
            <hr />
            <div>{this.renderControls()}</div>
            <Purchase
              href={this.state.content.purchaseLink}
              fillColor={"#fff"}
            />
          </div>
        )}
      </div>
    );
  };

  renderMenu = () => {
    // const { message } = this.state.content;
    // const { fillColor } = this.props;
    return (
      <Modal
        isOpen={this.state.showMenu}
        appElement={this.appElement}
        onAfterOpen={() => this.afterOpenModal()}
        onRequestClose={() => this.closeModal()}
        shouldCloseOnOverlayClick={true}
        ariaHideApp={false}
        style={{
          overlay: {
            backgroundColor: "rgba(255, 255, 255, 0.00)"
          },
          content: {
            top: "50%",
            left: "50%",
            width: "75%",
            height: "75%",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "rgba(0, 0, 0, 0)",
            border: "none"
          }
        }}
        contentLabel="About"
      >
        <svg className='modal-blob' width="95%" height="95%" viewBox="0 0 1098 724" preserveAspectRatio="none">
          <g fill="rgba(0, 0, 0, 0.5)">
            <path d="M548.5,59.7382812 C470.008113,55.8864258 497.028587,41.5039063 443.035156,41.5039063 C389.041725,41.5039063 343.68701,64.1118961 284.179688,59.7382812 C224.672365,55.3646664 225.719215,35.0568574 167.859375,32.359375 C109.999535,29.6618926 39.4951345,65.7659262 28.4257813,121.070312 C17.356428,176.374699 8.50799008,190.198758 13.1796875,232.328125 C17.8513849,274.457492 43.9397366,261.869184 49.9101563,314.816406 C55.8805759,367.763628 46.0880379,374.82659 34.6171875,422.441406 C23.1463371,470.056222 2.57212237,484.248134 1.30859375,516.558594 C0.045065125,548.869053 54.257922,529.389301 57.5898438,571.183594 C60.9217655,612.977887 -17.401275,625.724459 13.1796875,665.464844 C43.76065,705.205229 56.6332649,714.643204 132.476562,722.128906 C208.31986,729.614609 212.8999,695.871374 303.953125,694.164063 C395.00635,692.456751 424.640876,702.752749 480.554687,700.234375 C536.468499,697.716001 508.240732,681.191406 591.976562,681.191406 C675.712393,681.191406 678.939727,700.234375 736.359375,700.234375 C793.779023,700.234375 791.090876,683.015275 874.972656,681.191406 C958.854436,679.367538 971.439718,704.239349 1021,694.164063 C1070.56028,684.088776 1071.37564,670.634909 1080.28125,633.570313 C1089.18686,596.505716 1081.60726,580.438136 1069.72656,555.277344 C1057.84586,530.116552 1053.59109,550.66426 1048.46875,509.058594 C1043.34641,467.452928 1056.94369,471.455894 1069.72656,422.441406 C1082.50943,373.426919 1100.03309,371.265077 1096.58594,324.558594 C1093.13878,277.852111 1070.17892,278.139004 1055.69531,232.328125 C1041.2117,186.517246 1032.16112,179.964122 1037.97266,139.167969 C1043.78419,98.3718156 1088.49492,95.7984925 1080.28125,59.7382812 C1072.06758,23.67807 1055.80465,15.1224402 1007.30469,4.52734375 C958.80472,-6.06775273 952.166845,7.02171475 891.527344,18.5039063 C830.887843,29.9860978 850.724053,37.3147824 773.40625,48.8164062 C696.088447,60.3180301 653.874587,58.1458124 621.082031,59.7382812 C588.289475,61.3307501 626.991887,63.5901367 548.5,59.7382812 Z"></path>
          </g>
        </svg>
        <div className="modal-content-container">
          {this.renderMenuContent()}
        </div>
      </Modal>

    );
  };

  renderPlayer = () => {
    const { content, menuIconFillColor, audioRef, isPlaying } = this.props;
    const { hasEnteredWorld } = this.state;
    if (this.props.renderPlayer){
      return (
        <Player
          trackList={content.tracks}
          message={content.artist}
          fillColor={menuIconFillColor}
          audioRef={audioRef}
          paused={!hasEnteredWorld}
        />
      );
    }
  }

  render = () => {
    return (
      <div>
        {this.renderMenuIcon()}
        {this.state.showMenu && (
          <div
            ref={appElement => (this.appElement = appElement)}
            className="modal"
          >
            {this.renderMenu()}
          </div>
        )}
        {this.renderPlayer()}
      </div>
    );
  };
}

Menu.defaultProps = {
  menuOpen: true,
  renderPlayer: true,
  loading: true,
  fillColor: "#ffffff",
  menuIconFillColor: "#ffffff"
};
export default Menu;
