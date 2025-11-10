import React, { Component } from 'react';

class ContentSection extends Component {
  render() {
    const { slogan, title, subtitle, linkText } = this.props;

    return (
      <section className="content__brokers">
        <div className="brokers__container">
          <span className="raiting__main_slogan">{slogan}</span>
          <h3 className="raiting__main_title">{title}</h3>
          <p className="raiting__main_subtitle">{subtitle}</p>
          {linkText && <p className="content__why_link">{linkText}</p>}
        </div>
      </section>
    );
  }
}

export default ContentSection;