import React from 'react';
import './Configuracoes.css';
import ThemeToggle from '../ThemeToggle/ThemeToggle.jsx';
import { supabase } from '../../supabaseClient.js';

const Configuracoes = ({ theme, onThemeToggle }) => {

  const handleClearData = async () => {
    if (window.confirm("Tem certeza que deseja apagar todos os dados do seu dashboard? Esta ação não pode ser desfeita.")) {
      const { error } = await supabase.from('projects').delete().neq('id', 0);
      if (error) {
        console.error('Erro ao limpar os dados:', error);
      } else {
        localStorage.clear();
        window.location.reload();
      }
    }
  };

  return (
    <div className="configuracoes-container">
      <h1>Configurações</h1>
      <div className="settings-card">
        <h3>Aparência</h3>
        <p>Alterne entre o modo claro e escuro para o dashboard.</p>
        <ThemeToggle theme={theme} onToggle={onThemeToggle} />
      </div>
      <div className="settings-card">
        <h3>Gerenciamento de Dados</h3>
        <p>Ao clicar no botão abaixo, todos os projetos, tarefas e finanças serão permanentemente apagados.</p>
        <button className="clear-data-button" onClick={handleClearData}>
          Limpar Todos os Dados
        </button>
      </div>
    </div>
  );
};

export default Configuracoes;