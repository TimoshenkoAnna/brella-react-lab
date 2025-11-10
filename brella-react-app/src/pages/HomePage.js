import React, { Component } from 'react';

import Header from '../components/Header';
import PageBanner from '../components/PageBanner';
import InfoCard from '../components/InfoCard';
import ArticleCard from '../components/ArticleCard';
import ContentSection from '../components/ContentSection';
import Footer from '../components/Footer';

import infoCardImg1 from '../img/header_item_1.png';
import infoCardImg2 from '../img/header_item_2.png';
import infoCardImg3 from '../img/header_item_3.png';

import articleImg1 from '../img/1.jpg';
import articleImg2 from '../img/2.jpg';
import articleImg3 from '../img/3.jpg';

import backer1 from '../img/01.png';
import backer2 from '../img/02.png';
import backer3 from '../img/03.png';
import backer4 from '../img/04.png';
import backer5 from '../img/05.png';

const infoCardsData = [
  { image: infoCardImg1, title: 'More coverage', text: 'Brella covers 13,000+ injuries and illnesses from concussions to cancer.' },
  { image: infoCardImg2, title: 'Less hassle', text: 'One easy-to-manage plan with paperless install and online admin tools.' },
  { image: infoCardImg3, title: 'Faster benefits', text: 'Brella pays claims in hours–not weeks so your people can rest easy.' }
];

const articlesData = [
  { image: articleImg1, category: 'Podcast', title: 'Better Voluntary Benefits with NFP Voluntary Benefits Practice Leader, Kim Heald' },
  { image: articleImg2, category: 'Insurance Innovation', title: 'How to Design Simpler Insurance Benefits' },
  { image: articleImg3, category: 'Benefits Strategy', title: 'Executive Benefits Outlook with Dan Aceti' }
];

class HomePage extends Component {
  render() {
    return (
      <div>
        <Header navigateTo={this.props.navigateTo}>
          <PageBanner 
            title="Give your team peace of mind with supplemental health insurance from Brella."
            subtitle="I'm wondering..."
          />
          <div className="header__items_body">
            <div className="header__items">
              {infoCardsData.map((card, index) => (
                <InfoCard key={index} cardData={card} />
              ))}
            </div>
          </div>
        </Header>
        
        <main className="content">
          <ContentSection
            slogan="for employers"
            title="Easy enrollment meets simple administration."
            subtitle="Brella brings 100% paperless implementation, enrollment, and admin. Plug into our platforms or we’ll plug into yours."
            linkText="Learn More"
          />
          
          <section className="content__slider">
              <div className="slider__container">
                  <h3 className="slider__title">Proudly backed by</h3>
                  <div className="slider">
                      <span>←</span>
                      <div className="slider__content" >
                          <div className="slider__container_img">
                              <img src={backer1} className="slider_item" alt="Backer 1"/>
                              <img src={backer2} className="slider_item" alt="Backer 2"/>
                              <img src={backer3} className="slider_item" alt="Backer 3"/>
                              <img src={backer4} className="slider_item" alt="Backer 4"/>
                              <img src={backer5} className="slider_item" alt="Backer 5"/>
                          </div>
                      </div>
                      <span>→</span>
                  </div>
              </div>
          </section>
          
          <section className="content__about">
            <div className="about__container">
              {articlesData.map((article, index) => (
                <ArticleCard key={index} articleData={article} />
              ))}
            </div>
          </section>
        </main>
        
        <Footer companyName="Brella" />
      </div>
    );
  }
}

export default HomePage;