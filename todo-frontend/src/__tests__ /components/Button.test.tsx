import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Button from '../../components/Button';

// Test Render Button with Text
test('renders button with text', () => {
  render(<Button text="Click me" type="button" />);
  expect(screen.getByText('Click me')).toBeInTheDocument();
});

// Test Handle Click Event
test('calls onClick handler when clicked', () => {
  const handleClick = jest.fn();
  render(<Button text="Click me" type="button" onClick={handleClick} />);

  fireEvent.click(screen.getByText('Click me'));
  expect(handleClick).toHaveBeenCalledTimes(1);
});

// Test Render Disabled Button
test('renders disabled button', () => {
  render(<Button text="Click me" type="button" isDisabled />);

  const button = screen.getByText('Click me');
  expect(button).toBeDisabled();
  expect(button).toHaveClass('opacity-65');
});

// Test Render Loading Button
test('renders loading button', () => {
  render(<Button text="Click me" type="button" isLoading />);

  const button = screen.getByText('...');
  expect(button).toBeInTheDocument();
  expect(button).toBeDisabled(); // Ensure it's also disabled
  expect(button).toHaveClass('opacity-65');
});

// Test Correct Button Type
test('sets correct button type', () => {
  const { rerender } = render(<Button text="Submit" type="submit" />);
  expect(screen.getByText('Submit')).toHaveAttribute('type', 'submit');

  rerender(<Button text="Reset" type="reset" />);
  expect(screen.getByText('Reset')).toHaveAttribute('type', 'reset');
});
