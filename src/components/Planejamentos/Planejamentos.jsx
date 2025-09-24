import React, { useState } from 'react';
import './Planejamentos.css';
import usePersistentState from '../../hooks/usePersistentState.jsx';
import ModalPage from '../ModalPage/ModalPage.jsx';
import ProjectCard from '../ProjectCard/ProjectCard.jsx';
import ProjectDetails from '../ProjectDetails/ProjectDetails.jsx';
import { supabase } from '../../supabaseClient.js';

const Planejamentos = ({ session, projects, setProjects, loadingProjects }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [editingProject, setEditingProject] = useState(null);
  const [activeTab, setActiveTab] = useState('Em andamento');

  const handleSaveProject = async (newProject) => {
    // Adiciona o user_id ao novo projeto antes de salvar no Supabase
    if (!session || !session.user) {
      console.error("Erro: Sessão de usuário não encontrada. Não é possível salvar o projeto.");
      alert("Por favor, faça o login novamente. Sessão de usuário não encontrada.");
      return;
    }
    
    // Log para depuração: verifique o objeto que será enviado
    console.log("Objeto a ser salvo:", newProject);

    const projectToSave = { ...newProject, user_id: session.user.id };
    
    if (editingProject) {
      const { data, error } = await supabase
        .from('projects')
        .update(projectToSave)
        .eq('id', newProject.id)
        .select();
      
      if (error) {
        console.error('Erro ao atualizar o projeto:', error);
      } else {
        setProjects(projects.map(project => 
          project.id === newProject.id ? data[0] : project
        ));
      }
      setEditingProject(null);
    } else {
      // Se não houver ID, inserimos um novo projeto
      const { data, error } = await supabase
        .from('projects')
        .insert([projectToSave])
        .select();
      
      if (error) {
        console.error('Erro ao adicionar o projeto:', error);
        alert('Erro ao adicionar o projeto. Verifique o console para mais detalhes.');
      } else {
        setProjects([...projects, ...data]);
      }
    }
    setIsModalOpen(false);
  };
  
  const handleUpdateProject = async (updatedProject) => {
    const { data, error } = await supabase
      .from('projects')
      .update(updatedProject)
      .eq('id', updatedProject.id)
      .select();

    if (error) {
      console.error('Erro ao atualizar o projeto:', error);
    } else {
      setProjects(projects.map(project => 
        project.id === updatedProject.id ? data[0] : project
      ));
      setSelectedProject(updatedProject);
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (window.confirm("Tem certeza que deseja apagar este projeto? Esta ação não pode ser desfeita.")) {
      const { error } = await supabase.from('projects').delete().eq('id', projectId);
      if (error) {
        console.error('Erro ao excluir o projeto:', error);
      } else {
        const updatedProjects = projects.filter(project => project.id !== projectId);
        setProjects(updatedProjects);
        setSelectedProject(null);
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
    if (loadingProjects) {
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