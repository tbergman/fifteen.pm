import React, {PureComponent} from 'react';
import anime from '../../Utils/Anime.min.js';
import {SHAPES} from './MenuConstants';
import {CONTENT} from '../Content'
import { isNoUIMode } from "../../Utils/modes";
import './Menu.css';

class Menu extends PureComponent {


  state = {
    shapeIndex: Math.floor(Math.random() * SHAPES.length),
    message: CONTENT[window.location.pathname].message,
    currentRel: window.location.pathname,
    showMenu: false,
    fillColor: window.location.pathname === '/3' ? 'red' : '#ffffff' // TODO centralize this lookup (See Logo.js)
  }

  constructor(props) {
    super(props)
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
      message: CONTENT[rel].message,
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
      message: CONTENT[this.windowLocation],
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

  renderMenuIcon = () => {
    const { menuIconFillColor } = this.props;
    const style = isNoUIMode() ? { display: "none" } : {};
    return (
      <div className="menu-icon" style={style}>
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 100 100"
          onClick={(event) => this.onMenuIconClick(event)}
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

Menu.defaultProps = {
  menuIconFillColor: "#ffffff"
}


export default Menu;