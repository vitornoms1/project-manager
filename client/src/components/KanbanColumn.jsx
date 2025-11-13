import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import TaskCard from './TaskCard';
import TaskCardSkeleton from './TaskCardSkeleton';
import { motion, AnimatePresence } from 'framer-motion'; // 1. Importar AnimatePresence

const KanbanColumn = ({ id, title, tasks, onTaskClick, isLoading }) => {
  const { setNodeRef } = useDroppable({
    id,
    data: {
      type: 'COLUMN',
    },
  });

  // As variantes da lista e dos itens continuam aqui
  const listVariants = {
    visible: {
      transition: {
        staggerChildren: 0.07,
      },
    },
    hidden: {},
  };

  const itemVariants = {
    visible: { opacity: 1, y: 0 },
    hidden: { opacity: 0, y: 20 },
  };

  return (
    <div ref={setNodeRef} className="bg-gray-200 p-4 rounded-lg flex flex-col min-h-[200px]">
      <h2 className="font-bold text-lg mb-4 text-gray-700">{title}</h2>
      
      {/* 2. O container da lista ainda usa 'motion' */}
      <motion.div 
        className="space-y-4 flex-grow"
        variants={listVariants}
        initial="hidden"
        animate="visible"
      >
        {isLoading ? (
          <>
            <TaskCardSkeleton />
            <TaskCardSkeleton />
            <TaskCardSkeleton />
          </>
        ) : tasks.length > 0 ? (
          <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
            {/* 3. Adicionar AnimatePresence para animar a entrada/saída */}
            <AnimatePresence>
              {tasks.map(task => (
                // 4. O <motion.div> foi REMOVIDO daqui
                <TaskCard 
                  key={task.id} 
                  task={task} 
                  onTaskClick={onTaskClick}
                  variants={itemVariants} // 5. Passa as variantes para o TaskCard
                />
              ))}
            </AnimatePresence>
          </SortableContext>
        ) : (
          <div className="flex justify-center items-center h-full min-h-[100px] border-2 border-dashed border-gray-300 rounded-lg">
            <p className="text-sm text-gray-500">No tasks here.</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default KanbanColumn;