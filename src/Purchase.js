import React, {PureComponent} from "react";
import {PURCHASE_BANDCAMP} from "./Utils/PurchaseConstants";
import './Purchase.css'

class Purchase extends PureComponent {

  state = {
    bandcampLink: PURCHASE_BANDCAMP[window.location.pathname]
  }

  componentDidMount() {
    this.windowLocation = window.location.pathname;
  }

  render() {
    return (
      <div className="purchase-container">
        <a id="purchase-icon-link"
           className="purchase-link"
           target="_blank"
           href={this.state.bandcampLink}>
          ☻
        </a>
        <a id="purchase-text-link"
           className="purchase-link"
           target="_blank"
           href={this.state.bandcampLink}>
          buy me
        </a>
      </div>
    )
  }
}

export default Purchase;
