import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'framer-motion';

const TaskCard = ({ task, onTaskClick, variants }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  };

  const priorityClasses = {
    High: 'bg-red-200 text-red-800',
    Medium: 'bg-yellow-200 text-yellow-800',
    Low: 'bg-green-200 text-green-800',
  };

  const cardClassName = `bg-white p-4 rounded-lg shadow-sm cursor-grab hover:shadow-md`;

  // --- Lógica da Data de Entrega ---
  let formattedDate = '';
  let isOverdue = false;

  if (task.dueDate) {
    const dueDate = new Date(task.dueDate);
    const today = new Date();

    // Zera as horas para comparar apenas as datas
    today.setHours(0, 0, 0, 0);
    // Ajusta a data de entrega para o fuso horário correto (assumindo que foi salva em UTC)
    dueDate.setUTCHours(0, 0, 0, 0); 

    if (dueDate < today) {
      isOverdue = true;
    }

    formattedDate = dueDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      timeZone: 'UTC', // Garante consistência
    });
  }
  // --- Fim da Lógica ---

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => onTaskClick(task)}
      className={cardClassName}
    >
      <motion.div
        variants={variants}
        initial="hidden"
        animate="visible"
        exit="hidden"
      >
        {/* Título da Tarefa */}
        <p className="font-semibold text-gray-800 pointer-events-none mb-2">{task.title}</p>
        
        {/* --- JSX da Data e Prioridade --- */}
        <div className="flex justify-between items-center pt-2 border-t border-gray-100">
          {/* Prioridade */}
          <span className={`text-xs font-bold px-2 py-1 rounded-full pointer-events-none ${priorityClasses[task.priority]}`}>
            {task.priority}
          </span>
          
          {/* Data de Entrega (só aparece se existir) */}
          {task.dueDate && (
            <span 
              className={`text-xs font-medium pointer-events-none ${
                isOverdue ? 'text-red-600 font-bold' : 'text-gray-500' 
              }`}
            >
              {formattedDate}
            </span>
          )}
        </div>
        {/* --- Fim do novo JSX --- */}
      </motion.div>
    </div>
  );
};

export default TaskCard;