import React, {PureComponent} from "react";
import './Purchase.css'

class Purchase extends PureComponent {
  static defaultProps = {
    fillColor: '#ffffff',
  }

  componentDidMount() {
    this.windowLocation = window.location.pathname;
  }

  render() {
    const {fillColor, href} = this.props;
    return (
      <div className="purchase-container">
        <a id="purchase-icon-link"
           className="purchase-link"
           target="_blank"
           href={href}
           style={{color: fillColor}}
        >
          ☻
        </a>
        <a id="purchase-text-link"
           className="purchase-link"
           target="_blank"
           href={href}
           style={{color: fillColor}}
        >
          buy me
        </a>
      </div>
    )
  }
}

export default Purchase;
