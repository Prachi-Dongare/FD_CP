import React from 'react';
import './PhotoBackground.css';

const PhotoBackground = () => {
  return (
    <div className="photo-background-container">
      <img src="/hero-bg.png" alt="Agricultural Background" className="photo-bg-image" />
      <div className="photo-overlay" />
    </div>
  );
};

export default PhotoBackground;
