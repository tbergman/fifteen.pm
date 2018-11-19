import React, {Component} from 'react';
import Logo from './Logo';
import Menu from '../Menu/Menu';
import {isNoUIMode} from '../../Utils/modes'

import './Header.css';

class Header extends Component {

  render() {
    const style = isNoUIMode() ? {display: 'none'} : {};
    return (
      <div style={style}>
        <Logo />
        <Menu />
      </div>
    );
  }
}

export default Header;
