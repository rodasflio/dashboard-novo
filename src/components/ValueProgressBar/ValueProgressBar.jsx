import React from 'react';
import './ValueProgressBar.css';

const ValueProgressBar = ({ total, received }) => {
  const percentage = total > 0 ? Math.round((received / total) * 100) : 0;

  return (
    <div className="value-progress-section">
      <p>Recebido: {percentage}%</p>
      <div className="value-progress-bar-container">
        <div className="value-progress-bar-fill" style={{ width: `${percentage}%` }}></div>
      </div>
    </div>
  );
};

export default ValueProgressBar;