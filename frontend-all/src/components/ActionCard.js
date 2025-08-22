import React from 'react';
import PropTypes from 'prop-types';

const ActionCard = ({ image, title }) => {
  return (
    <div className="action-card">
      <img src={image} alt={title} className="action-card-image" />
      <p className="action-card-title">{title}</p>
    </div>
  );
};

ActionCard.propTypes = {
  image: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

export default ActionCard;
