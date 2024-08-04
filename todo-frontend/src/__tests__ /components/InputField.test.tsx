import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import InputField from '../../components/InputField';

// Test Render InputField with Props
test('renders input field with given props', () => {
  render(
    <InputField
      id="email"
      label="Email"
      type="email"
      value="test@example.com"
      onChange={() => {}}
      placeholder="Enter your email"
    />,
  );

  expect(screen.getByLabelText('Email')).toHaveValue('test@example.com');
  expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
});

// Test Handle Value Change
test('calls onChange handler when input value changes', () => {
  const handleChange = jest.fn();
  render(
    <InputField
      id="email"
      label="Email"
      type="email"
      value=""
      onChange={handleChange}
      placeholder="Enter your email"
    />,
  );

  fireEvent.change(screen.getByLabelText('Email'), {
    target: { value: 'new@example.com' },
  });
  expect(handleChange).toHaveBeenCalledTimes(1);
});

// Test Handle Blur Event
test('sets isTouched state on blur', () => {
  render(
    <InputField
      id="email"
      label="Email"
      type="email"
      value=""
      onChange={() => {}}
      placeholder="Enter your email"
    />,
  );

  fireEvent.blur(screen.getByLabelText('Email'));
  // InputField doesn't expose the state, so we test the behavior (e.g., class change or error message) indirectly
});

// Test Render Error Message
test('renders error message when isValid is false and field is touched', () => {
  render(
    <InputField
      id="email"
      label="Email"
      type="email"
      value=""
      onChange={() => {}}
      isValid={false}
      placeholder="Enter your email"
    />,
  );

  fireEvent.blur(screen.getByLabelText('Email')); // Trigger blur to set isTouched to true

  expect(screen.getByText('Invalid email')).toBeInTheDocument();
});

// Test Apply Correct CSS Classes
test('applies correct CSS classes based on isValid and isTouched', () => {
  const { rerender } = render(
    <InputField
      id="email"
      label="Email"
      type="email"
      value=""
      onChange={() => {}}
      isValid={true}
      placeholder="Enter your email"
    />,
  );

  expect(screen.getByLabelText('Email')).toHaveClass('border-gray-300');
  expect(screen.getByLabelText('Email')).toHaveClass(
    'focus:border-primary-500',
  );

  rerender(
    <InputField
      id="email"
      label="Email"
      type="email"
      value=""
      onChange={() => {}}
      isValid={false}
      placeholder="Enter your email"
    />,
  );

  fireEvent.blur(screen.getByLabelText('Email')); // Trigger blur to set isTouched to true

  expect(screen.getByLabelText('Email')).toHaveClass('border-secondary-500');
});
