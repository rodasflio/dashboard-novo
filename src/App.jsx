import React, { useState, useEffect } from 'react';
import './App.css';
import Sidebar from './components/Sidebar/Sidebar.jsx';
import Dashboard from './components/Dashboard/Dashboard.jsx';
import Planejamentos from './components/Planejamentos/Planejamentos.jsx';
import Portifolio from './components/Portifolio/Portifolio.jsx';
import Financas from './components/Financas/Financas.jsx';
import Configuracoes from './components/Configuracoes/Configuracoes.jsx';
import Funcionarios from './components/Funcionarios/Funcionarios.jsx';
import Auth from './components/Auth/Auth.jsx';
import usePersistentState from './hooks/usePersistentState.jsx';
import { supabase } from './supabaseClient.js';

const App = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activePage, setActivePage] = usePersistentState('activePage', 'Dashboard');
  const [theme, setTheme] = usePersistentState('theme', 'dark');
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
      }
    );

    return () => {
      authListener.subscription?.unsubscribe();
    };
  }, []);
  
  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const handleSidebarToggle = (isOpen) => {
    setIsSidebarOpen(isOpen);
  };
  
  const handleThemeToggle = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const renderContent = () => {
    switch (activePage) {
      case 'Planejamentos':
        return <Planejamentos session={session} />;
      case 'Portifolio':
        return <Portifolio session={session} />;
      case 'Financas':
        return <Financas session={session} />;
      case 'Configuracoes':
        return <Configuracoes theme={theme} onThemeToggle={handleThemeToggle} onSignOut={handleSignOut} />;
      case 'Funcionarios':
        return <Funcionarios session={session} />;
      case 'Dashboard':
      default:
        return <Dashboard session={session} />;
    }
  };

  return (
    <div className={`App ${theme}`}>
      {session ? (
        <>
          <Sidebar onToggle={handleSidebarToggle} setActivePage={setActivePage} />
          <div className={`content ${isSidebarOpen ? 'shifted' : ''}`}>
            {renderContent()}
          </div>
        </>
      ) : (
        <Auth onSignIn={() => setSession(supabase.auth.getSession())} />
      )}
    </div>
  );
};

export default App;