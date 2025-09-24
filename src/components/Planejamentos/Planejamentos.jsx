import React, { useState } from 'react';
import './Planejamentos.css';
import usePersistentState from '../../hooks/usePersistentState.jsx';
import ModalPage from '../ModalPage/ModalPage.jsx';
import ProjectCard from '../ProjectCard/ProjectCard.jsx';
import ProjectDetails from '../ProjectDetails/ProjectDetails.jsx';
import { supabase } from '../../supabaseClient.js';

const Planejamentos = () => {
  const [projects, setProjects, loading] = usePersistentState('projects', []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [editingProject, setEditingProject] = useState(null);
  const [activeTab, setActiveTab] = useState('Em andamento');

  const handleSaveProject = (newProject) => {
    if (editingProject) {
      setProjects(projects.map(project => 
        project.id === newProject.id ? newProject : project
      ));
      setEditingProject(null);
    } else {
      setProjects([...projects, newProject]);
    }
    setIsModalOpen(false);
  };
  
  const handleUpdateProject = (updatedProject) => {
    setProjects(projects.map(project => 
      project.id === updatedProject.id ? updatedProject : project
    ));
    setSelectedProject(updatedProject);
  };

  const handleDeleteProject = async (projectId) => {
    if (window.confirm("Tem certeza que deseja apagar este projeto? Esta ação não pode ser desfeita.")) {
      const { error } = await supabase.from('projects').delete().eq('id', projectId);
      if (error) {
        console.error('Erro ao excluir o projeto:', error);
      } else {
        const updatedProjects = projects.filter(project => project.id !== projectId);
        setProjects(updatedProjects);
        setSelectedProject(null); // Volta para a lista de projetos
      }
    }
  };

  const handleCardClick = (project) => {
    setSelectedProject(project);
  };

  const handleBackToList = () => {
    setSelectedProject(null);
  };
  
  const handleEditClick = (project) => {
    setEditingProject(project);
    setIsModalOpen(true);
  };

  const inProgressProjects = projects.filter(project => project.status === 'Em andamento');
  const concludedProjects = projects.filter(project => project.status === 'Concluido');

  const renderContent = () => {
    if (loading) {
      return <p>Carregando projetos...</p>;
    }
    
    if (selectedProject) {
      return (
        <ProjectDetails 
          project={selectedProject} 
          onBackToList={handleBackToList} 
          onUpdateProject={handleUpdateProject} 
          onEdit={handleEditClick}
          onDelete={handleDeleteProject}
        />
      );
    }
    
    return (
      <div className="projects-container">
        <div className="tab-buttons">
          <button 
            className={`tab-button ${activeTab === 'Em andamento' ? 'active' : ''}`}
            onClick={() => setActiveTab('Em andamento')}
          >
            Em Andamento
          </button>
          <button 
            className={`tab-button ${activeTab === 'Concluído' ? 'active' : ''}`}
            onClick={() => setActiveTab('Concluido')}
          >
            Concluídos
          </button>
        </div>
        <div className="tab-content">
          {activeTab === 'Em andamento' ? (
            <div className="projects-list-container">
              <button 
                className="add-project-button"
                onClick={() => setIsModalOpen(true)}
              >
                Adicionar Projeto
              </button>
              {inProgressProjects.length > 0 ? (
                <div className="projects-list">
                  {inProgressProjects.map(project => (
                    <ProjectCard 
                      key={project.id} 
                      project={project}
                      onClick={handleCardClick}
                    />
                  ))}
                </div>
              ) : (
                <p>Nenhum projeto em andamento.</p>
              )}
            </div>
          ) : (
            <div className="projects-list-container">
              {concludedProjects.length > 0 ? (
                <div className="projects-list">
                  {concludedProjects.map(project => (
                    <ProjectCard 
                      key={project.id} 
                      project={project}
                      onClick={handleCardClick}
                    />
                  ))}
                </div>
              ) : (
                <p>Nenhum projeto concluído ainda.</p>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="planejamentos-container">
      <h1>Planejamentos</h1>
      {renderContent()}
      <ModalPage 
        onSaveProject={handleSaveProject}
        isModalOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editingProject={editingProject}
      />
    </div>
  );
};

export default Planejamentos;