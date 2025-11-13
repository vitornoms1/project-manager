import React, { createContext, useState, useContext } from 'react';
// Removido import do axios aqui
import api from '../api/axios'; // 1. Importar a instância global configurada
// Removido useAuth daqui, não precisamos mais pegar o token manualmente
// import { useAuth } from './AuthContext'; 

const ProjectContext = createContext();

export function useProjects() {
  return useContext(ProjectContext);
}

// 2. Removida a função createApi

export function ProjectProvider({ children }) {
  const [projects, setProjects] = useState([]);
  // Removido estado de tasks daqui, ele pertence à ProjectPage
  // const [tasks, setTasks] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // Removida a dependência do token, o 'api' global já o terá
  // const { token } = useAuth(); 
  
  // 'api' agora se refere à instância global importada

  const fetchProjects = async () => {
    // Removida a checagem do token
    setLoading(true);
    setError(null);
    try {
      // Usa a instância 'api' diretamente
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
    // Removida a checagem do token
    setLoading(true);
    setError(null);
    try {
      // Usa a instância 'api' diretamente
      const response = await api.post('/projects', { title, description });
      const newProject = response.data;
      setProjects(prevProjects => [newProject, ...prevProjects]); // Adiciona no início
      return newProject; // Retorna o projeto criado para o chamador (modal)
    } catch (err) {
      setError("Failed to create project.");
      console.error(err);
      throw err; // Lança o erro para o modal tratar
    } finally {
      setLoading(false);
    }
  };

  // Removidas as funções relacionadas a Tasks, elas pertencem à ProjectPage
  // const fetchTasksByProjectId = async (projectId) => { ... };
  // const createTask = async (taskData) => { ... };

  const value = {
    projects,
    loading,
    error,
    fetchProjects,
    createProject,
    // Adiciona setProjects para atualizações otimistas ou deleções feitas fora do contexto
    setProjects 
  };

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
}