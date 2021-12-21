import { render, screen, fireEvent } from '@testing-library/react';
import SummaryForm from '../SummaryForm';
/*
 * Write tests to ensure that
 ** 1. Checkbox is unchecked by default
 ** 2. Checking checkbox enables button
 ** 3. Unchecking checkbox again disables button
 * A change to set up your own test file from scratch
 ** 1. Use tests from last section as a model
 ** 2. Render the <SummaryForm /> component
 * Find checkbox and button using { name } option
 ** 1. Use mockup for "name" option values
 * Check that tests fail! Red part of red-green testing.
 */

describe('Checkbox functionality', () => {
  test('Initial conditions', () => {
    render(<SummaryForm />);
    const checkbox = screen.getByRole('checkbox', {
      name: /terms and conditions/i,
    });
    expect(checkbox).not.toBeChecked();

    const button = screen.getByRole('button', { name: /confirm order/i });
    expect(button).toBeDisabled();
  });

  test('Checkbox enables button on first click and disables on second click', () => {
    render(<SummaryForm />);
    const checkbox = screen.getByRole('checkbox', {
      name: /terms and conditions/i,
    });

    fireEvent.click(checkbox);
    const button = screen.getByRole('button', { name: /confirm order/i });
    expect(button).toBeEnabled();

    fireEvent.click(checkbox);
    expect(button).toBeDisabled();
  });
});
