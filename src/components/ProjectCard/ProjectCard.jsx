import React from 'react';
import './ProjectCard.css';
import { formatCurrency } from '../../utils/formatCurrency.js';

const ProjectCard = ({ project, onClick }) => {
  const calculateRemainingValue = () => {
    const projectValue = parseFloat(project.projectValue) || 0;
    const initialPayment = parseFloat(project.initialPayment) || 0;
    const remaining = projectValue - initialPayment;
    return remaining;
  };

  const calculateTimeLeft = () => {
    const deliveryDate = new Date(project.deliveryDate);
    const now = new Date();
    const differenceInTime = deliveryDate.getTime() - now.getTime();
    const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));

    if (differenceInDays < 0) {
      return 'Prazo encerrado';
    } else if (differenceInDays === 0) {
      return 'Entrega hoje!';
    } else if (differenceInDays === 1) {
      return '1 dia restante';
    } else if (differenceInDays <= 30) {
      return `${differenceInDays} dias restantes`;
    } else {
      const differenceInMonths = Math.floor(differenceInDays / 30);
      return `${differenceInMonths} meses restantes`;
    }
  };

  return (
    <div className="project-card" onClick={() => onClick(project)}>
      <div className="card-header">
        <h3 className="contractor-name">{project.contractor}</h3>
        <span className={`status-badge status-${project.status.replace(' ', '-').toLowerCase()}`}>
          {project.status}
        </span>
      </div>
      <div className="card-body">
        <p><strong>Responsável:</strong> {project.responsible}</p>
        <p><strong>Data de Entrega:</strong> {project.deliveryDate}</p>
        <p><strong>Valor:</strong> R$ {formatCurrency(project.projectValue)}</p>
        {project.initialPayment && <p><strong>Valor de Entrada:</strong> R$ {formatCurrency(project.initialPayment)}</p>}
        {project.initialPayment && (
          <p>
            <strong>A receber:</strong> R$ {formatCurrency(calculateRemainingValue())}
          </p>
        )}
        <p><strong>Tempo até a entrega:</strong> {calculateTimeLeft()}</p>
        {project.description && (
          <p className="description"><strong>Descrição:</strong> {project.description}</p>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;