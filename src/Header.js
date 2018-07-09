import React, { Component } from 'react';
import Logo from './Logo';
import Menu from './Menu';

import './Header.css';

class Header extends Component {
  state = {
    showMenu: false,
  }

  onClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    this.setState({
      showMenu: !this.state.showMenu,
    })
  }

  render() {
    const {showMenu} = this.state;

    return (
      <div className="header">
        <Logo onClick={this.onClick}/>
        {showMenu && <Menu />}
      </div>
    );
  }
}

export default Header;
