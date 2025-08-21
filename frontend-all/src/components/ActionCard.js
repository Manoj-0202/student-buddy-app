import React from 'react';

const ActionCard = ({ image, title }) => {
  return (
    <div className="action-card">
      <img src={image} alt={title} className="action-card-image" />
      <p className="action-card-title">{title}</p>
    </div>
  );
};

export default ActionCard;
