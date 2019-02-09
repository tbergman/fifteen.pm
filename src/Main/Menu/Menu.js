import React, { PureComponent } from "react";
import Modal from "react-modal";
import Purchase from "../Purchase/Purchase";
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

  constructor(props) {
    super(props);
  }

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
    //
  }

  closeModal() {
    this.setState({ showMenu: false, hasEnteredWorld: true });
  }

  renderControls = () => {
    const controls = this.state.content.controls.map(c => (
      <div className="control-item">
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
    const { fillColor, loading } = this.props;
    return (
      <div>
        <h2 className="modal-message"> {this.state.content.message} </h2>
        <button className="menu-button" onClick={() => this.closeModal()}>
          {this.state.hasEnteredWorld || this.state.content.home  ? "CLOSE" : "ENTER"}
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
    const { message } = this.state.content;
    const { fillColor } = this.props;
    return (
      <Modal
        isOpen={this.state.showMenu}
        appElement={this.appElement}
        onAfterOpen={this.afterOpenModal}
        onRequestClose={this.closeModal}
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
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            border: "none"
          }
        }}
        contentLabel="About"
      >
        {this.renderMenuContent()}
      </Modal>
    );
  };

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
      </div>
    );
  };
}
Menu.defaultProps = {
  menuOpen: true,
  loading: true,
  fillColor: "#ffffff",
  menuIconFillColor: "#ffffff"
};
export default Menu;
