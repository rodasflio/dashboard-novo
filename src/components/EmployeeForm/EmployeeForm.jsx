import React, { useState } from 'react';
import './EmployeeForm.css';

const EmployeeForm = ({ onSave }) => {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [email, setEmail] = useState('');

  const handleSave = (e) => {
    e.preventDefault();
    if (!name || !role || !email) {
      alert('Por favor, preencha todos os campos.');
      return;
    }

    const newEmployee = {
      id: Date.now(),
      name,
      role,
      email
    };
    onSave(newEmployee);
  };

  return (
    <form className="employee-form" onSubmit={handleSave}>
      <div className="form-group">
        <label>Nome do Funcionário:</label>
        <input 
          type="text" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          required 
        />
      </div>
      <div className="form-group">
        <label>Cargo:</label>
        <input 
          type="text" 
          value={role} 
          onChange={(e) => setRole(e.target.value)} 
          required 
        />
      </div>
      <div className="form-group">
        <label>Email:</label>
        <input 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
        />
      </div>
      <button type="submit" className="save-button">Salvar Funcionário</button>
    </form>
  );
};

export default EmployeeForm;