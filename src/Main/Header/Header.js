import React, {Component} from 'react';
import Logo from './Logo';
import {isNoUIMode} from '../../Utils/modes'

import './Header.css';

class Header extends Component {

  render() {
    const style = isNoUIMode() ? {display: 'none'} : {};
    return (
      <div style={style}>
        <Logo />
      </div>
    );
  }
}

export default Header;
