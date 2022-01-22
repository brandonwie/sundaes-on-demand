import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import App from '../App';

it('order phases for happy path', async () => {
  // render app
  render(<App />);
  // add ice cream scoops and toppings
  const vanilaInput = await screen.findByRole('spinbutton', {
    name: /vanilla/i,
  });
  userEvent.clear(vanilaInput);
  userEvent.type(vanilaInput, '1');

  const chocolateInput = await screen.findByRole('spinbutton', {
    name: /chocolate/i,
  });
  userEvent.clear(chocolateInput);
  userEvent.type(chocolateInput, '2');

  const cherriesCheckbox = await screen.findByRole('checkbox', {
    name: /cherries/i,
  });
  userEvent.click(cherriesCheckbox);
  // find and click order summary button
  const orderSummaryButton = screen.getByRole('button', {
    name: /order sundae/i,
  });
  userEvent.click(orderSummaryButton);
  // check summary subtotals
  const summaryHeading = screen.getByRole('heading', { name: 'Order Summary' });
  expect(summaryHeading).toBeInTheDocument();

  const scoopsHeading = screen.getByRole('heading', {
    name: /scoops: \$6.00/i,
  });
  expect(scoopsHeading).toBeInTheDocument();

  const toppingsHeading = screen.getByRole('heading', {
    name: /toppings: \$1.50/i,
  });
  expect(toppingsHeading).toBeInTheDocument();
  // check summary option items
  expect(screen.getByText('1 Vanilla')).toBeInTheDocument();
  expect(screen.getByText('2 Chocolate')).toBeInTheDocument();
  expect(screen.getByText('Cherries')).toBeInTheDocument();

  // alternatively...
  // const optionItems = screen.getAllByRole('listitem');
  // const optionItemsText = optionItems.map((item) => item.textContent);
  // expect(optionItemsText).toEqual(['1 Vanilla', '2 Chocolate', 'Cherries']);

  // accept terms and click button
  const tcCheckbox = screen.getByRole('checkbox', {
    name: /terms and conditions/i,
  });
  userEvent.click(tcCheckbox);

  const confirmOrderButton = screen.getByRole('button', {
    name: /confirm order/i,
  });
  userEvent.click(confirmOrderButton);

  // Expect "loading" to show
  const loading = screen.getByText(/loading/i);
  expect(loading).toBeInTheDocument();

  // check confirmation page text
  // this one is async because there is a POST request to server in between summary
  //    and confirmation pages
  const thankYouHeader = await screen.findByRole('heading', {
    name: /thank you/i,
  });
  expect(thankYouHeader).toBeInTheDocument();

  // expect that loading has disappeared
  const notLoading = screen.queryByText('loading');
  expect(notLoading).not.toBeInTheDocument();

  const orderNumber = await screen.findByText(/order number/i);
  expect(orderNumber).toBeInTheDocument();

  // find and click "new order" button on confirmation page
  const newOrderButton = screen.getByRole('button', { name: /new order/i });
  userEvent.click(newOrderButton);

  // check that scoops and toppings have been reset
  const scoopsTotal = await screen.findByText('Scoops total: $0.00');
  expect(scoopsTotal).toBeInTheDocument();
  const toppingsTotal = screen.getByText('Toppings total: $0.00');
  expect(toppingsTotal).toBeInTheDocument();

  // wait for items to appear so that Testing Library doesn't get angry about stuff
  // happening after test is over
  await screen.findByRole('spinbutton', { name: 'Vanilla' });
  await screen.findByRole('checkbox', { name: 'Cherries' });
});

test('Toppings header is not on summary page if no toppings ordered', async () => {
  // render app
  render(<App />);

  // add ice cream scoops and toppings
  const vanillaInput = await screen.findByRole('spinbutton', {
    name: 'Vanilla',
  });
  userEvent.clear(vanillaInput);
  userEvent.type(vanillaInput, '1');

  const chocolateInput = screen.getByRole('spinbutton', { name: 'Chocolate' });
  userEvent.clear(chocolateInput);
  userEvent.type(chocolateInput, '2');

  // find and click order summary button
  const orderSummaryButton = screen.getByRole('button', {
    name: /order sundae/i,
  });
  userEvent.click(orderSummaryButton);

  // check headings
  const scoopsHeading = screen.getByRole('heading', { name: 'Scoops: $6.00' });
  expect(scoopsHeading).toBeInTheDocument();
  // to choose that doesn't exist, use queryBy*
  const toppingsHeading = screen.queryByRole('heading', { name: /toppings/i });
  expect(toppingsHeading).not.toBeInTheDocument();
});
