import React, { Component } from 'react';

class InfoCard extends Component {
  render() {
    const { image, title, text } = this.props.cardData;

    return (
      <div className="header__item">
        <img src={image} draggable="false" className="header__item_img" alt={title}/>
        <div className="header__item_text">
          <p className="header__item_title">{title}</p>
          <p className="header__item_subtitle">{text}</p>
        </div>
      </div>
    );
  }
}

export default InfoCard;