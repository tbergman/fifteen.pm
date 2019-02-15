import React, { PureComponent } from "react";
import Modal from "react-modal";
import Player from "../Player/Player";
import anime from "../../Utils/Anime.min.js";
import { SHAPES } from "./MenuConstants";
import { CONTENT } from "../Content";
import { isNoUIMode } from "../../Utils/modes";
import "./Menu.css";

class Menu extends PureComponent {
  state = {
    home: CONTENT[window.location.pathname].home,
    overlay: CONTENT[window.location.pathname].overlay,
    shapeIndex: Math.floor(Math.random() * SHAPES.length),
    overlayOpen: true,
    hasEnteredWorld: false
  };

  componentDidMount() {
    this.setState({ overlayOpen: this.props.overlayOpen });
    this.animateOverlay();
  }

  toggleOverlay() {
    this.setState({
      overlayOpen: !this.state.overlayOpen,
      hasEnteredWorld: true
    });
    this.animateOverlay();
  }

  afterOpenOverlay() {
    this.animateOverlay();
  }

  closeOverlay() {
    this.setState({ overlayOpen: false, hasEnteredWorld: true });
  }

  animateOverlay() {
    const shape = SHAPES[this.state.shapeIndex];
    anime({
      targets: this.path,
      easing: shape.easing,
      elasticity: shape.elasticity || 0,
      d: [
        { value: shape.pathAlt, duration: shape.duration },
        { value: shape.path, duration: shape.duration }
      ],
      loop: true,
      direction: "alternate"
    });
  }

  renderMenuIcon = () => {
    const style = isNoUIMode() ? { display: "none" } : {};
    return (
      <div className="overlay-icon" style={style}>
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 100 100"
          onClick={this.toggleOverlay.bind(this)}
        >
          <g>
            <path
              fill={this.state.overlay.iconColor}
              d="M50,100c27.614,0,49.999-22.386,49.999-50C99.999,22.386,77.614,0,50,0C22.386,0,0.001,22.386,0.001,50    C0.001,77.614,22.386,100,50,100z M49.679,15.666c4.596,0,7.721,3.493,7.721,7.998c0,4.781-3.401,8.089-7.721,8.089    c-4.229,0-7.631-3.309-7.631-8.089C42.048,18.976,45.45,15.666,49.679,15.666z M37.544,80.475c5.424,0,5.884-0.827,5.884-7.629    V51.792c0-6.802-0.367-7.262-5.884-7.262v-3.676c5.608-0.369,11.583-1.84,17.927-4.505l1.563,0.827v35.76    c0,6.711,0.551,7.538,5.423,7.538v3.859H37.544V80.475z"
            />
          </g>
        </svg>
      </div>
    );
  };

  renderControls = () => {
    const controls = this.state.overlay.controls.map(c => (
      <div className="control-item">
        <div className="control-icon">
          <c.icon fillColor={this.state.overlay.textColor} />
        </div>
        <div
          className="control-instructions"
          style={{ color: this.state.overlay.textColor }}
        >
          {c.instructions}
        </div>
      </div>
    ));
    return <div className="controls">{controls}</div>;
  };

  renderPurchaseLink = () => {
    return (
      <div className="purchase-container">
        <div className="purchase-link">
          <a
            className="purchase-icon-link"
            style={{ color: this.state.overlay.textColor }}
            href={this.state.overlay.purchaseLink}
            target="_blank"
          >
            ☻
          </a>
          <br />
          <a
            className=""
            style={{ color: this.state.overlay.textColor }}
            href={this.state.overlay.purchaseLink}
            href={this.state.overlay.purchaseLink}
            target="_blank"
          >
            BUY ME
          </a>
        </div>
      </div>
    );
  };

  renderEnterButton = () => {
    return (
      <div className="enter-container" onClick={this.toggleOverlay.bind(this)}>
        <div className="enter-link">
          <span
            className="enter-icon-link"
            style={{ color: this.state.overlay.textColor }}
          >
            ☻
          </span>
          <br />
          <span>ENTER</span>
        </div>
      </div>
    );
  };

  renderOverlayContent = () => {
    return (
      <div>
        <div
          className="overlay-message"
          style={{ "text-color": this.state.overlay.textColor }}
        >
          {this.state.overlay.message}
        </div>
        <div>
          {!this.state.home && ( <div>{this.renderControls()}</div>)}
          <div>{this.renderEnterButton()}</div>
          {!this.state.home && ( <div>{this.renderPurchaseLink()}</div>)}
        </div>
      </div>
    );
  };

  renderOverlay = () => {
    // const { message } = this.state.content;
    // const { fillColor } = this.props;
    return (
      <Modal
        isOpen={this.state.overlayOpen}
        appElement={this.appElement}
        onAfterOpen={this.afterOpenOverlay.bind(this)}
        onRequestClose={this.closeOverlay.bind(this)}
        shouldCloseOnOverlayClick={true}
        ariaHideApp={false}
        style={{
          overlay: {
            background: "transparent"
          },
          content: {
            top: "50%",
            left: "50%",
            width: "80%",
            height: "80%",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
            background: "transparent",
            border: "none",
            overflow: "hidden"
          }
        }}
        contentLabel="overlay"
      >
      <div>
        <div className="overlay-blob">
          <svg
            ref={element => (this.svg = element)}
            width="100%"
            height="100%"
            viewBox="0 0 1098 724"
            preserveAspectRatio="none"
          >
            <g fill={this.state.overlay.fillColor}>
              <path
                ref={element => (this.path = element)}
                d={SHAPES[this.state.shapeIndex].path}
              />
            </g>
          </svg>
        </div>
        <div className="overlay-content-container">
          {this.renderOverlayContent()}
        </div>
      </div>
      </Modal>
    );
  };

  renderPlayer = () => {
    const { content, menuIconFillColor, audioRef, isPlaying } = this.props;
    const { hasEnteredWorld } = this.state;
    if (this.props.renderPlayer) {
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
  };

  render = () => {
    return (
      <div>
        {this.renderMenuIcon()}
        {this.state.overlayOpen && (
          <div
            ref={appElement => (this.appElement = appElement)}
            className="overlay"
          >
            {this.renderOverlay()}
          </div>
        )}
        {this.renderPlayer()}
      </div>
    );
  };
}

Menu.defaultProps = {
  overlayOpen: true,
  renderPlayer: true,
  loading: true,
  fillColor: "#ffffff",
  menuIconFillColor: "#ffffff"
};
export default Menu;
