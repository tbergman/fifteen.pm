import React, {PureComponent} from "react";
import {PURCHASE_BANDCAMP} from "./Utils/PurchaseConstants";
import './Purchase.css'

class Purchase extends PureComponent {
  static defaultProps = {
    fillColor: '#ffffff',
  }

  state = {
    bandcampLink: PURCHASE_BANDCAMP[window.location.pathname]
  }

  componentDidMount() {
    this.windowLocation = window.location.pathname;
  }

  render() {
    const {fillColor} = this.props;
    return (
      <div className="purchase-container">
        <a id="purchase-icon-link"
           className="purchase-link"
           target="_blank"
           href={this.state.bandcampLink}
           style={{color: fillColor}}
        >
          ☻
        </a>
        <a id="purchase-text-link"
           className="purchase-link"
           target="_blank"
           href={this.state.bandcampLink}
           style={{color: fillColor}}
        >
          buy me
        </a>
      </div>
    )
  }
}

export default Purchase;
