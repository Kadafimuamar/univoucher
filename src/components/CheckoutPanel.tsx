"use client";

import type { Product, SphereIdentityView, UniVoucherOrder } from '@/types/order';
import { MERCHANT_NAMETAG, PAYMENT_COIN_ID } from '@/lib/sphere/config';
import { createOrderId, extractDeliveryPending, extractTransferId, isLowercaseHex64, nowIso, safeErrorMessage } from '@/lib/utils';
import { saveOrder } from '@/lib/orderStorage';
import { fulfillOrderLocally } from '@/lib/fulfillment';

export function CheckoutPanel({
  product,
  connected,
  identity,
  sendPayment,
  onOrderSaved,
}: {
  product?: Product;
  connected: boolean;
  identity?: SphereIdentityView;
  sendPayment: (params: { to: string; amount: string; coinId: string }) => Promise<unknown>;
  onOrderSaved: (order: UniVoucherOrder) => void;
}) {
  const canPay = Boolean(product && connected && MERCHANT_NAMETAG && isLowercaseHex64(PAYMENT_COIN_ID));

  async function handlePay() {
    if (!product) return;

    const startedAt = nowIso();
    const baseOrder: UniVoucherOrder = {
      id: createOrderId(),
      productId: product.id,
      productName: product.name,
      quantity: 1,
      buyerDirectAddress: identity?.directAddress,
      buyerNametag: identity?.nametag,
      merchantRecipient: MERCHANT_NAMETAG,
      network: 'testnet2',
      coinId: PAYMENT_COIN_ID,
      amountBaseUnits: product.priceBaseUnits,
      currencySymbol: product.currencySymbol,
      status: 'pending_wallet_confirmation',
      payment: {
        provider: 'sphere-connect',
        intentAction: 'send',
      },
      fulfillment: {
        mode: 'manual',
        note: 'Waiting for Sphere wallet confirmation.',
      },
      createdAt: startedAt,
      updatedAt: startedAt,
    };

    saveOrder(baseOrder);
    onOrderSaved(baseOrder);

    try {
      const result = await sendPayment({
        to: MERCHANT_NAMETAG,
        amount: product.priceBaseUnits,
        coinId: PAYMENT_COIN_ID,
      });

      const paidAt = nowIso();
      const paidOrder: UniVoucherOrder = {
        ...baseOrder,
        status: 'paid',
        payment: {
          provider: 'sphere-connect',
          intentAction: 'send',
          result,
          transferId: extractTransferId(result),
          deliveryPending: extractDeliveryPending(result),
          paidAt,
        },
        fulfillment: {
          mode: 'manual',
          note: 'Sphere send intent resolved. Fulfillment is now handled by UniVoucher.',
        },
        updatedAt: paidAt,
      };

      saveOrder(paidOrder);
      onOrderSaved(paidOrder);

      const fulfilledOrder = fulfillOrderLocally(paidOrder, product);
      saveOrder(fulfilledOrder);
      onOrderSaved(fulfilledOrder);
    } catch (error) {
      const failedAt = nowIso();
      const failedOrder: UniVoucherOrder = {
        ...baseOrder,
        status: 'failed',
        error: safeErrorMessage(error),
        fulfillment: {
          mode: 'manual',
          note: 'Payment failed or was rejected. Voucher was not issued.',
        },
        updatedAt: failedAt,
      };
      saveOrder(failedOrder);
      onOrderSaved(failedOrder);
    }
  }

  return (
    <section className="card">
      <div className="cardHeader">
        <div>
          <p className="eyebrow">Checkout</p>
          <h2>{product ? product.name : 'Select product'}</h2>
        </div>
        {product ? <span className="pill ok">{product.priceLabel}</span> : <span className="pill">No product</span>}
      </div>

      {!product ? <p>Select a voucher from the catalog or use an agent command such as <code>buy steam</code>.</p> : null}

      {product ? (
        <div className="checkoutBox">
          <p>{product.description}</p>
          <div className="grid2 smallText">
            <div>
              <strong>Recipient</strong>
              <span>{MERCHANT_NAMETAG || 'Missing merchant env'}</span>
            </div>
            <div>
              <strong>Amount base units</strong>
              <span>{product.priceBaseUnits}</span>
            </div>
            <div>
              <strong>Coin ID</strong>
              <span>{isLowercaseHex64(PAYMENT_COIN_ID) ? `${PAYMENT_COIN_ID.slice(0, 8)}…${PAYMENT_COIN_ID.slice(-8)}` : 'Invalid/missing'}</span>
            </div>
            <div>
              <strong>Network</strong>
              <span>testnet2</span>
            </div>
          </div>
          <button onClick={handlePay} disabled={!canPay}>
            Pay with Sphere
          </button>
          {!canPay ? (
            <p className="warningText">
              Payment is not ready: connect the wallet, set a merchant nametag, and use a lowercase 64-hex coinId.
            </p>
          ) : null}
          <p className="smallText">
            Demo mode: after the Sphere send intent resolves, UniVoucher issues a local demo voucher code. Production must verify payment and fulfill from a server-side supplier/API.
          </p>
        </div>
      ) : null}
    </section>
  );
}
