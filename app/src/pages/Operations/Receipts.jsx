import OrderList from './OrderList';

export default function Receipts() {
  return <OrderList storageKey="receipts" referencePrefix="WH/IN/" title="Receipt" icon="📥" />;
}
