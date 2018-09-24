import React, {PureComponent} from 'react';
import anime from './Utils/Anime.min.js';
import {SHAPES, MENU_CONTENT} from './Utils/MenuConstants';
import './Menu.css';

class Menu extends PureComponent {
  state = {
    shapeIndex: Math.floor(Math.random() * 4),
    message: MENU_CONTENT[window.location.pathname].message,
    currentRel: window.location.pathname,
    showMenu: false,
    fillColor: window.location.pathname === '/3' ? 'red' : '#ffffff' // TODO centralize this lookup (See Logo.js)
  }

  componentDidMount() {
    this.windowLocation = window.location.pathname;
  }

  onMenuIconClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.setState({
      showMenu: !this.state.showMenu,
    }, () => this.animateMenu());
  }

  handleLinkMouseOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const {idx, rel} = e.target.dataset;
    this.setState({
      shapeIndex: idx,
      message: MENU_CONTENT[rel].message,
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
      message: MENU_CONTENT[this.windowLocation],
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
          <li>{this.state.message}</li>
        </ul>
      </div>
    );
  }

  renderMenuIcon() {
    const {fillColor} = this.state;
    return (
      <div className="menu-icon" onClick={this.onMenuIconClick}>
        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" x="0px" y="0px" viewBox="0 0 100 100"
             enableBackground="new 0 0 100 100">
          <g>
            <g>
              <path fillRule="evenodd" clipRule="evenodd" fill={fillColor}
                    d="M6.407,19.206h87.221c0.777,0,1.407,0.63,1.407,1.407v2.814    c0,0.777-0.63,1.407-1.407,1.407H6.407C5.63,24.833,5,24.203,5,23.426v-2.814C5,19.836,5.63,19.206,6.407,19.206z"/>
            </g>
            <g>
              <path fillRule="evenodd" clipRule="evenodd" fill={fillColor}
                    d="M6.407,47.341h87.221c0.777,0,1.407,0.63,1.407,1.407v2.814    c0,0.777-0.63,1.407-1.407,1.407H6.407C5.63,52.969,5,52.339,5,51.562v-2.814C5,47.971,5.63,47.341,6.407,47.341z"/>
            </g>
            <g>
              <path fillRule="evenodd" clipRule="evenodd" fill={fillColor}
                    d="M6.407,75.477h87.221c0.777,0,1.407,0.63,1.407,1.407v2.814    c0,0.777-0.63,1.407-1.407,1.407H6.407C5.63,81.105,5,80.475,5,79.698v-2.814C5,76.107,5.63,75.477,6.407,75.477z"/>
            </g>
          </g>
        </svg>
      </div>
    )
  }

  render() {
    return (
      <div>
        {this.renderMenuIcon()}
        {this.state.showMenu && (
          <div className="menu">
            {this.renderMenu()}
            <div className="links-wrapper">
              {this.renderLinks()}
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default Menu;
