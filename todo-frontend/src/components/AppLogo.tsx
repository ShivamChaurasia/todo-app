import React from 'react';

const AppLogo: React.FC = () => {
  return (
    <div className="flex justify-center items-center gap-4 mb-12 ">
      <div className="logo w-12">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="48" fill="#4CAF50" />
          <path d="M30 50 L45 65 L70 35" stroke="#FFF" strokeWidth="8" fill="none" />
          <path d="M30 50 L45 65 L70 35" stroke="#000" strokeWidth="10" opacity="0.2" fill="none" transform="translate(2,2)" />
          <circle cx="50" cy="50" r="40" fill="none" stroke="#FFF" strokeWidth="4" />
        </svg>
        <span className="sr-only">Logo</span>
      </div>
      <span className="text-2xl text-gray-800">ToDo Pro</span>
    </div>
  );
};

export default AppLogo;
