import React, { PureComponent, Fragment } from "react";
import Modal from "react-modal";
import Player from "../Player/Player";
import Navigation from "../Navigation/Navigation";
import anime from "animejs";
import { SHAPES, MENU_ICON_OPEN } from "./MenuConstants";
import { CONTENT } from "../../Content";
import { isNoUIMode } from "../../Utils/modes";
import "./Menu.css";
import { PurchaseLink } from "../Controls/Icons";

class Menu extends PureComponent {
  state = {
    home: CONTENT[window.location.pathname].home,
    theme: CONTENT[window.location.pathname].theme,
    shapeIndex: Math.floor(Math.random() * SHAPES.length),
    overlayOpen: true,
    hasEnteredWorld: false
  };

  static defaultProps = {
    overlayOpen: true,
    renderPlayer: true,
    loading: false
  };

  componentDidMount() {
    this.setState({ overlayOpen: this.props.overlayOpen });
  }

  toggleOverlay = e => {
    e.preventDefault();
    if (this.props.loading) {
      return;
    }
    this.setState({
      overlayOpen: !this.state.overlayOpen,
      hasEnteredWorld: true
    });
    // this prop can be used as a callback from a parent component
    if (this.props.didEnterWorld) {
      this.props.didEnterWorld();
    }
  };

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

  renderInfoIcon = () => {
    const icon = (
      <svg width="100%" height="100%" viewBox="0 0 111 100">
        <g fill={this.state.theme.iconColor}>
          <path ref={el => (this.iconPath = el)} d={MENU_ICON_OPEN} />
        </g>
      </svg>
    );
    let style = {
      display: isNoUIMode() ? "none" : {},
      marginBottom: "20px",
      marginLeft: "20px"
    };
    if (!this.state.home) {
      style = {
        marginLeft: this.props.content.tracks.length > 1 ? "0px" : "-40px",
        display: isNoUIMode() ? "none" : {}
      };
    }
    return (
      <div
        className="overlay-icon"
        onClick={this.toggleOverlay.bind(this)}
        style={style}
      >
        {icon}
      </div>
    );
  };

  renderControlInfo = () => {
    const controls = this.state.theme.controls.map((c, i) => (
      // if !alwaysShow key add hideInMobile
      <div className={c.alwaysShow !== undefined ? "overlay-content-item" : "overlay-content-item hide-in-mobile"} key={i}>
        <div className="overlay-content-icon">
          <c.icon fillColor={this.state.theme.textColor} />
        </div>
        <div
          className="overlay-content-item-text"
          style={{ color: this.state.theme.textColor }}
        >
          {c.instructions}
        </div>
      </div>
    ));
    return <div className="overlay-controls">{controls}</div>;
  };

  renderPurchaseLink() {
    return (
      <div className="overlay-content-item">
        <div className="overlay-content-icon">
          <a
            target="_blank"
            className="purchase-link"
            href={this.state.theme.purchaseLink}
          >
            <PurchaseLink fillColor={this.state.theme.textColor} />
          </a>
        </div>
        <div className="overlay-content-item-text">
          <a
            className="purchase-link"
            target="_blank"
            href={this.state.theme.purchaseLink}
            style={{
              color: this.state.theme.textColor    
            }}
          >buy me
        </a>
        </div>
      </div>
    );
  }

  renderEnterButton() {
    const { home, hasEnteredWorld } = this.state;
    let message = "ENTER";
    if (home || hasEnteredWorld) {
      message = "CLOSE"
    } else if (this.props.loading) {
      message = "LOADING..."
    }
    return (
      <div className="enter-container">
        <button
          type="button"
          style={{ color: this.state.theme.textColor }}
          onClick={this.toggleOverlay.bind(this)}
        >
          {/* Show 'ENTER' for releases on load.
              Show 'CLOSE' for releases on additional modal opens 
              Show 'CLOSE' for home page */}
          {message}
        </button>
      </div>
    );
  }

  /**
   *  Renders content inside react modal
   *    - description of artists
   *    - instructions
   *    - action button
   */
  renderOverlayContent() {
    const {
      home,
      theme: { textColor, message }
    } = this.state;
    return (
      <div className="overlay-content">
        <div className="overlay-header" style={{ textColor: textColor }}>
          <div className="overlay-header-message">{message}</div>
        </div>
        <Fragment>
          {!home && this.renderControlInfo()}
          {!home && this.renderPurchaseLink()}
          {this.renderEnterButton()}
        </Fragment>
      </div>
    );
  }

  /**
   *  Renders svg modal background (animated blob)
   */
  renderOverlaySvg() {
    return (<div className="overlay-svg">
      <svg
        ref={element => (this.svg = element)}
        viewBox="0 0 1098 724"
      >
        <g fill={this.state.theme.fillColor}>
          <path
            ref={element => (this.path = element)}
            d={SHAPES[this.state.shapeIndex].path}
          />
        </g>
      </svg>
    </div>);
  }

  /**
   * Renders react modal https://github.com/reactjs/react-modal
   *  with children: content and svg
   *
   */
  renderOverlay = () => {
    return (
      <Modal
        isOpen={this.state.overlayOpen}
        appElement={this.appElement}
        onAfterOpen={this.afterOpenOverlay.bind(this)}
        onRequestClose={this.closeOverlay.bind(this)}
        shouldCloseOnOverlayClick={true}
        ariaHideApp={false}
        className="overlay-modal"
        style={{
          overlay: { backgroundColor: "transparent" } // for the built-in react-modal overlay style
        }}
      >
        <Fragment>
          {this.renderOverlayContent()}
          {this.renderOverlaySvg()}
        </Fragment>
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
          fillColor={content.theme.iconColor}
          audioRef={audioRef}
          initialized={hasEnteredWorld}
        />
      );
    }
  };

  renderNavigation = () => (
    <Navigation
      fillColor={this.state.theme.navColor}
    />
  );

  renderFooter = () => {
    return (<div className="footer" id={this.state.hasEnteredWorld || this.state.home ? 'display' : 'hidden'}>
      {this.renderPlayer()}
      {this.renderInfoIcon()}
    </div>);
  }

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
        <div className="navigation">
          {this.renderNavigation()}
        </div>
        {this.renderFooter()}
      </div>
    );
  };
}

export default Menu;