import React, { Fragment, Component } from "react";
import { CONTENT } from "../../Content";
import "./Navigation.css";

class LegacyNavigation extends Component {
  state = {
    currentLocation: window.location.pathname,
    currentIndex: parseInt(window.location.pathname.replace("/", "")),
  };

  static defaultProps = {
    fillColor: "#ffffff"
  };

  isHome = () => {
    return this.state.currentLocation === "/";
  };

  getPrevReleasePath = () => {
    const {currentIndex} = this.state;
    const {totalReleases} = this.props;
    let prevRelease;
    if (this.isHome()) {
      prevRelease = "/" + totalReleases.toString();
    } else if (currentIndex == 1) {
      prevRelease = "/";
    } else {
      prevRelease = "/" + (currentIndex - 1).toString();
    }
    return prevRelease;
  };

  renderPrevArrow = () => (
    <div className="arrow arrow-prev">
      <svg
        viewBox="0 0 25 25"
        width="100%"
        height="100%"
        onClick={() => this.setLocation(this.getPrevReleasePath())}
      >
        <g className="arrow-path" fill={this.props.fillColor}>
          <path d="M14.41,16l5.3-5.29a1,1,0,0,0-1.42-1.42l-6,6a1,1,0,0,0,0,1.42l6,6a1,1,0,0,0,1.42,0,1,1,0,0,0,0-1.42Z" />
        </g>
      </svg>
    </div>
  );

  getNextReleasePath = () => {
    const {currentIndex} = this.state;
    const {totalReleases} = this.props;
    let nextRelease;
    if (currentIndex == totalReleases) {
      nextRelease = "/";
    } else if (this.isHome()) {
      nextRelease = "/1";
    } else {
      nextRelease = "/" + (currentIndex + 1).toString();
    }
    return nextRelease;
  };

  renderNextArrow = () => (
    <div className="arrow arrow-next">
      <svg
        viewBox="0 0 25 25"
        width="100%"
        height="100%"
        onClick={() => this.setLocation(this.getNextReleasePath())}
      >
        <g className="arrow-path" fill={this.props.fillColor}>
          <path d="M19.71,15.29l-6-6a1,1,0,0,0-1.42,1.42L17.59,16l-5.3,5.29a1,1,0,0,0,0,1.42,1,1,0,0,0,1.42,0l6-6A1,1,0,0,0,19.71,15.29Z" />
        </g>
      </svg>
    </div>
  );

  setLocation = path => {
    window.location.pathname = path;
  };

  render() {
    return (
      <Fragment>
        {this.renderPrevArrow()}
        {this.renderNextArrow()}
      </Fragment>
    );
  }
}

export default LegacyNavigation;
