import React from 'react';
import './ProgressCircle.css';

const ProgressCircle = ({ percentage, label }) => {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="progress-circle-container">
      <svg
        className="progress-circle"
        width="120"
        height="120"
        viewBox="0 0 120 120"
      >
        <circle
          className="progress-circle-bg"
          cx="60"
          cy="60"
          r={radius}
        ></circle>
        <circle
          className="progress-circle-fill"
          cx="60"
          cy="60"
          r={radius}
          style={{
            strokeDashoffset,
          }}
          strokeDasharray={circumference}
        ></circle>
      </svg>
      <div className="progress-label">
        <p>{label}</p>
        <h3>{percentage}%</h3>
      </div>
    </div>
  );
};

export default ProgressCircle;