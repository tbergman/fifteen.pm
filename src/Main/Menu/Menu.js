// BRIAN
import React, { PureComponent, Fragment } from "react";
import Modal from "react-modal";
import Player from "../Player/Player";
import anime from "../../Utils/Anime.min.js";
import { SHAPES, MENU_ICON_CLOSE, MENU_ICON_OPEN } from "./MenuConstants";
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

  static defaultProps = {
    overlayOpen: true,
    renderPlayer: true,
    loading: true
  };

  componentDidMount() {
    this.setState({ overlayOpen: this.props.overlayOpen });
  }

  toggleOverlay = (e) => {
    e.preventDefault();
    this.setState({
      overlayOpen: !this.state.overlayOpen,
      hasEnteredWorld: true
    });
    // this.animateMenuIcon();
    // this prop can be used as a callback from a parent component
    if (this.props.didEnterWorld) {
      this.props.didEnterWorld();
    }
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

  animateMenuIcon() {
    // let toIcon = this.state.overlayOpen ? MENU_ICON_OPEN : MENU_ICON_CLOSE;
    // anime({
    //   targets: this.iconPath,
    //   easing: "linear",
    //   d: [{ value: toIcon, duration: 300 }],
    //   loop: false
    // });
  }

  renderInfoIcon = () => {
    const icon = (
      <svg width="100%" height="100%" viewBox="0 0 100 100">
        <g fill={this.state.overlay.iconColor}>
          <path
            ref={el => (this.iconPath = el)}
            d={MENU_ICON_OPEN}
          />
        </g>
      </svg>
    );
    return (
      <div
        className="overlay-icon"
        onClick={this.toggleOverlay.bind(this)}
        style={isNoUIMode() ? { display: "none" } : {}}
      >
        {icon}
      </div>
    );
  };

  renderControls = () => {
    const controls = this.state.overlay.controls.map((c, i) => (
      <div className="control-item" key={i}>
        <div className="control-icon">
          <c.icon fillColor={this.state.overlay.textColor} />
        </div>
        <div
          className="control-instructions overlay-text"
          style={{ color: this.state.overlay.textColor }}
        >
          {c.instructions}
        </div>
      </div>
    ));
    return <div className="overlay-controls">{controls}</div>;
  };

  renderPurchaseLink() {
    return (
      <div className="purchase-container">
        <a
          className="purchase-icon-link purchase-link overlay-text"
          target="_blank"
          href={this.state.overlay.purchaseLink}
          style={{ color: this.state.overlay.textColor }}
        >
          &#x32E1;
        </a>
        <a
          id="purchase-text-link"
          className="purchase-link overlay-text"
          target="_blank"
          href={this.state.overlay.purchaseLink}
          style={{ color: this.state.overlay.textColor }}
        >
          BUY ME
        </a>
      </div>
    );
  };

  renderEnterButton() {
    return (
      <div className="enter-container">
        <button
          type="button"
          style={{ "color": this.state.overlay.textColor }}
          onClick={this.toggleOverlay.bind(this)}>
          ENTER
        </button>
      </div>
    );
  };

  renderOverlayContent() {
    const { home, overlay: { textColor, message } } = this.state;

    return (
      <div className="overlay">
        <div className="overlay-header" style={{ "textColor": textColor }}>
          <div className="overlay-header-message">{message}</div>
        </div>
        {!home && (
          <Fragment>
            {this.renderControls()}
            {this.renderPurchaseLink()}
            {this.renderEnterButton()}
          </Fragment>
        )}
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
        className="overlay"
        overlayClassName="overlay-blob"
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
          {this.renderOverlayContent()}
        </div>
      </Modal>
    );
  };

  renderPlayer = () => {
    const { content, audioRef } = this.props;
    const { hasEnteredWorld } = this.state;
    if (this.props.renderPlayer) {
      return (
        <Player
          trackList={content.tracks}
          message={content.artist}
          fillColor={content.overlay.iconColor}
          audioRef={audioRef}
          paused={!hasEnteredWorld}
        />
      );
    }
  };

  render = () => {
    return (
      <div>

        {this.state.overlayOpen && (
          <div
            ref={appElement => (this.appElement = appElement)}
            className="modal"
          >
            {this.renderOverlay()}
          </div>
        )}
        <div className="footer">
          {this.renderPlayer()}
          {this.renderInfoIcon()}
        </div>
      </div>
    );
  };
}

export default Menu;