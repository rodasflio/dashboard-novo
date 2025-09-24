import React from 'react';
import './ModalPage.css';
import Modal from '../Modal/Modal.jsx';
import ProjectForm from '../ProjectForm/ProjectForm.jsx';

const ModalPage = ({ onSaveProject, isModalOpen, onClose, editingProject }) => {

  const handleSaveAndClose = (newProject) => {
    onSaveProject(newProject);
    onClose();
  };

  return (
    <Modal show={isModalOpen} onClose={onClose}>
      <h2>{editingProject ? 'Editar Projeto' : 'Criar Novo Projeto'}</h2>
      <ProjectForm onSave={handleSaveAndClose} editingProject={editingProject} />
    </Modal>
  );
};

export default ModalPage;