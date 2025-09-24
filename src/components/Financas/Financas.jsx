import React from 'react';
import './Financas.css';
import usePersistentState from '../../hooks/usePersistentState.jsx';
import ValueProgressBar from '../ValueProgressBar/ValueProgressBar.jsx';
import { formatCurrency } from '../../utils/formatCurrency.js';

const Financas = () => {
  const [projects] = usePersistentState('projects', []);

  const calculateTotal = (status = null) => {
    return projects.reduce((total, project) => {
      if (status && project.status !== status) {
        return total;
      }
      const value = parseFloat(project.projectValue) || 0;
      return total + value;
    }, 0);
  };

  const calculateReceived = (status = null) => {
    return projects.reduce((total, project) => {
      if (status && project.status !== status) {
        return total;
      }
      const value = parseFloat(project.initialPayment) || 0;
      return total + value;
    }, 0);
  };
  
  const totalValue = calculateTotal();
  const totalReceived = calculateReceived();
  const totalRemaining = totalValue - totalReceived;
  
  return (
    <div className="financas-container">
      <h1>Finanças</h1>
      
      <div className="summary-section">
        <h2>Resumo Financeiro</h2>
        <div className="summary-cards">
          <div className="card-item">
            <h3>Valor Total dos Projetos</h3>
            <p className="card-value">R$ {formatCurrency(totalValue)}</p>
          </div>
          <div className="card-item">
            <h3>Valor Recebido</h3>
            <p className="card-value">R$ {formatCurrency(totalReceived)}</p>
            <ValueProgressBar total={totalValue} received={totalReceived} />
          </div>
          <div className="card-item">
            <h3>Valor a Receber</h3>
            <p className="card-value">R$ {formatCurrency(totalRemaining)}</p>
          </div>
        </div>
      </div>

      <div className="details-section">
        <h2>Detalhes dos Projetos</h2>
        <table className="finances-table">
          <thead>
            <tr>
              <th>Contratante</th>
              <th>Valor do Projeto</th>
              <th>Valor de Entrada</th>
              <th>Valor a Receber</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {projects.map(project => (
              <tr key={project.id}>
                <td>{project.contractor}</td>
                <td>R$ {formatCurrency(project.projectValue)}</td>
                <td>R$ {formatCurrency(project.initialPayment)}</td>
                <td>R$ {formatCurrency(parseFloat(project.projectValue) - parseFloat(project.initialPayment))}</td>
                <td><span className={`status-badge status-${project.status.replace(' ', '-').toLowerCase()}`}>{project.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Financas;