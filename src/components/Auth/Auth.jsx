import React, { useState } from 'react';
import './Auth.css';
import { supabase } from '../../supabaseClient';

const Auth = ({ onSignIn }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isNewUser, setIsNewUser] = useState(false);

  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      if (isNewUser) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        alert('Confira seu e-mail para confirmar seu cadastro!');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        onSignIn();
      }
    } catch (error) {
      alert(error.error_description || error.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>{isNewUser ? 'Cadastro' : 'Login'}</h2>
        <form onSubmit={handleAuth}>
          <div className="form-group">
            <label>Email:</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Senha:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="auth-button">
            {isNewUser ? 'Cadastrar' : 'Entrar'}
          </button>
        </form>
        <p className="toggle-text" onClick={() => setIsNewUser(!isNewUser)}>
          {isNewUser ? 'Já tem uma conta? Faça login.' : 'Não tem uma conta? Cadastre-se.'}
        </p>
      </div>
    </div>
  );
};

export default Auth;