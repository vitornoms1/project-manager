

import React from 'react';

const TaskCardSkeleton = () => {
  return (
    
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <div className="animate-pulse flex justify-between items-start">
        
        <div className="bg-gray-300 h-5 rounded w-3/4"></div>
        
        
        <div className="bg-gray-300 h-5 rounded w-16"></div>
      </div>
    </div>
  );
};

export default TaskCardSkeleton;