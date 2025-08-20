import React from 'react';
import '../styles/home.css';

const ActionCard = ({ image, title }) => {
  return (
    <div className="action-card">
      <img src={image} alt={title} />
      <p>{title}</p>
    </div>
  );
};

export default ActionCard;
