import React, { useState } from 'react';
import './Configuracoes.css';
import ThemeToggle from '../ThemeToggle/ThemeToggle.jsx';
import UserForm from '../UserForm/UserForm.jsx';
import { supabase } from '../../supabaseClient.js';

const Configuracoes = ({ theme, onThemeToggle, onSignOut, onDeleteAccount, hasProfile, onProfileCreated, session }) => {
  const [showUserForm, setShowUserForm] = useState(false);

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
        <h3>Gerenciamento de Perfil</h3>
        {hasProfile ? (
          <p>Seu perfil já foi criado. Para editar, use a aba "Perfil".</p>
        ) : (
          <>
            <p>Seu perfil ainda não foi criado. Clique no botão abaixo para adicionar seu nome de usuário.</p>
            {!showUserForm && (
              <button className="add-profile-button" onClick={() => setShowUserForm(true)}>
                Criar Perfil
              </button>
            )}
            {showUserForm && (
              <div className="user-form-container">
                <UserForm session={session} onProfileCreated={onProfileCreated} />
              </div>
            )}
          </>
        )}
      </div>

      <div className="settings-card">
        <h3>Gerenciamento de Dados</h3>
        <p>Ao clicar no botão abaixo, todos os projetos, tarefas e finanças serão permanentemente apagados.</p>
        <button className="clear-data-button" onClick={handleClearData}>
          Limpar Todos os Dados
        </button>
      </div>

      <div className="settings-card">
        <h3>Ações da Conta</h3>
        <p>Clique no botão abaixo para sair da sua conta e retornar para a tela de login.</p>
        <button className="clear-data-button" onClick={onSignOut}>
          Sair do Dashboard
        </button>
        <p>Clique no botão abaixo para excluir permanentemente sua conta e todos os dados associados a ela.</p>
        <button className="delete-account-button" onClick={onDeleteAccount}>
          Excluir Conta
        </button>
      </div>
    </div>
  );
};

export default Configuracoes;