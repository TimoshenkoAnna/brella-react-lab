import React, { Component } from 'react';

import Header from '../components/Header';
import PageBanner from '../components/PageBanner';
import ContentSection from '../components/ContentSection';
import Footer from '../components/Footer';

class BrokersPage extends Component {
  render() {
    return (
      <div>
        <Header navigateTo={this.props.navigateTo}>
          <PageBanner 
            title="A partnership that pays off."
            subtitle="Grow your book of business with a modern supplemental health benefit."
          />
        </Header>
        
        <main className="content">
          <ContentSection
            slogan="for brokers"
            title="A better benefit for your clients."
            subtitle="Brella is a modern benefit that's easy to understand, simple to sell, and valuable to have in a comprehensive benefits strategy."
            linkText="Get in Touch"
          />

           <ContentSection
            slogan="coverage"
            title="Coverage that matters."
            subtitle="Our plan covers 13,000+ conditions. From common injuries to critical illnesses, we have your clients covered."
          />
        </main>
        
        <Footer companyName="Brella" />
      </div>
    );
  }
}

export default BrokersPage;