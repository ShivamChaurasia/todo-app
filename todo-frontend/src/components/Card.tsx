import React from 'react';

interface CardProps {
  children: React.ReactNode;
  title?: string;
}

const Card: React.FC<CardProps> = ({ children, title }) => {
  return (
    <div className="p-4 m-4">
      <div className="max-w-md mx-auto bg-white p-4 rounded shadow-md">
        {title && <h1 className="text-2xl mb-4 text-gray-700">{title}</h1>}
        {children}
      </div>
    </div>
  );
};

export default Card;
