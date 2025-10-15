import React, { createContext, useState, useContext } from 'react';
import axios from 'axios'; // Usaremos o axios para as chamadas

// Cria o contexto
const ProjectContext = createContext();

// Hook customizado
export function useProjects() {
  return useContext(ProjectContext);
}

// Cria o provedor
export function ProjectProvider({ children }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // As funções para buscar e criar projetos virão aqui.
  // Por enquanto, as deixaremos vazias.
  const fetchProjects = async () => {
    console.log("Buscando projetos...");
  };

  const createProject = async (title, description) => {
    console.log("Criando projeto...", { title, description });
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