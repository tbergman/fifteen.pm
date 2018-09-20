import React, {Component} from 'react';
import Logo from './Logo';
import Info from './Info';

import './Header.css';

class Header extends Component {

  render() {
    return (
      <div className="header">
        <Logo/>
        <Info/>
      </div>
    );
  }
}

export default Header;
