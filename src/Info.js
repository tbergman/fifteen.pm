import React, {Component} from 'react';
import pure from 'recompose/pure';
import Menu from './Menu';

class Info extends Component {
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
      <div className="info-wrapper"
           onClick={this.onClick}>
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
          <g fill="#61DAFB">
            <path id="circle" fill="#FFFFFF"
                  d="m12 2.085c-5.477 0-9.915 4.438-9.915 9.916 0 5.48 4.438 9.92 9.916 9.92 5.48 0 9.92-4.44 9.92-9.913 0-5.477-4.44-9.915-9.913-9.915zm.002 18a8.084 8.084 0 1 1 0 -16.17 8.084 8.084 0 0 1 0 16.17z"/>
            <path id="info" fill="#FFFFFF"
                  d="m11 6.16v2.01h2.02v-2.01zm-1.61 3.22v2.01h1.61v4.43h-1.61v2.01h5.23v-2.01h-1.61v-6.44z"/>
          </g>
        </svg>
        {showMenu && <Menu />}
      </div>
    );
  }
}

export default pure(Info);
