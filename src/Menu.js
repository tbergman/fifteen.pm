import React, {PureComponent} from 'react';
import anime from './Utils/Anime.min.js';
import {SHAPES, RELEASE_LINKS, MENU_MESSAGES} from './Utils/MenuConstants';
import './Menu.css';

class Menu extends PureComponent {
  state = {
    shapeIndex: 3,
    message: MENU_MESSAGES[window.location.pathname],
    currentRel: window.location.pathname
  }

  componentDidMount() {
    this.windowLocation = window.location.pathname;
    this.animateMenu();
  }

  handleLinkMouseOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const {idx, rel} = e.target.dataset;
    this.setState({
      shapeIndex: idx,
      message: MENU_MESSAGES[rel],
      currentRel: rel
    }, () => {
      this.animateMenu();
    });
  }

  renderMessage = () => {
    const {message} = this.state.message;
    return (
      <div className="message">
        {message}
      </div>
    )
  }

  handleLinkClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.setState({
      message: MENU_MESSAGES[this.windowLocation],
    });
    window.location = e.target.dataset.to;
  }

  animateMenu() {
    const {shapeIndex} = this.state;

    anime({
      targets: this.svg,
      duration: SHAPES[shapeIndex].animation.svg.duration,
      easing: SHAPES[shapeIndex].animation.svg.easing,
      elasticity: SHAPES[shapeIndex].animation.svg.elasticity || 0,
      scaleX: SHAPES[shapeIndex].scaleX,
      scaleY: SHAPES[shapeIndex].scaleY,
      translateX: SHAPES[shapeIndex].tx + 'px',
      translateY: SHAPES[shapeIndex].ty + 'px',
      rotate: SHAPES[shapeIndex].rotate + 'deg'
    });

    anime({
      targets: this.path,
      easing: 'linear',
      d: [{value: SHAPES[shapeIndex].pathAlt, duration: 3000}, {value: SHAPES[shapeIndex].path, duration: 3000}],
      loop: true,
      fill: {
        value: SHAPES[shapeIndex].fill.color,
        duration: SHAPES[shapeIndex].fill.duration,
        easing: SHAPES[shapeIndex].fill.easing
      },
      direction: 'alternate'
    });
  }

  renderMenu() {
    const {shapeIndex} = this.state;

    return (
      <main>
        <div className="morph-wrap">
          <svg ref={element => this.svg = element} className="morph" width="1400" height="770" viewBox="0 0 1400 770">
            <path ref={element => this.path = element} d={SHAPES[shapeIndex].path}/>
          </svg>
        </div>
      </main>
    );
  }

  renderLinks() {
    return (
      <div className="links">
        <ul>
          {RELEASE_LINKS.map((link, idx) =>
            <li
              className={ this.windowLocation === link.relPath ? 'active' : ''}
              key={idx}
              data-idx={idx + 1}
              data-to={link.path}
              data-rel={link.relPath}
              onMouseOver={this.handleLinkMouseOver}
              onClick={this.handleLinkClick}>
              {link.name}
            </li>
          )}
          <li>{this.state.message}</li>
        </ul>
      </div>
    );
  }

  render() {
    return (
      <div className="menu">
        {this.renderMenu()}
        <div className="links-wrapper">
          {this.renderLinks()}
        </div>
      </div>
    );
  }
}

export default Menu;
