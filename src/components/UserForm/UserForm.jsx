import React, { useState } from 'react';
import { supabase } from '../../supabaseClient.js';
import './UserForm.css';

const UserForm = ({ session, onProfileCreated }) => {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = async (event) => {
    event.preventDefault();
    setLoading(true);

    const updates = {
      id: session.user.id,
      username,
    };
    
    const { error } = await supabase.from('profiles').upsert(updates);

    if (error) {
      console.error('Erro ao salvar o perfil:', error);
      alert('Ocorreu um erro ao salvar seu perfil. Verifique o console para mais detalhes.');
    } else {
      onProfileCreated();
    }
    setLoading(false);
  };

  return (
    <div className="user-form-container">
      <h2>Criar seu Perfil</h2>
      <form onSubmit={handleSave}>
        <label htmlFor="username">Nome de Usuário:</label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Salvando...' : 'Salvar Perfil'}
        </button>
      </form>
    </div>
  );
};

export default UserForm;