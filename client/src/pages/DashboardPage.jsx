import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NewProjectModal from '../components/NewProjectModal';
import ProjectCardSkeleton from '../components/ProjectCardSkeleton';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const DashboardPage = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  
  const [editingProject, setEditingProject] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      const fetchProjects = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const response = await api.get('/projects');
          setProjects(response.data);
        } catch (err) {
          const errorMsg = "Could not load projects. Please try again.";
          setError(errorMsg);
          toast.error(errorMsg);
        } finally {
          setIsLoading(false);
        }
      };
      fetchProjects();
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  const handleAddProject = async (projectData) => {
    try {
      const response = await api.post('/projects', projectData);
      setProjects(prevProjects => [...prevProjects, response.data]);
      closeModal(); 
      toast.success('Project created successfully!');
    } catch (err) {
      console.error("Error creating project:", err);
      throw err;
    }
  };

  
  const handleUpdateProject = async (projectId, updatedData) => {
    try {
      const response = await api.put(`/projects/${projectId}`, updatedData);
      const updatedProject = response.data;
      
      setProjects(prevProjects => 
        prevProjects.map(p => (p.id === projectId ? updatedProject : p))
      );
      closeModal();
      toast.success('Project updated successfully!');
    } catch (err) {
      console.error("Error updating project:", err);
      throw err;
    }
  };
  
  const handleDeleteProject = async (projectId) => {
    if (window.confirm('Are you sure you want to delete this project and all its tasks? This action cannot be undone.')) {
      try {
        await api.delete(`/projects/${projectId}`);
        setProjects(prevProjects => prevProjects.filter(p => p.id !== projectId));
        toast.success('Project deleted successfully!');
      } catch (err) {
        console.error("Error deleting project:", err);
        toast.error('Failed to delete project.');
      }
    }
  };

  
  const openCreateModal = () => {
    setEditingProject(null); 
    setIsModalOpen(true);
  };
  
  const openEditModal = (project) => {
    setEditingProject(project); 
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProject(null); 
  };

  const listVariants = {
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
    hidden: {},
  };

  const itemVariants = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
    hidden: {
      opacity: 0,
      y: 20,
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      transition: {
        duration: 0.3,
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-md">
        <nav className="px-6 py-3 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">
            TaskFlow<span className="text-indigo-600">✓</span>
          </h1>
          <div className="flex items-center gap-4">
            {!isLoading && projects.length > 0 && (
              <button
                onClick={openCreateModal} 
                className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700"
              >
                + New Project
              </button>
            )}
            <button
              onClick={logout}
              className="bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </nav>
      </header>
      
      <main className="container mx-auto px-6 py-8">
        {isLoading ? (
          <>
            <div className="flex justify-between items-center mb-6"><h2 className="text-3xl font-bold text-gray-700">My Projects</h2></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, index) => <ProjectCardSkeleton key={index} />)}
            </div>
          </>
        ) : error ? (
          <div className="text-center mt-16 text-red-500">
            <h2 className="text-2xl font-semibold mb-4">An Error Occurred</h2>
            <p>{error}</p>
          </div>
        ) : projects.length > 0 ? (
          <>
            <div className="flex justify-between items-center mb-6"><h2 className="text-3xl font-bold text-gray-700">My Projects</h2></div>
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={listVariants}
              initial="hidden"
              animate="visible"
            >
              <AnimatePresence>
                {projects.map(project => (
                  <motion.div 
                    key={project.id} 
                    variants={itemVariants}
                    layout
                    exit="exit"
                    className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col"
                  >
                    <Link to={`/projects/${project.id}`} className="block p-6 flex-grow">
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">{project.title}</h3>
                      <p className="text-gray-600 line-clamp-2">{project.description}</p>
                    </Link>
                    <div className="border-t border-gray-200 px-6 py-3 flex justify-end gap-2">
                      <button 
                        onClick={() => openEditModal(project)} 
                        className="text-sm font-medium text-blue-600 hover:text-blue-800 px-2 py-1 rounded hover:bg-blue-50"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteProject(project.id);
                        }}
                        className="text-sm font-medium text-red-600 hover:text-red-800 px-2 py-1 rounded hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </>
        ) : (
          <div className="text-center mt-16 animate-fade-in">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Welcome to TaskFlow!</h2>
            <p className="text-gray-500 mb-8">It looks like you don't have any projects yet. How about creating your first one?</p>
            <button
              onClick={openCreateModal} 
              className="bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-indigo-700"
            >
              + Create First Project
            </button>
          </div>
        )}
      </main>

      <NewProjectModal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        onProjectAdded={handleAddProject}
        onProjectUpdated={handleUpdateProject} 
        projectToEdit={editingProject}
      />
    </div>
  );
};

export default DashboardPage;