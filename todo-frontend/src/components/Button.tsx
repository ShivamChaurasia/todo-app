import React from 'react';

interface ButtonProps {
  onClick?: () => void;
  text: string;
  type: 'button' | 'submit' | 'reset';
  isDisabled?: boolean;
  isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  onClick,
  text,
  type,
  isDisabled,
  isLoading,
}) => {
  return (
    <button
      onClick={onClick}
      type={type}
      className={`w-full bg-primary-500 text-white py-2 px-4 rounded hover:hover:bg-primary-400 ${isDisabled || isLoading ? 'opacity-65' : ''}`}
      disabled={isDisabled || isLoading}
    >
      {isLoading ? '...' : text}
    </button>
  );
};

export default Button;
