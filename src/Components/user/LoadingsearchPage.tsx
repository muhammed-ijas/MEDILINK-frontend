import React from "react";

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="animate-pulse">
        <div className="bg-blue-500 p-3 rounded-full animate-bounce"></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
