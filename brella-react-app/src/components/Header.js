import React, { Component } from 'react';
import logo from '../img/Frame.png'; 

class Header extends Component {
  render() {
    return (
      <header className="header" id="header">
        <nav className="nav" id="nav">
          <div className="nav__container">
            <a className="logo" onClick={() => this.props.navigateTo('home')} style={{cursor: 'pointer'}}>
              <img src={logo} alt="Brella Logo"/>
            </a>
            <div className="links" id="nav-links">
              <li><a className="link__item">Our Plan</a></li>
              <li><a className="link__item">Employers</a></li>
              <li>
                <a className="link__item" onClick={() => this.props.navigateTo('brokers')} style={{cursor: 'pointer'}}>
                  Brokers
                </a>
              </li>
              <li><a className="link__item">Members</a></li>
              <li><a className="link__item">About</a></li>
              <li><a className="link__item">Blog</a></li>
              <li><button className="link__button">Request demo</button></li>
              <select className="auth__section">
                <option>Login</option>
              </select>
              <li><a className="link__item">EN</a></li>
            </div>
          </div>
        </nav>
        
        {this.props.children}
        
      </header>
    );
  }
}

export default Header;