import Options from './Options';
import { useOrderDetails } from '../../contexts/OrderDetails';
import { formatCurrency } from '../../utils/formatCurrency';

export default function OrderEntry() {
  const [orderDetails, updateItemCount] = useOrderDetails();
  return (
    <div>
      <Options optionType='scoops' />
      <Options optionType='toppings' />
      <h2>Grand total: {formatCurrency(orderDetails.totals.grandTotal)}</h2>
    </div>
  );
}
