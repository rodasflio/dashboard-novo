import React, { useState } from 'react';
import './Dashboard.css';
import ProgressCircle from '../ProgressCircle/ProgressCircle.jsx';
import FilteredProjectsList from '../FilteredProjectsList/FilteredProjectsList.jsx';
import { formatCurrency } from '../../utils/formatCurrency.js';
import usePersistentState from '../../hooks/usePersistentState.jsx';

const Dashboard = ({ projects, loadingProjects, session }) => {
  const [employees] = usePersistentState('employees', [], session);
  const [selectedStatus, setSelectedStatus] = useState(null);

  const inProgressProjects = projects.filter(p => p.status === 'Em andamento');
  const concludedProjects = projects.filter(p => p.status === 'Concluido');
  const totalProjects = projects.length;
  const totalEmployees = employees.length;

  const inProgressPercentage = totalProjects > 0 ? Math.round((inProgressProjects.length / totalProjects) * 100) : 0;
  const concludedPercentage = totalProjects > 0 ? Math.round((concludedProjects.length / totalProjects) * 100) : 0;

  const calculateTotalValue = () => {
    return projects.reduce((total, project) => {
      const value = parseFloat(project.projectValue) || 0;
      return total + value;
    }, 0);
  };
  
  const calculateTotalReceived = () => {
    return projects.reduce((total, project) => {
      const value = parseFloat(project.initialPayment) || 0;
      return total + value;
    }, 0);
  };
  
  const totalValue = calculateTotalValue();
  const totalReceived = calculateTotalReceived();
  const totalRemaining = totalValue - totalReceived;
  
  const getUpcomingProjects = () => {
    const today = new Date();
    const oneMonthFromNow = new Date();
    oneMonthFromNow.setDate(today.getDate() + 30);
    
    return inProgressProjects.filter(project => {
      const deliveryDate = new Date(project.deliveryDate);
      return deliveryDate >= today && deliveryDate <= oneMonthFromNow;
    }).sort((a, b) => new Date(a.deliveryDate) - new Date(b.deliveryDate));
  };
  
  const upcomingProjects = getUpcomingProjects();

  const handleCircleClick = (status) => {
    setSelectedStatus(status);
  };
  
  const handleBack = () => {
    setSelectedStatus(null);
  };
  
  if (selectedStatus === 'Em andamento') {
    return <FilteredProjectsList 
      projects={inProgressProjects} 
      title="Projetos em Andamento" 
      onBack={handleBack} 
    />;
  }

  if (selectedStatus === 'Concluído') {
    return <FilteredProjectsList 
      projects={concludedProjects} 
      title="Projetos Concluídos" 
      onBack={handleBack} 
    />;
  }
  
  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>
      
      <div className="summary-section">
        <div className="summary-cards">
          <div className="card-item" onClick={() => handleCircleClick('Em andamento')}>
            <ProgressCircle percentage={inProgressPercentage} label="Em Andamento" />
            <p className="count-label">{inProgressProjects.length} projetos</p>
          </div>
          <div className="card-item" onClick={() => handleCircleClick('Concluído')}>
            <ProgressCircle percentage={concludedPercentage} label="Concluídos" />
            <p className="count-label">{concludedProjects.length} projetos</p>
          </div>
          <div className="card-item">
            <h3>Total de Funcionários</h3>
            <p className="card-value">{totalEmployees}</p>
          </div>
        </div>
      </div>

      <div className="summary-section">
        <div className="summary-cards">
          <div className="card-item">
            <h3>Valor Total</h3>
            <p className="card-value">R$ {formatCurrency(totalValue)}</p>
          </div>
          <div className="card-item">
            <h3>Valor Recebido</h3>
            <p className="card-value">R$ {formatCurrency(totalReceived)}</p>
          </div>
          <div className="card-item">
            <h3>Valor a Receber</h3>
            <p className="card-value">R$ {formatCurrency(totalRemaining)}</p>
          </div>
        </div>
      </div>

      <div className="upcoming-projects-section">
        <h2>Próximos Vencimentos</h2>
        {upcomingProjects.length > 0 ? (
          <ul className="upcoming-list">
            {upcomingProjects.map(project => (
              <li key={project.id} className="upcoming-item">
                <p><strong>{project.contractor}</strong></p>
                <p className="due-date">Faltam {Math.ceil((new Date(project.deliveryDate) - new Date()) / (1000 * 3600 * 24))} dias</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>Nenhum projeto com vencimento nos próximos 30 dias.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;