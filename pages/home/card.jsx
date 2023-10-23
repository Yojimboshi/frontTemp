import React, { useState } from 'react';
import ReactCardFlip from 'react-card-flip';

const Card = ({ front, back }) => {
  const [isFlipped, setFlipped] = useState(false);

  const handleCardFlip = () => {
    setFlipped(!isFlipped);
  };

  return (
    <div className="card" onClick={handleCardFlip}>
      <ReactCardFlip isFlipped={isFlipped} flipDirection="horizontal">
        <div key="front" className="card-front">
          <h2>{front}</h2>
        </div>
        <div key="back" className="card-back">
          <p>{back}</p>
        </div>
      </ReactCardFlip>
    </div>
  );
};

export default Card;
