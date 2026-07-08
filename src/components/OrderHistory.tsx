"use client";

import { useEffect, useState } from 'react';
import type { UniVoucherOrder } from '@/types/order';
import { clearOrders, listOrders, saveOrder } from '@/lib/orderStorage';
import { fulfillOrderLocally } from '@/lib/fulfillment';
import { getProductById } from '@/lib/catalog';

export function OrderHistory() {
  const [orders, setOrders] = useState<UniVoucherOrder[]>([]);

  useEffect(() => {
    const reload = () => setOrders(listOrders());
    reload();
    window.addEventListener('univoucher:orders-changed', reload);
    return () => window.removeEventListener('univoucher:orders-changed', reload);
  }, []);

  function manualDemoFulfill(order: UniVoucherOrder) {
    const fulfilled = fulfillOrderLocally(order, getProductById(order.productId));
    saveOrder(fulfilled);
  }

  return (
    <section className="card">
      <div className="cardHeader">
        <div>
          <p className="eyebrow">Orders</p>
          <h2>Local order ledger</h2>
        </div>
        <button className="secondary" onClick={() => clearOrders()} disabled={orders.length === 0}>
          Clear
        </button>
      </div>

      {orders.length === 0 ? <p>No local orders in this browser yet.</p> : null}

      <div className="orderList">
        {orders.map((order) => (
          <article key={order.id} className="orderItem">
            <div>
              <strong>{order.productName}</strong>
              <span>{order.id}</span>
            </div>
            <div>
              <span className={`pill ${order.status === 'fulfilled' ? 'ok' : ''}`}>{order.status}</span>
              <span>{order.amountBaseUnits} {order.currencySymbol}</span>
            </div>

            {order.fulfillment?.voucherCode ? (
              <div className="voucherBox">
                <span>Your voucher code</span>
                <strong>{order.fulfillment.voucherCode}</strong>
              </div>
            ) : null}

            {order.status === 'paid' || order.status === 'fulfillment_pending' ? (
              <button className="secondary" onClick={() => manualDemoFulfill(order)}>
                Fulfill demo voucher
              </button>
            ) : null}

            {order.error ? <p className="errorText">{order.error}</p> : null}
            {order.payment?.transferId ? <p className="smallText">Transfer: {order.payment.transferId}</p> : null}
            {order.payment?.deliveryPending ? <p className="warningText">Payment accepted; recipient mailbox delivery is still pending.</p> : null}
            {order.fulfillment?.note ? <p className="smallText">{order.fulfillment.note}</p> : null}
          </article>
        ))}
      </div>
    </section>
  );
}
