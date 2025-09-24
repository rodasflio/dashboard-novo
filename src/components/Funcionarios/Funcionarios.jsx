import React, { useState, useEffect } from 'react';
import './Funcionarios.css';
import usePersistentState from '../../hooks/usePersistentState.jsx';
import Modal from '../Modal/Modal.jsx';
import EmployeeForm from '../EmployeeForm/EmployeeForm.jsx';
import { supabase } from '../../supabaseClient.js';

const Funcionarios = ({ session }) => {
  const [employees, setEmployees, loadingEmployees] = usePersistentState('employees', [], session);
  const [projects, setProjects] = usePersistentState('projects', [], session);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getProjectsCount = (employeeName) => {
    return projects.filter(project => project.responsible === employeeName).length;
  };

  const handleSaveEmployee = async (newEmployee) => {
    const employeeToSave = { ...newEmployee, user_id: session.user.id };

    const { data, error } = await supabase
      .from('employees')
      .insert([employeeToSave])
      .select();

    if (error) {
      console.error('Erro ao adicionar o funcionário:', error);
    } else {
      setEmployees([...employees, ...data]);
      setIsModalOpen(false);
    }
  };

  return (
    <div className="funcionarios-container">
      <h1>Funcionários</h1>
      <button 
        className="add-employee-button"
        onClick={() => setIsModalOpen(true)}
      >
        Adicionar Funcionário
      </button>
      <div className="employees-list">
        {loadingEmployees ? (
          <p>Carregando funcionários...</p>
        ) : employees.length > 0 ? (
          employees.map(employee => (
            <div key={employee.id} className="employee-card">
              <h3>{employee.name}</h3>
              <p><strong>Cargo:</strong> {employee.role}</p>
              <p><strong>Email:</strong> {employee.email}</p>
              <p><strong>Projetos:</strong> {getProjectsCount(employee.name)}</p>
            </div>
          ))
        ) : (
          <p>Nenhum funcionário adicionado ainda.</p>
        )}
      </div>
      
      <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2>Adicionar Novo Funcionário</h2>
        <EmployeeForm onSave={handleSaveEmployee} />
      </Modal>
    </div>
  );
};

export default Funcionarios;