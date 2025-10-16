import React, { useState } from 'react';
import InputField from './InputField';

const NewTaskModal = ({ isOpen, onClose, projectId, onTaskAdded }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => { 
    e.preventDefault();

    if (!title.trim()) {
      setError("Task title is required.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      
      await onTaskAdded({ title, description, priority });
      
      
      setTitle('');
      setDescription('');
      setPriority('Medium');
    } catch (err) {
      
      const errorMsg = err.response?.data?.msg || "Failed to create task. Please try again.";
      setError(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  
  const handleClose = () => {
    setTitle('');
    setDescription('');
    setPriority('Medium');
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg animate-fade-in">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Create New Task</h2>
        <form onSubmit={handleSubmit}>
          <InputField
            id="taskTitle"
            label="Task Title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Design new logo"
            required
          />
          <div className="mb-6">
            <label htmlFor="taskDescription" className="block text-gray-700 mb-2">Description (Optional)</label>
            <textarea
              id="taskDescription"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              rows="3"
              placeholder="Add more details about the task."
            ></textarea>
          </div>
          <div className="mb-6">
            <label htmlFor="priority" className="block text-gray-700 mb-2">Priority</label>
            <select
              id="priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </div>

          
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting} 
              className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 disabled:bg-indigo-400"
            >
              {isSubmitting ? 'Creating...' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewTaskModal;