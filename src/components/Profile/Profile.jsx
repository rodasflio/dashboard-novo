import React from 'react';
import './Profile.css';
import usePersistentState from '../../hooks/usePersistentState.jsx';

const Profile = ({ session, profileUpdateCounter }) => {
  // Passamos profileUpdateCounter como uma dependência para forçar a re-busca
  const [profiles, , loading] = usePersistentState('profiles', [], session, profileUpdateCounter);
  const profile = profiles[0];

  if (loading) {
    return <p>Carregando perfil...</p>;
  }
  
  if (!profile) {
    return (
      <div className="profile-container">
        <h1>Meu Perfil</h1>
        <p>Seu perfil ainda não foi criado. Por favor, acesse a aba de Configurações para criar seu nome de usuário.</p>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <h1>Meu Perfil</h1>
      <div className="profile-card">
        <p><strong>Nome de Usuário:</strong> {profile.username}</p>
        <p><strong>Email:</strong> {session.user.email}</p>
      </div>
    </div>
  );
};

export default Profile;