import React, { useState, useEffect } from 'react';
import './ProjectForm.css';
import { supabase } from '../../supabaseClient.js';

const ProjectForm = ({ onSave, editingProject }) => {
  const [contractor, setContractor] = useState('');
  const [responsible, setResponsible] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [description, setDescription] = useState('');
  const [projectValue, setProjectValue] = useState('');
  const [initialPayment, setInitialPayment] = useState('');
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      const { data, error } = await supabase.from('employees').select('*');
      if (error) {
        console.error('Erro ao buscar funcionários:', error);
      } else {
        setEmployees(data);
      }
    };
    fetchEmployees();
  }, []);

  useEffect(() => {
    if (editingProject) {
      setContractor(editingProject.contractor || '');
      setResponsible(editingProject.responsible || '');
      setDeliveryDate(editingProject.deliveryDate || '');
      setDescription(editingProject.description || '');
      setProjectValue(editingProject.projectValue || '');
      setInitialPayment(editingProject.initialPayment || '');
    } else {
      setContractor('');
      setResponsible('');
      setDeliveryDate('');
      setDescription('');
      setProjectValue('');
      setInitialPayment('');
    }
  }, [editingProject]);

  const handleSave = (e) => {
    e.preventDefault();
    if (!contractor || !responsible || !deliveryDate || !projectValue) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    const projectData = {
      contractor,
      responsible,
      deliveryDate,
      description,
      projectValue: parseFloat(projectValue) || 0,
      initialPayment: parseFloat(initialPayment) || 0,
      status: editingProject ? editingProject.status : 'Em andamento',
      tasks: editingProject ? editingProject.tasks : [],
    };
    
    // Se estiver editando, adicione o ID
    if (editingProject) {
      projectData.id = editingProject.id;
    }
    
    onSave(projectData);
  };

  return (
    <form className="project-form" onSubmit={handleSave}>
      <div className="form-row">
        <div className="form-group">
          <label>Nome do Contratante:</label>
          <input 
            type="text" 
            value={contractor} 
            onChange={(e) => setContractor(e.target.value)} 
            required 
          />
        </div>
        <div className="form-group">
          <label>Responsável pelo Projeto:</label>
          <select 
            value={responsible} 
            onChange={(e) => setResponsible(e.target.value)} 
            required
          >
            <option value="">Selecione um funcionário</option>
            {employees.map(employee => (
              <option key={employee.id} value={employee.name}>{employee.name}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Data de Entrega:</label>
          <input 
            type="date" 
            value={deliveryDate} 
            onChange={(e) => setDeliveryDate(e.target.value)} 
            required 
          />
        </div>
        <div className="form-group">
          <label>Valor do Projeto (R$):</label>
          <input 
            type="number" 
            value={projectValue} 
            onChange={(e) => setProjectValue(e.target.value)} 
            required 
          />
        </div>
      </div>
      <div className="form-group">
        <label>Valor de Entrada (R$):</label>
        <input 
          type="number" 
          value={initialPayment} 
          onChange={(e) => setInitialPayment(e.target.value)} 
        />
      </div>
      <div className="form-group">
        <label>Descrição do Projeto:</label>
        <textarea 
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
        />
      </div>
      <button type="submit" className="save-button">{editingProject ? 'Salvar Edição' : 'Salvar Projeto'}</button>
    </form>
  );
};

export default ProjectForm;