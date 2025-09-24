import React, { useState } from 'react';
import './Sidebar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTachometerAlt, 
  faTasks, 
  faBriefcase, 
  faDollarSign, 
  faCog,
  faUsers,
  faUser
} from '@fortawesome/free-solid-svg-icons';

const Sidebar = ({ onToggle, setActivePage }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleMouseEnter = () => {
    setIsOpen(true);
    onToggle(true);
  };

  const handleMouseLeave = () => {
    setIsOpen(false);
    onToggle(false);
  };
  
  const handleClick = (page) => {
    setActivePage(page);
  };

  return (
    <aside
      className={`sidebar ${isOpen ? 'open' : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <nav className="menu">
        <ul>
          <li>
            <a href="#" onClick={() => handleClick('Dashboard')}>
              <FontAwesomeIcon icon={faTachometerAlt} />
              <span>Dashboard</span>
            </a>
          </li>
          <li>
            <a href="#" onClick={() => handleClick('Planejamentos')}>
              <FontAwesomeIcon icon={faTasks} />
              <span>Planejamentos</span>
            </a>
          </li>
          <li>
            <a href="#" onClick={() => handleClick('Portifolio')}>
              <FontAwesomeIcon icon={faBriefcase} />
              <span>Portfólio</span>
            </a>
          </li>
          <li>
            <a href="#" onClick={() => handleClick('Financas')}>
              <FontAwesomeIcon icon={faDollarSign} />
              <span>Finanças</span>
            </a>
          </li>
          <li>
            <a href="#" onClick={() => handleClick('Funcionarios')}>
              <FontAwesomeIcon icon={faUsers} />
              <span>Funcionários</span>
            </a>
          </li>
          <li>
            <a href="#" onClick={() => handleClick('Perfil')}>
              <FontAwesomeIcon icon={faUser} />
              <span>Perfil</span>
            </a>
          </li>
          <li>
            <a href="#" onClick={() => handleClick('Configuracoes')}>
              <FontAwesomeIcon icon={faCog} />
              <span>Configurações</span>
            </a>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;