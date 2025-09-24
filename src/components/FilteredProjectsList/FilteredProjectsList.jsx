import React from 'react';
import './FilteredProjectsList.css';
import ProjectCard from '../ProjectCard/ProjectCard.jsx';

const FilteredProjectsList = ({ projects, title, onBack }) => {
  return (
    <div className="filtered-list-container">
      <button className="back-button" onClick={onBack}>&larr; Voltar para o Dashboard</button>
      <h2>{title}</h2>
      {projects.length > 0 ? (
        <div className="projects-grid">
          {projects.map(project => (
            <ProjectCard 
              key={project.id} 
              project={project}
              // Ações de clique podem ser adicionadas aqui
            />
          ))}
        </div>
      ) : (
        <p>Nenhum projeto encontrado nesta categoria.</p>
      )}
    </div>
  );
};

export default FilteredProjectsList;