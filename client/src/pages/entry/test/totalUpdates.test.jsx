import userEvent from '@testing-library/user-event';

import { render, screen } from '../../../test-utils/testing-library-utils';
import Options from '../Options';
import OrderEntry from '../OrderEntry';

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

it('assert on default toppings subtotal', async () => {
  render(<Options optionType={'toppings'} />);
  // Assert on default toppins subtotal
  const toppingsTotal = screen.getByText('Toppings total: $', {
    exact: false,
  });
  expect(toppingsTotal).toHaveTextContent('0.00');
  // Find and tick on box, assert on updated subtotal
  // see src/mocks/handlers.js for server response
  // use await and find for checkbox (async)
  const cherriesCheckbox = await screen.findByRole('checkbox', {
    name: 'Cherries',
  });
  userEvent.click(cherriesCheckbox);
  expect(toppingsTotal).toHaveTextContent('1.50');
  // Tick another box on, assert on subtotal
  // Make sure code can handle two simultaneous boxes
  const mAndMsCheckbox = await screen.findByRole('checkbox', { name: 'M&Ms' });
  userEvent.click(mAndMsCheckbox);
  expect(toppingsTotal).toHaveTextContent('3.00');

  const hotFudgeCheckbox = await screen.findByRole('checkbox', {
    name: 'Hot fudge',
  });
  userEvent.click(hotFudgeCheckbox);
  expect(toppingsTotal).toHaveTextContent('4.50');
  // Tick one of the boxes off (click it again) and assert on subtotal
  // make sure code can handle box checked then un-checked
  // remvoe hot fudge and check subtotal
  userEvent.click(hotFudgeCheckbox);
  expect(toppingsTotal).toHaveTextContent('3.00');
});

describe('grand total', () => {
  it('grand total updates properly if scoop is added first', async () => {
    render(<OrderEntry />);
    const grandTotal = screen.getByRole('heading', {
      name: /grand total: \$/i,
    });
    // check if the initial grandTotal value is 0
    expect(grandTotal).toHaveTextContent('0.00');

    const vanillaScoop = await screen.findByRole('spinbutton', {
      name: 'Vanilla',
    });
    userEvent.type(vanillaScoop, '1');

    expect(grandTotal).toHaveTextContent('2.00');
  });
  it('grand total updates properly if topping is added first', async () => {
    render(<OrderEntry />);
    const cherriesTopping = await screen.findByRole('checkbox', {
      name: /cherries/i,
    });
    userEvent.click(cherriesTopping);
    const grandTotal = screen.getByText(/grand total:/i, { exact: false });
    expect(grandTotal).toHaveTextContent('1.50');
  });
  it('grand total updates properly if item is removed', async () => {
    render(<OrderEntry />);
    const chocolateScoop = await screen.findByRole('spinbutton', {
      name: /chocolate/i,
    });
    userEvent.clear(chocolateScoop);
    userEvent.type(chocolateScoop, '2');
    const grandTotal = screen.getByText('Grand Total:', { exact: false });
    expect(grandTotal).toHaveTextContent('4.00');
    userEvent.clear(chocolateScoop);
    userEvent.type(chocolateScoop, '0');
    expect(grandTotal).toHaveTextContent('0.00');
  });
});
