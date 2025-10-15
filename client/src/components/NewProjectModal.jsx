import React, { useState } from 'react';
import InputField from './InputField';

const NewProjectModal = ({ isOpen, onClose }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Later, we will call a function from ProjectContext here
    console.log('Creating project:', { title, description });
    onClose(); // Close the modal after submission
  };

  // If the modal is not open, render nothing
  if (!isOpen) {
    return null;
  }

  return (
    // Modal Overlay
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center">
      {/* Modal Content */}
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg animate-fade-in">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Create New Project</h2>
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              rows="4"
              placeholder="Provide a brief description of the project."
            ></textarea>
          </div>
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
              className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700"
            >
              Create Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewProjectModal;