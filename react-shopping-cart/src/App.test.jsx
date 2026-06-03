import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

describe('React Shopping Cart Assessment Tests', () => {
  let consoleErrorSpy;

  beforeEach(() => {
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  test('Task 1: Quantity boundary check - decrementing when quantity is 1 does not go below 1', () => {
    render(<App />);
    const decreaseBtn = screen.getByRole('button', { name: /Decrease quantity of Wireless Headphones/i });
    const quantitySpan = screen.getByText('1');

    // Decrement from 1
    fireEvent.click(decreaseBtn);
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(quantitySpan.textContent).toBe('1');
  });

  test('Task 2: Correct subtotal and tax calculations', () => {
    render(<App />);
    
    // Initial:
    // Wireless Headphones (1 * 99.99) = 99.99
    // Smart Watch (2 * 199.99) = 399.98
    // USB-C Cable (5 * 15.00) = 75.00
    // Total subtotal should be: 574.97
    const subtotal = screen.getByText(/\$574\.97/);
    expect(subtotal).toBeInTheDocument();

    // Tax should be 8% of 574.97 = 45.9976 -> $46.00
    const tax = screen.getByText(/\$46\.00/);
    expect(tax).toBeInTheDocument();

    // Total should be 574.97 + 46.00 = 620.97
    const total = screen.getByText(/\$620\.97/);
    expect(total).toBeInTheDocument();
  });

  test('Task 3: React key console warning check', () => {
    render(<App />);
    // Check if warning about missing key is thrown
    const keyWarning = consoleErrorSpy.mock.calls.some((call) =>
      call[0].includes('Each child in a list should have a unique')
    );
    expect(keyWarning).toBe(true);
  });

  test('Task 4: Promo code application and validations', () => {
    render(<App />);

    const promoInput = screen.getByPlaceholderText(/Promo Code/i);
    const applyBtn = screen.getByRole('button', { name: /Apply Promo/i });

    // Submit invalid code
    fireEvent.change(promoInput, { target: { value: 'INVALID' } });
    fireEvent.click(applyBtn);
    expect(screen.getByText(/Promo code invalid/i)).toBeInTheDocument();

    // Submit BEE10 (Valid code)
    fireEvent.change(promoInput, { target: { value: 'BEE10' } });
    fireEvent.click(applyBtn);
    expect(screen.queryByText(/Promo code invalid/i)).not.toBeInTheDocument();

    // Subtotal: 574.97
    // Discount: 10% of 574.97 = 57.50
    // Taxable amount: 574.97 - 57.50 = 517.47
    // Tax: 8% of 517.47 = 41.40
    // Total: 517.47 + 41.40 = 558.87
    expect(screen.getByText(/\$57\.50/)).toBeInTheDocument(); // Discount element
    expect(screen.getByText(/\$41\.40/)).toBeInTheDocument(); // Tax element
    expect(screen.getByText(/\$558\.87/)).toBeInTheDocument(); // Total element

    // Submit empty code (should clear discount and error)
    fireEvent.change(promoInput, { target: { value: '' } });
    fireEvent.click(applyBtn);
    expect(screen.queryByText(/Promo code invalid/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/\$57\.50/)).not.toBeInTheDocument();
  });
});
