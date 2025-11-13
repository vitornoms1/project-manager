import React, { useState, useEffect } from 'react';
import InputField from './InputField';

// 1. Função helper para formatar a data para o input
const formatDateForInput = (dateString) => {
  if (!dateString) return '';
  try {
    return new Date(dateString).toISOString().split('T')[0];
  } catch (e) {
    console.error("Erro ao formatar data:", e);
    return '';
  }
};

const TaskDetailsModal = ({ task, isOpen, onClose, onTaskUpdate, onTaskDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [dueDate, setDueDate] = useState(''); // 2. Novo estado para a data

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (task) {
      setTitle(task.title || '');
      setDescription(task.description || '');
      setPriority(task.priority || 'Medium');
      setDueDate(formatDateForInput(task.dueDate)); // 3. Preenche o estado da data
      setIsEditing(false);
      setError(null);
    }
  }, [task]);

  if (!isOpen || !task) {
    return null;
  }

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setTitle(task.title);
    setDescription(task.description);
    setPriority(task.priority);
    setDueDate(formatDateForInput(task.dueDate)); // 4. Reseta a data ao cancelar
    setError(null);
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      // 5. Envia o dueDate (ou null se estiver vazio) para a função de update
      await onTaskUpdate(task.id, { 
        title, 
        description, 
        priority, 
        dueDate: dueDate || null 
      });
      // O ProjectPage fechará o modal em caso de sucesso
    } catch (err) {
      const errorMsg = err.response?.data?.msg || "Failed to save changes.";
      setError(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete the task: "${task.title}"?`)) {
      setIsSubmitting(true);
      setError(null);
      try {
        await onTaskDelete(task.id);
      } catch (err) {
        const errorMsg = err.response?.data?.msg || "Failed to delete task.";
        setError(errorMsg);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center" onClick={onClose}>
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl animate-fade-in" onClick={(e) => e.stopPropagation()}>
        
        {isEditing ? (
          // MODO DE EDIÇÃO
          <div>
            <InputField id="edit-title" label="Task Title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
            
            <div className="mb-6">
              <label htmlFor="edit-description" className="block text-gray-700 mb-2">Description</label>
              <textarea id="edit-description" value={description} onChange={(e) => setDescription(e.target.value)} rows="5" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"></textarea>
            </div>

            {/* 6. Campos de Prioridade e Data lado a lado */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div>
                <label htmlFor="edit-priority" className="block text-gray-700 mb-2">Priority</label>
                <select id="edit-priority" value={priority} onChange={(e) => setPriority(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </div>
              <div>
                <label htmlFor="edit-dueDate" className="block text-gray-700 mb-2">Due Date (Optional)</label>
                <input
                  type="date"
                  id="edit-dueDate"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
            
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}

            <div className="flex justify-end gap-4">
              <button onClick={handleCancel} disabled={isSubmitting} className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 disabled:opacity-50">Cancel</button>
              <button onClick={handleSave} disabled={isSubmitting} className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 disabled:bg-indigo-400">
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        ) : (
          // MODO DE VISUALIZAÇÃO
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">{task.title}</h2>
            
            <p className="text-gray-600 mb-6 whitespace-pre-wrap">{task.description || 'No description provided.'}</p>

            {/* 7. Exibição da Prioridade e Data de Entrega */}
            <div className="flex items-center gap-6 mb-8">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-700">Priority:</span>
                <span className={`text-sm font-bold px-3 py-1 rounded-full ${task.priority === 'High' ? 'bg-red-200 text-red-800' : task.priority === 'Medium' ? 'bg-yellow-200 text-yellow-800' : 'bg-green-200 text-green-800'}`}>
                  {task.priority}
                </span>
              </div>
              {task.dueDate && (
                <>
                  <span className="text-gray-300">|</span>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-700">Due Date:</span>
                    <span className="text-sm text-gray-800">
                      {new Date(task.dueDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        timeZone: 'UTC' // Adicionado para evitar problemas de fuso horário
                      })}
                    </span>
                  </div>
                </>
              )}
            </div>

            {error && <p className="text-red-500 text-center mb-4">{error}</p>}

            <div className="flex justify-between items-center">
              <button onClick={handleDelete} disabled={isSubmitting} className="px-6 py-2 text-red-600 font-semibold rounded-lg hover:bg-red-100 disabled:opacity-50">
                {isSubmitting ? 'Deleting...' : 'Delete Task'}
              </button>
              <div className="flex gap-4">
                <button onClick={onClose} disabled={isSubmitting} className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 disabled:opacity-50">Close</button>
                <button onClick={handleEdit} disabled={isSubmitting} className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 disabled:opacity-50">Edit</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskDetailsModal;