import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Dashboard from './Dashboard';

describe('React User Dashboard Assessment Tests', () => {
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  test('Task 1: No infinite render loop in User Fetching', () => {
    render(<Dashboard />);
    
    // Check if Maximum update depth exceeded error was triggered in console
    const loopDetected = consoleErrorSpy.mock.calls.some((call) =>
      call[0].includes('Maximum update depth exceeded')
    );
    expect(loopDetected).toBe(false);
    expect(screen.getByText('Alice Smith')).toBeInTheDocument();
  });

  test('Task 2: Case-insensitive search filtering', () => {
    render(<Dashboard />);
    const searchInput = screen.getByPlaceholderText(/Search by name\.\.\./i);

    // Search with lower case 'alice'
    fireEvent.change(searchInput, { target: { value: 'alice' } });
    expect(screen.getByText('Alice Smith')).toBeInTheDocument();
    expect(screen.queryByText('Bob Jones')).not.toBeInTheDocument();

    // Search with upper case 'BOB'
    fireEvent.change(searchInput, { target: { value: 'BOB' } });
    expect(screen.getByText('Bob Jones')).toBeInTheDocument();
    expect(screen.queryByText('Alice Smith')).not.toBeInTheDocument();
  });

  test('Task 3: Validation on Email Save format', () => {
    render(<Dashboard />);
    const editBtns = screen.getAllByRole('button', { name: /Edit Email/i });
    
    // Click edit on Alice
    fireEvent.click(editBtns[0]);

    const emailInput = screen.getByValue('alice@example.com');
    const saveBtn = screen.getByRole('button', { name: /Save/i });

    // Type invalid email
    fireEvent.change(emailInput, { target: { value: 'invalid-email-string' } });
    fireEvent.click(saveBtn);

    // Expect validation message and dialog to remain open
    expect(screen.getByText(/Invalid email address/i)).toBeInTheDocument();
    expect(screen.getByText('Edit Email for Alice Smith')).toBeInTheDocument();

    // Type valid email
    fireEvent.change(emailInput, { target: { value: 'new_alice@example.com' } });
    fireEvent.click(saveBtn);

    // Expect edit form to be closed, and updated email to display in the list
    expect(screen.queryByText('Edit Email for Alice Smith')).not.toBeInTheDocument();
    expect(screen.getByText('new_alice@example.com')).toBeInTheDocument();
  });

  test('Task 4: Empty state UI representation when no matches are found', () => {
    render(<Dashboard />);
    const searchInput = screen.getByPlaceholderText(/Search by name\.\.\./i);

    // Search for non-existent name
    fireEvent.change(searchInput, { target: { value: 'Unknown Person' } });
    
    expect(screen.getByText(/No users found matching that search/i)).toBeInTheDocument();
    expect(screen.queryByText('Alice Smith')).not.toBeInTheDocument();
  });
});
