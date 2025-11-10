import React, { Component } from 'react';

class PageBanner extends Component {
  render() {
    return (
      <div className="header__container">
        <div className="header__block">
          <h2>{this.props.title}</h2>
          <p>{this.props.subtitle}</p>
          <div className="header__inputs">
            <input type="text" placeholder="how Brella's plan works" />
            <button>Find out</button>
          </div>
        </div>
      </div>
    );
  }
}

export default PageBanner;