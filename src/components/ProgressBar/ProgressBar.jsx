import React from 'react';
import './ProgressBar.css';

const ProgressBar = ({ project }) => {
  const calculateProgress = () => {
    if (!project.tasks || project.tasks.length === 0) {
      return 0;
    }
    
    let totalItems = 0;
    let completedItems = 0;

    project.tasks.forEach(task => {
      totalItems++;
      if (task.completed) {
        completedItems++;
      }
      
      task.subtasks.forEach(subtask => {
        totalItems++;
        if (subtask.completed) {
          completedItems++;
        }
      });
    });

    if (totalItems === 0) {
      return 0;
    }

    return Math.round((completedItems / totalItems) * 100);
  };
  
  const progress = calculateProgress();

  return (
    <div className="progress-section">
      <p>Progresso: {progress}%</p>
      <div className="progress-bar-container">
        <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
      </div>
    </div>
  );
};

export default ProgressBar;