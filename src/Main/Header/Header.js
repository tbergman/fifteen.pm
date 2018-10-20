import React, {Component} from 'react';
import Logo from './Logo';
import Menu from '../Menu/Menu';

import './Header.css';

class Header extends Component {

  render() {
    return (
      <div>
        <Logo/>
        <Menu />
      </div>
    );
  }
}

export default Header;
