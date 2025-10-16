import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import NewTaskModal from '../components/NewTaskModal';
import TaskDetailsModal from '../components/TaskDetailsModal';
import { DndContext, DragOverlay, closestCorners, useSensor, useSensors, PointerSensor } from '@dnd-kit/core'; 
import KanbanColumn from '../components/KanbanColumn';
import TaskCard from '../components/TaskCard';
import api from '../api/axios';
import toast from 'react-hot-toast'; 

const ProjectPage = () => {
  const { id: projectId } = useParams();
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const [activeTask, setActiveTask] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);

  const [projectTitle, setProjectTitle] = useState("");
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );

  useEffect(() => {
    const fetchProjectData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await api.get(`/projects/${projectId}`);
        setProjectTitle(response.data.title);
        setTasks(response.data.tasks || []);
      } catch (err) {
        const errorMsg = "Could not load project data.";
        setError(errorMsg);
        toast.error(errorMsg); 
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjectData();
  }, [projectId]);

  const priorityOrder = { 'High': 1, 'Medium': 2, 'Low': 3 };
  const sortedTasks = [...tasks].sort((a, b) => {
    const priorityA = priorityOrder[a.priority] || 4;
    const priorityB = priorityOrder[b.priority] || 4;
    if (priorityA < priorityB) return -1;
    if (priorityA > priorityB) return 1;
    if (a.id < b.id) return -1;
    if (a.id > b.id) return 1;
    return 0;
  });

  const handleDragStart = (event) => {
    const { active } = event;
    const task = tasks.find(t => t.id === active.id);
    setActiveTask(task);
  };

  const handleUpdateTaskStatus = async (taskId, newStatus, originalTasks) => {
    try {
      await api.patch(`/tasks/${taskId}/status`, { status: newStatus });
      toast.success('Task status updated!'); 
    } catch (err) {
      console.error("Failed to update task status:", err);
      setTasks(originalTasks);
      toast.error('Could not move task. Changes reverted.'); 
    }
  };

  const handleDragEnd = (event) => {
    setActiveTask(null);
    const { active, over } = event;
    if (!over) { return; }

    const activeTask = tasks.find((t) => t.id === active.id);
    if (!activeTask) return;
    
    let newStatus = activeTask.status;
    if (over.data.current?.type === 'COLUMN') {
      newStatus = over.id;
    } else {
      const overTask = tasks.find((t) => t.id === over.id);
      if (overTask) { newStatus = overTask.status; }
    }

    if (activeTask.status !== newStatus) {
      const originalTasks = [...tasks];
      const updatedTasks = tasks.map(task => 
        task.id === active.id ? { ...task, status: newStatus } : task
      );
      setTasks(updatedTasks);
      handleUpdateTaskStatus(active.id, newStatus, originalTasks);
    }
  };

  const handleAddTask = async (taskData) => {
    try {
      const response = await api.post('/tasks', { ...taskData, projectId });
      const newTask = response.data;
      setTasks(prevTasks => [...prevTasks, newTask]);
      setIsNewTaskModalOpen(false);
      toast.success('Task created successfully!'); 
    } catch (err) {
      console.error("Error creating task:", err);
      
      
      throw err;
    }
  };

  const handleUpdateTask = async (taskId, updatedData) => {
    try {
      const response = await api.put(`/tasks/${taskId}`, updatedData);
      const updatedTask = response.data;
      setTasks(prevTasks => 
        prevTasks.map(task => (task.id === taskId ? updatedTask : task))
      );
      setSelectedTask(null);
      toast.success('Task updated successfully!'); 
    } catch (err) {
      console.error("Error updating task:", err);
      throw err;
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await api.delete(`/tasks/${taskId}`);
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
      setSelectedTask(null);
      toast.success('Task deleted successfully!'); 
    } catch (err) {
      console.error("Error deleting task:", err);
      throw err;
    }
  };

  const columns = {
    'To Do': sortedTasks.filter(task => task.status === 'To Do'),
    'In Progress': sortedTasks.filter(task => task.status === 'In Progress'),
    'Done': sortedTasks.filter(task => task.status === 'Done'),
  };
  const columnOrder = ['To Do', 'In Progress', 'Done'];

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd} collisionDetection={closestCorners}>
      <div className="min-h-screen bg-gray-100">
        <header className="bg-white shadow-md">
            <nav className="px-6 py-4 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <Link to="/dashboard" className="text-gray-600 hover:text-indigo-600">
                        &larr; Back to Projects
                    </Link>
                    <h1 className="text-xl font-bold text-gray-800">{isLoading ? 'Loading Project...' : projectTitle}</h1>
                </div>
                {!isLoading && (
                  <button
                      onClick={() => setIsNewTaskModalOpen(true)}
                      className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700"
                  >
                      + New Task
                  </button>
                )}
            </nav>
        </header>

        <main className="p-6">
          {error && !isLoading ? ( 
            <div className="text-center mt-16 text-red-500">
              <h2 className="text-2xl font-semibold mb-4">An Error Occurred</h2>
              <p>{error}</p>
            </div>
          ) : !isLoading && tasks.length === 0 ? (
            <div className="text-center mt-16 animate-fade-in">
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">This project has no tasks yet</h2>
              <p className="text-gray-500 mb-8">Get started by adding a new task to organize your workflow.</p>
              <button
                onClick={() => setIsNewTaskModalOpen(true)}
                className="bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-indigo-700 transition-transform transform hover:scale-105"
              >
                + Create First Task
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {columnOrder.map(columnName => (
                <KanbanColumn
                  key={columnName}
                  id={columnName}
                  title={columnName}
                  tasks={columns[columnName]}
                  onTaskClick={(task) => setSelectedTask(task)}
                  isLoading={isLoading}
                />
              ))}
            </div>
          )}
        </main>

        <NewTaskModal
          isOpen={isNewTaskModalOpen}
          onClose={() => setIsNewTaskModalOpen(false)}
          onTaskAdded={handleAddTask}
          projectId={projectId}
        />
        
        <TaskDetailsModal
          isOpen={!!selectedTask}
          onClose={() => setSelectedTask(null)}
          task={selectedTask}
          onTaskUpdate={handleUpdateTask}
          onTaskDelete={handleDeleteTask}
        />
      </div>

      <DragOverlay>
        {activeTask ? <TaskCard task={activeTask} /> : null}
      </DragOverlay>
    </DndContext>
  );
};

export default ProjectPage;