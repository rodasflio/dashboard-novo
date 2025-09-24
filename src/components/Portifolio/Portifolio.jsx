import React, { useState } from 'react';
import './Portifolio.css';
import usePersistentState from '../../hooks/usePersistentState.jsx';
import ProjectCard from '../ProjectCard/ProjectCard.jsx';
import ProjectDetails from '../ProjectDetails/ProjectDetails.jsx';

const Portifolio = ({ session }) => {
  const [projects, setProjects] = usePersistentState('projects', [], session);
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeTab, setActiveTab] = useState('Todos');

  const handleCardClick = (project) => {
    setSelectedProject(project);
  };

  const handleBackToList = () => {
    setSelectedProject(null);
  };

  const handleUpdateProject = (updatedProject) => {
    setProjects(projects.map(project => 
      project.id === updatedProject.id ? updatedProject : project
    ));
    setSelectedProject(updatedProject);
  };

  const filteredProjects = projects.filter(project => {
    if (activeTab === 'Todos') {
      return true;
    }
    return project.status === activeTab;
  });
  
  if (selectedProject) {
    return (
      <ProjectDetails 
        project={selectedProject} 
        onBackToList={handleBackToList} 
        onUpdateProject={handleUpdateProject} 
      />
    );
  }

  return (
    <div className="portifolio-container">
      <h1>Portfólio</h1>
      
      <div className="tab-buttons">
        <button 
          className={`tab-button ${activeTab === 'Todos' ? 'active' : ''}`}
          onClick={() => setActiveTab('Todos')}
        >
          Todos
        </button>
        <button 
          className={`tab-button ${activeTab === 'Em andamento' ? 'active' : ''}`}
          onClick={() => setActiveTab('Em andamento')}
        >
          Em Andamento
        </button>
        <button 
          className={`tab-button ${activeTab === 'Concluído' ? 'active' : ''}`}
          onClick={() => setActiveTab('Concluído')}
        >
          Concluídos
        </button>
      </div>

      {filteredProjects.length > 0 ? (
        <div className="projects-grid">
          {filteredProjects.map(project => (
            <ProjectCard
              key={project.id}
              project={project}
              onClick={handleCardClick}
            />
          ))}
        </div>
      ) : (
        <p>Nenhum projeto encontrado nesta categoria.</p>
      )}
    </div>
  );
};

export default Portifolio;