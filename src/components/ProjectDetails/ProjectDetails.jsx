import React, { useState } from 'react';
import './ProjectDetails.css';
import ProgressBar from '../ProgressBar/ProgressBar.jsx';
import { formatCurrency } from '../../utils/formatCurrency.js';

const ProjectDetails = ({ project, onBackToList, onUpdateProject, onEdit, onDelete }) => {
  const [tasks, setTasks] = useState(project.tasks || []);
  const [newTask, setNewTask] = useState('');
  const [newSubtaskTexts, setNewSubtaskTexts] = useState({});

  const calculateProgress = () => {
    if (!project.tasks || project.tasks.length === 0) {
      return 0;
    }
    
    let totalItems = 0;
    let completedItems = 0;

    project.tasks.forEach(task => {
      totalItems++;
      if (task.completed) {
        completedItems++;
      }
      
      task.subtasks.forEach(subtask => {
        totalItems++;
        if (subtask.completed) {
          completedItems++;
        }
      });
    });

    if (totalItems === 0) {
      return 0;
    }

    return Math.round((completedItems / totalItems) * 100);
  };
  
  const progress = calculateProgress();

  const handleAddTask = () => {
    if (newTask.trim() === '') return;
    const updatedTasks = [...tasks, { id: Date.now(), text: newTask, completed: false, subtasks: [] }];
    setTasks(updatedTasks);
    onUpdateProject({ ...project, tasks: updatedTasks });
    setNewTask('');
  };

  const handleToggleComplete = (taskId) => {
    const updatedTasks = tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
    onUpdateProject({ ...project, tasks: updatedTasks });
  };
  
  const handleAddSubtask = (taskId) => {
    const subtaskText = newSubtaskTexts[taskId] || '';
    if (subtaskText.trim() === '') return;

    const updatedTasks = tasks.map(task => 
      task.id === taskId 
        ? { ...task, subtasks: [...task.subtasks, { id: Date.now(), text: subtaskText, completed: false }] } 
        : task
    );
    setTasks(updatedTasks);
    onUpdateProject({ ...project, tasks: updatedTasks });
    setNewSubtaskTexts({ ...newSubtaskTexts, [taskId]: '' });
  };
  
  const handleToggleSubtask = (taskId, subtaskId) => {
    const updatedTasks = tasks.map(task => 
      task.id === taskId 
        ? { ...task, subtasks: task.subtasks.map(subtask => 
            subtask.id === subtaskId ? { ...subtask, completed: !subtask.completed } : subtask
          )} 
        : task
    );
    setTasks(updatedTasks);
    onUpdateProject({ ...project, tasks: updatedTasks });
  };
  
  const handleConcludeProject = () => {
    onUpdateProject({ ...project, status: 'Concluído' });
  };

  const handleReopenProject = () => {
    onUpdateProject({ ...project, status: 'Em andamento' });
  };

  return (
    <div className="project-details-container">
      <div className="top-actions">
        <button className="back-button" onClick={onBackToList}>&larr; Voltar para a lista</button>
        <button className="edit-button" onClick={() => onEdit(project)}>Editar Projeto</button>
        <button className="delete-button" onClick={() => onDelete(project.id)}>Excluir Projeto</button>
      </div>
      <div className="project-details-card">
        <h2>Detalhes do Projeto</h2>
        <p><strong>Contratante:</strong> {project.contractor}</p>
        <p><strong>Responsável:</strong> {project.responsible}</p>
        <p><strong>Data de Entrega:</strong> {project.deliveryDate}</p>
        <p><strong>Valor:</strong> R$ {formatCurrency(project.projectValue)}</p>
        {project.initialPayment && <p><strong>Valor de Entrada:</strong> R$ {formatCurrency(project.initialPayment)}</p>}
        {project.initialPayment && (
          <p>
            <strong>A receber:</strong> R$ {formatCurrency(project.projectValue - project.initialPayment)}
          </p>
        )}
        <p><strong>Status:</strong> <span className={`status-badge status-${project.status.replace(' ', '-').toLowerCase()}`}>{project.status}</span></p>
        <p className="project-description">
          <strong>Descrição:</strong> {project.description || "Nenhuma descrição fornecida."}
        </p>

        <div className="task-section">
          <h3>Tarefas</h3>
          <div className="task-input-group">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Adicionar nova tarefa"
            />
            <button onClick={handleAddTask}>Adicionar</button>
          </div>
          <ul className="tasks-list">
            {tasks.map(task => (
              <li key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => handleToggleComplete(task.id)}
                />
                <span onClick={() => handleToggleComplete(task.id)}>{task.text}</span>
                <div className="subtasks-container">
                  <ul className="subtasks-list">
                    {task.subtasks.map(subtask => (
                      <li key={subtask.id} className={`subtask-item ${subtask.completed ? 'completed' : ''}`}>
                        <input
                          type="checkbox"
                          checked={subtask.completed}
                          onChange={() => handleToggleSubtask(task.id, subtask.id)}
                        />
                        <span onClick={() => handleToggleSubtask(task.id, subtask.id)}>{subtask.text}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="subtask-input-group">
                    <input
                      type="text"
                      value={newSubtaskTexts[task.id] || ''}
                      onChange={(e) => setNewSubtaskTexts({ ...newSubtaskTexts, [task.id]: e.target.value })}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleAddSubtask(task.id);
                        }
                      }}
                      placeholder="Adicionar sub-tarefa"
                    />
                    <button onClick={() => handleAddSubtask(task.id)}>Adicionar</button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="project-actions">
          {project.status === 'Em andamento' && progress === 100 ? (
            <button className="concluir-button" onClick={handleConcludeProject}>Marcar como Concluído</button>
          ) : (
            <button className="reabrir-button" onClick={handleReopenProject}>Reabrir Projeto</button>
          )}
        </div>

        <ProgressBar project={project} />
      </div>
    </div>
  );
};

export default ProjectDetails;