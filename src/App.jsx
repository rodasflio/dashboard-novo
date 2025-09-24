import React, { useState } from 'react';
import './App.css';
import Sidebar from './components/Sidebar/Sidebar.jsx';
import Dashboard from './components/Dashboard/Dashboard.jsx';
import Planejamentos from './components/Planejamentos/Planejamentos.jsx';
import Portifolio from './components/Portifolio/Portifolio.jsx';
import Financas from './components/Financas/Financas.jsx';
import Configuracoes from './components/Configuracoes/Configuracoes.jsx';
import Funcionarios from './components/Funcionarios/Funcionarios.jsx';
import usePersistentState from './hooks/usePersistentState.jsx';

const App = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activePage, setActivePage] = usePersistentState('activePage', 'Dashboard');
  const [theme, setTheme] = usePersistentState('theme', 'dark');

  const handleSidebarToggle = (isOpen) => {
    setIsSidebarOpen(isOpen);
  };
  
  const handleThemeToggle = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const renderContent = () => {
    switch (activePage) {
      case 'Planejamentos':
        return <Planejamentos />;
      case 'Portifolio':
        return <Portifolio />;
      case 'Financas':
        return <Financas />;
      case 'Configuracoes':
        return <Configuracoes theme={theme} onThemeToggle={handleThemeToggle} />;
      case 'Funcionarios':
        return <Funcionarios />;
      case 'Dashboard':
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className={`App ${theme}`}>
      <Sidebar onToggle={handleSidebarToggle} setActivePage={setActivePage} />
      <div className={`content ${isSidebarOpen ? 'shifted' : ''}`}>
        {renderContent()}
      </div>
    </div>
  );
};

export default App;