import OrderList from './OrderList';

export default function Deliveries() {
  return <OrderList storageKey="deliveries" referencePrefix="WH/OUT/" title="Delivery" icon="📤" />;
}
