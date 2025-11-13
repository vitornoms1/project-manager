import React, { useState, useEffect } from 'react';
import InputField from './InputField';

const formatDateForInput = (dateString) => {
  if (!dateString) return '';
  try {
    return new Date(dateString).toISOString().split('T')[0];
  } catch (e) {
    console.error("Erro ao formatar data:", e);
    return '';
  }
};

const NewProjectModal = ({ isOpen, onClose, onProjectAdded, onProjectUpdated, projectToEdit }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const isEditing = !!projectToEdit;

  useEffect(() => {
    if (isOpen) {
      if (isEditing) {
        // Preenche o formulário com dados do projeto para editar
        setTitle(projectToEdit.title);
        setDescription(projectToEdit.description || '');
        setDueDate(formatDateForInput(projectToEdit.dueDate));
      } else {
        // Limpa o formulário para criar um novo
        setTitle('');
        setDescription('');
        setDueDate('');
      }
      setError(null); 
    }
  }, [isOpen, projectToEdit, isEditing]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Project title is required.");
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    const projectData = {
      title,
      description,
      dueDate: dueDate || null // Envia null se o campo estiver vazio
    };
    
    try {
      if (isEditing) {
        await onProjectUpdated(projectToEdit.id, projectData);
      } else {
        await onProjectAdded(projectData);
        // Limpa o formulário localmente apenas na criação
        setTitle(''); 
        setDescription('');
        setDueDate('');
      }
      // O DashboardPage é responsável por fechar o modal em caso de sucesso
    } catch (err) {
      const errorMsg = err.response?.data?.msg || `Failed to ${isEditing ? 'update' : 'create'} project.`;
      setError(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg animate-fade-in">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          {isEditing ? 'Edit Project' : 'Create New Project'}
        </h2>
        <form onSubmit={handleSubmit}>
          <InputField
            id="projectTitle"
            label="Project Title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Q4 Marketing Campaign"
            required
          />
          <div className="mb-6">
            <label htmlFor="projectDescription" className="block text-gray-700 mb-2">Description (Optional)</label>
            <textarea
              id="projectDescription"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              rows="4"
              placeholder="Provide a brief description of the project."
            ></textarea>
          </div>

          <div className="mb-6">
            <label htmlFor="projectDueDate" className="block text-gray-700 mb-2">Due Date (Optional)</label>
            <input
              type="date"
              id="projectDueDate"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 disabled:bg-indigo-400"
            >
              {isSubmitting 
                ? (isEditing ? 'Saving...' : 'Creating...') 
                : (isEditing ? 'Save Changes' : 'Create Project')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewProjectModal;