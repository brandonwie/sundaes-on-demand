import { useState } from 'react';
import Container from 'react-bootstrap/Container';

import OrderConfirmation from './pages/confirmation/OrderConfirmation';
import OrderEntry from './pages/entry/OrderEntry';
import OrderSummary from './pages/summary/OrderSummary';
import { OrderDetailsProvider } from './contexts/OrderDetails';

function App() {
  const [orderPhase, setOrderPhase] = useState('inProgress');

  let Component = OrderEntry;
  switch (orderPhase) {
    case 'inProgress':
      Component = OrderEntry;
      break;
    case 'completed':
      Component = OrderConfirmation;
      break;
    case 'review':
      Component = OrderSummary;
      break;
    default:
      return;
  }
  return (
    <OrderDetailsProvider>
      <Container>{<Component setOrderPhase={setOrderPhase} />}</Container>
    </OrderDetailsProvider>
  );
}

export default App;
