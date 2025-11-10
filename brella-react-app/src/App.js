import React, { Component } from 'react';
import './styles.css';

import HomePage from './pages/HomePage';
import BrokersPage from './pages/BrokersPage';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: 'home'
    };
  }

  navigateTo = (page) => {
    this.setState({ currentPage: page });
  }

  render() {
    const { currentPage } = this.state;

    return (
      <div>
        {currentPage === 'home' && <HomePage navigateTo={this.navigateTo} />}
        {currentPage === 'brokers' && <BrokersPage navigateTo={this.navigateTo} />}
      </div>
    );
  }
}

export default App;