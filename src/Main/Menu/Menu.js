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

  toggleOverlay(e) {
    e.preventDefault();
    this.setState({
      overlayOpen: !this.state.overlayOpen,
      hasEnteredWorld: true
    });
    this.animateMenuIcon();
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
    const shape = SHAPES[this.state.shapeIndex];
    let fromIcon, toIcon;
    if (this.state.overlayOpen) {
      fromIcon = MENU_ICON_CLOSE;
      toIcon = MENU_ICON_OPEN;
    } else {
      fromIcon = MENU_ICON_OPEN;
      toIcon = MENU_ICON_CLOSE;
    }
    anime({
      targets: this.iconPath,
      easing: "linear",
      d: [{ value: toIcon, duration: 300 }],
      loop: false
    });
  }

  renderMenuIcon = () => {
    const icon = (
      <svg width="100%" height="100%" viewBox="0 0 100 100">
        <g fill={this.state.overlay.iconColor}>
          <path
            ref={el => (this.iconPath = el)}
            d={this.state.overlayOpen ? MENU_ICON_CLOSE : MENU_ICON_OPEN}
          />
        </g>
      </svg>
    );
    let iconClassName = "overlay-icon";
    if (this.state.overlayOpen) {
      iconClassName = iconClassName + " overlay-icon-open";
    }
    return (
      <div
        className={iconClassName}
        onClick={this.toggleOverlay.bind(this)}
        style={isNoUIMode() ? { display: "none" } : {}}
      >
        {icon}
      </div>
    );
  };

  renderControls = () => {
    const controls = this.state.overlay.controls.map(c => (
      <div className="overlay-control-item">
        <div className="overlay-control-icon">
          <c.icon fillColor={this.state.overlay.textColor} />
        </div>
        <div
          className="overlay-control-instructions"
          style={{ color: this.state.overlay.textColor }}
        >
          {c.instructions}
        </div>
      </div>
    ));
    return <div className="overlay-controls-container ">{controls}</div>;
  };

  renderButton = () => {
    let buttonText, buttonIcon;
    if (this.state.home || !this.state.hasEnteredWorld) {
      buttonIcon = <span onClick={this.toggleOverlay.bind(this)}>☻</span>;
      buttonText = (
        <span onClick={this.toggleOverlay.bind(this)}>
          {this.state.home ? "ENTER" : "START"}
        </span>
      );
    } else {
      buttonIcon = (
        <a
          style={{ color: this.state.overlay.textColor }}
          href={this.state.overlay.purchaseLink}
          target="_blank"
        >
          ☻
        </a>
      );
      buttonText = (
        <a
          style={{ color: this.state.overlay.textColor }}
          href={this.state.overlay.purchaseLink}
          target="_blank"
        >
        BUY
        </a>
      );
    }
    return (
      <div className="overlay-button-container">
        <div
          className="overlay-button"
          style={{ color: this.state.overlay.textColor }}
        >
          <div className="overlay-button-icon">{buttonIcon}</div>
          <br />
          <span className="overlay-button-text">{buttonText}</span>
        </div>
      </div>
    );
  };

  renderOverlayContent = () => {
    return (
      <Fragment>
        <div className="overlay-message-container">
          <div
            className="overlay-message"
            style={{ color: this.state.overlay.textColor }}
          >
            <span className="overlay-message-text">
              {this.state.overlay.message}
            </span>
          </div>
        </div>
        {!this.state.home && this.renderControls()}
        {this.renderButton()}
      </Fragment>
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
              top: "45%",
              left: "50%",
              width: "100%",
              height: "100%",
              marginRight: "-50%",
              transform: "translate(-50%, -50%)",
              background: "transparent",
              border: "none",
              overflow: "visible"
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
            <div className='overlay-content'> {this.renderOverlayContent()}</div>
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

export default Menu;
