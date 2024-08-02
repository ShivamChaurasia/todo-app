import React, { ChangeEvent, useState, FocusEvent } from 'react';

interface InputFieldProps {
  id: string;
  label: string;
  type: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  isValid?: boolean;
  placeholder: string;
}

const InputField: React.FC<InputFieldProps> = ({
  id,
  label,
  type,
  value,
  onChange,
  isValid,
  placeholder,
}) => {
  const [isTouched, setIsTouched] = useState(false);

  const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
    setIsTouched(true);
  };

  const getBorderClasses = () => {
    if (isValid === undefined) {
      return 'border-gray-300 focus:border-primary-500';
    }
    return isValid || !isTouched
      ? 'border-gray-300 focus:border-primary-500'
      : 'border-secondary-500';
  };

  const getButtonClass = () => {
    return `w-full px-3 py-2 border rounded focus:outline-none ${getBorderClasses()}`;
  };

  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-gray-700 mb-2">
        {label}
      </label>
      <input
        type={type}
        id={id}
        className={getButtonClass()}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={handleBlur}
        aria-invalid={!isValid && isTouched}
        aria-describedby={`${id}-error`}
      />
      {isValid === false && isTouched && (
        <span id={`${id}-error`} className="text-secondary-500 text-sm">
          Invalid {label.toLowerCase()}
        </span>
      )}
    </div>
  );
};

export default InputField;
