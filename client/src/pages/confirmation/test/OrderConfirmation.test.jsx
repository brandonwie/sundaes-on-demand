import { rest } from 'msw';

import { server } from '../../../mocks/server';
import { screen, render } from '../../../test-utils/testing-library-utils';
import OrderConfirmation from '../OrderConfirmation';

test('confirm loading text', async () => {
  render(<OrderConfirmation setOrderPhase={jest.fn()} />);
  const loading = screen.getByText('Loading');
  expect(loading).toBeInTheDocument();
});

test('error response from server for submitting order', async () => {
  // override default msw response for options endpoint with error response
  server.resetHandlers(
    rest.post('http://localhost:3030/order', (req, res, ctx) =>
      res(ctx.status(500))
    )
  );

  render(<OrderConfirmation />);

  const alert = await screen.findByRole('alert');
  expect(alert).toHaveTextContent(
    'An unexpected error occurred. Please try again later.'
  );
});
