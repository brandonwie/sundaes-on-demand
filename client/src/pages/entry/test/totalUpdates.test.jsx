import userEvent from '@testing-library/user-event';

import { render, screen } from '../../../test-utils/testing-library-utils';
import Options from '../Options';

it('update scoop subtotal when scoops change', async () => {
  render(<Options optionType={'scoops'} />);

  // make sure total starts out $0.00
  const scoopsSubtotal = screen.getByText('Scoops total: $', {
    exact: false,
  });
  expect(scoopsSubtotal).toHaveTextContent('0.00');

  // update vanilla scoops to 1 and check the subtotal
  const vanillaInput = await screen.findByRole('spinbutton', {
    name: 'Vanilla',
  });
  userEvent.clear(vanillaInput);
  userEvent.type(vanillaInput, '1');
  expect(scoopsSubtotal).toHaveTextContent('2.00');

  // update chocolate scoops to 2 and check the subtotal
  const chocolateInput = await screen.findByRole('spinbutton', {
    name: 'Chocolate',
  });
  userEvent.clear(chocolateInput);
  userEvent.type(chocolateInput, '2');
  expect(scoopsSubtotal).toHaveTextContent('6.00');
});

// write tests for toppings subtotal
describe('toppings subtotal', () => {
  test('assert on default toppings subtotal', async () => {
    render(<Options optionType={'toppings'} />);
    const toppingsSubtotal = screen.getByText('Toppings total: $', {
      exact: false,
    });
    expect(toppingsSubtotal).toHaveTextContent('0.00');
  });
});
// Assert on default toppins subtotal

// Find and tick on box, assert on updated subtotal
// see src/mocks/handlers.js for server response
// use await and find for checkbox (async)

// Tick another box on, assert on subtotal
// Make sure code can handle two simultaneous boxes

// Tick one of the boxes off (click it again) and assert on subtotal
// make sure code can handle box checked then un-checked
