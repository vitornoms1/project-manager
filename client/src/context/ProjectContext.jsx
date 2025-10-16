import React, { createContext, useState, useContext } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext'; 

const ProjectContext = createContext();

export function useProjects() {
  return useContext(ProjectContext);
}


const createApi = (token) => {
  return axios.create({
    baseURL: '/api', 
    headers: {
      'x-auth-token': token 
    }
  });
};

export function ProjectProvider({ children }) {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { token } = useAuth(); 
  
  const api = createApi(token);

  const fetchProjects = async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/projects');
      setProjects(response.data);
    } catch (err) {
      setError("Failed to fetch projects.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const createProject = async (title, description) => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/projects', { title, description });
      const newProject = response.data;
      
      setProjects(prevProjects => [newProject, ...prevProjects]);
    } catch (err) {
      setError("Failed to create project.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTasksByProjectId = async (projectId) => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/tasks/project/${projectId}`);
      setTasks(response.data);
    } catch (err) {
      setError("Failed to fetch tasks.");
      console.error(err);
      setTasks([]); 
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (taskData) => {
    if (!token) return;
    
    try {
      const response = await api.post('/tasks', taskData);
      const newTask = response.data;
      
      setTasks(prevTasks => [...prevTasks, newTask]);
    } catch (err) {
      setError("Failed to create task.");
      console.error(err);
    }
  };

  const value = {
    projects,
    loading,
    error,
    fetchProjects,
    createProject,
  };

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
}