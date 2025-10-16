

import React from 'react';

const ProjectCardSkeleton = () => {
  return (
    
    <div className="bg-white p-6 rounded-lg shadow-md h-full">
      
      <div className="animate-pulse space-y-4">
        
        <div className="bg-gray-300 h-6 rounded w-3/4"></div>
        
        
        <div className="space-y-2">
          <div className="bg-gray-300 h-4 rounded w-full"></div>
          <div className="bg-gray-300 h-4 rounded w-5/6"></div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCardSkeleton;