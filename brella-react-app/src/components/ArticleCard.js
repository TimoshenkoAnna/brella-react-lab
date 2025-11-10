import React, { Component } from 'react';

class ArticleCard extends Component {
  render() {
    const { image, category, title } = this.props.articleData;

    return (
      <div className="about__item">
        <a><img src={image} className="about__item_img" alt={title}/></a>
        <a className="about__item_title">{category}</a>
        <h3 className="about__item_subtitle">{title}</h3>
      </div>
    );
  }
}

export default ArticleCard;