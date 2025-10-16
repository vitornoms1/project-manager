import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const TaskCard = ({ task, onTaskClick }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const priorityClasses = {
    High: 'bg-red-200 text-red-800',
    Medium: 'bg-yellow-200 text-yellow-800',
    Low: 'bg-green-200 text-green-800',
  };

  const cardClassName = `bg-white p-4 rounded-lg shadow-sm cursor-grab hover:shadow-md ${isDragging ? 'opacity-30' : 'opacity-100'}`;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => onTaskClick(task)}
      className={cardClassName}
    >
      <p className="font-semibold text-gray-800 pointer-events-none">{task.title}</p>
      <span className={`text-xs font-bold px-2 py-1 rounded-full pointer-events-none ${priorityClasses[task.priority]}`}>
        {task.priority}
      </span>
    </div>
  );
};

export default TaskCard;