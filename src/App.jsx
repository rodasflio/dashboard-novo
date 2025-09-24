import React, { useState, useEffect } from 'react';
import './App.css';
import { supabase } from './supabaseClient';
import Sidebar from './components/Sidebar/Sidebar.jsx';
import Dashboard from './components/Dashboard/Dashboard.jsx';
import Planejamentos from './components/Planejamentos/Planejamentos.jsx';
import Portifolio from './components/Portifolio/Portifolio.jsx';
import Financas from './components/Financas/Financas.jsx';
import Configuracoes from './components/Configuracoes/Configuracoes.jsx';
import Funcionarios from './components/Funcionarios/Funcionarios.jsx';
import Auth from './components/Auth/Auth.jsx';
import UserForm from './components/UserForm/UserForm.jsx';
import usePersistentState from './hooks/usePersistentState.jsx';
import Profile from './components/Profile/Profile.jsx';

const App = () => {
  const [session, setSession] = useState(null);
  const [hasProfile, setHasProfile] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activePage, setActivePage] = usePersistentState('activePage', 'Dashboard');
  const [projects, setProjects, loadingProjects] = usePersistentState('projects', [], session);
  const [profileUpdateCounter, setProfileUpdateCounter] = useState(0);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      if (session) {
        const { data, error } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', session.user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error("Erro ao buscar perfil:", error);
        }
        setHasProfile(!!data);
      }
      setLoading(false);
    };

    fetchProfile();
  }, [session, profileUpdateCounter]); // profileUpdateCounter ADICIONADO AQUI

  const handleProfileCreated = () => {
    setHasProfile(true);
    setProfileUpdateCounter(prev => prev + 1);
  };
  
  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Atenção: Esta ação é irreversível. Você tem certeza que deseja excluir sua conta e todos os seus dados?")) {
      return;
    }

    try {
      const { user } = session;

      const { error: projectsError } = await supabase.from('projects').delete().eq('user_id', user.id);
      if (projectsError) throw projectsError;

      const { error: employeesError } = await supabase.from('employees').delete().eq('user_id', user.id);
      if (employeesError) throw employeesError;

      const { error: profileError } = await supabase.from('profiles').delete().eq('id', user.id);
      if (profileError) throw profileError;
      
      alert("Sua conta e todos os seus dados foram excluídos com sucesso.");
      await handleSignOut();
    } catch (error) {
      console.error("Erro ao excluir a conta:", error.message);
      alert("Ocorreu um erro ao tentar excluir sua conta. Por favor, tente novamente.");
    }
  };

  const handleSidebarToggle = (isOpen) => {
    setIsSidebarOpen(isOpen);
  };
  
  const renderContent = () => {
    switch (activePage) {
      case 'Planejamentos':
        return <Planejamentos session={session} projects={projects} setProjects={setProjects} loadingProjects={loadingProjects} />;
      case 'Portifolio':
        return <Portifolio session={session} projects={projects} setProjects={setProjects} loadingProjects={loadingProjects} />;
      case 'Financas':
        return <Financas session={session} projects={projects} loadingProjects={loadingProjects} />;
      case 'Configuracoes':
        return <Configuracoes onSignOut={handleSignOut} onDeleteAccount={handleDeleteAccount} hasProfile={hasProfile} onProfileCreated={handleProfileCreated} session={session} />;
      case 'Funcionarios':
        return <Funcionarios session={session} projects={projects} />;
      case 'Perfil':
        return <Profile session={session} profileUpdateCounter={profileUpdateCounter} />;
      case 'Dashboard':
      default:
        return <Dashboard session={session} projects={projects} loadingProjects={loadingProjects} />;
    }
  };

  if (loading || loadingProjects) {
    return (
      <div className="loading-container">
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <div className="App">
      {!session ? (
        <Auth />
      ) : (
        <>
          <Sidebar onToggle={handleSidebarToggle} setActivePage={setActivePage} />
          <div className={`content ${isSidebarOpen ? 'shifted' : ''}`}>
            {renderContent()}
          </div>
        </>
      )}
    </div>
  );
};

export default App;