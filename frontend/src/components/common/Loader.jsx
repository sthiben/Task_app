import React from 'react';
import './Loader.css';

const Loader = ({ size = 'medium', fullscreen = false }) => {
  const containerClass = `loader-container ${fullscreen ? 'loader-fullscreen' : ''} ${size !== 'medium' ? `loader-${size}` : ''}`;
  
  return (
    <div className={containerClass}>
      <div className="loader-spinner" role="status" aria-label="Loading"></div>
    </div>
  );
};

export default Loader;
