import React, { useState } from 'react'; // Import useState
import { useAuth } from '../context/AuthContext';
import NewProjectModal from '../components/NewProjectModal'; // Import the new modal

const DashboardPage = () => {
  const { logout } = useAuth();
  // State to control the modal's visibility
  const [isModalOpen, setIsModalOpen] = useState(false);

  const exampleProjects = [
    { id: 1, title: 'My First Project', description: 'This is an example description.' },
    { id: 2, title: 'Secret Project', description: 'Another project description.' },
    { id: 3, title: 'UI Redesign', description: 'Tasked with redesigning the main UI.' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-md">
        <nav className="px-6 py-3 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">
            TaskFlow<span className="text-indigo-600">✓</span>
          </h1>
          <button
            onClick={logout}
            className="bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600 transition duration-300"
          >
            Logout
          </button>
        </nav>
      </header>
      
      <main className="container mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-700">My Projects</h2>
          {/* This button now opens the modal */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 transition duration-300"
          >
            + New Project
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exampleProjects.map(project => (
            <div key={project.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{project.title}</h3>
              <p className="text-gray-600">{project.description}</p>
            </div>
          ))}
        </div>
      </main>

      {/* The modal is rendered here, its visibility is controlled by state */}
      <NewProjectModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
};

export default DashboardPage;