import React from 'react';
import './AnimatedFarmingBackground.css';

const AnimatedFarmingBackground = () => {
  return (
    <div className="video-background-container">
      {/* Background Video - Realistic Farming Scene */}
      <video 
        autoPlay 
        loop 
        muted 
        playsInline 
        className="auth-video-bg"
      >
        <source src="/auth-bg-video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Professional Overlay for Contrast and Color Adjustment */}
      <div className="video-overlay" />
    </div>
  );
};

export default AnimatedFarmingBackground;
