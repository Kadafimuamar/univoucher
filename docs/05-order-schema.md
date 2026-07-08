# 05 — Order Schema

## Product

```ts
export interface Product {
  id: string;
  name: string;
  category: 'game' | 'shopping' | 'streaming';
  description: string;
  priceLabel: string;
  priceBaseUnits: string;
  currencySymbol: string;
  active: boolean;
}
```

## Order

```ts
export type OrderStatus =
  | 'draft'
  | 'pending_wallet_confirmation'
  | 'paid'
  | 'fulfillment_pending'
  | 'fulfilled'
  | 'cancelled'
  | 'failed';

export interface UniVoucherOrder {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  buyerDirectAddress?: string;
  buyerNametag?: string;
  merchantRecipient: string;
  network: 'testnet2';
  coinId: string;
  amountBaseUnits: string;
  currencySymbol: string;
  status: OrderStatus;
  payment?: {
    provider: 'sphere-connect';
    intentAction: 'send';
    result?: unknown;
    transferId?: string;
    deliveryPending?: boolean;
    paidAt?: string;
  };
  fulfillment?: {
    mode: 'manual' | 'api' | 'dm';
    voucherCode?: string;
    voucherHash?: string;
    fulfilledAt?: string;
  };
  error?: string;
  createdAt: string;
  updatedAt: string;
}
```

## Status transition

```txt
draft
  → pending_wallet_confirmation
  → paid
  → fulfillment_pending
  → fulfilled
```

Failure paths:

```txt
pending_wallet_confirmation → cancelled  // user rejected
pending_wallet_confirmation → failed     // transfer failed
paid/fulfillment_pending → failed        // fulfilment failure requiring manual review
```

## Produksi

Untuk produksi, order harus disimpan di database server, bukan hanya `localStorage`. Kolom minimal:

- `order_id`
- `buyer_direct_address`
- `buyer_nametag`
- `product_id`
- `amount_base_units`
- `coin_id`
- `merchant_recipient`
- `network`
- `status`
- `wallet_result_json`
- `voucher_hash`
- `created_at`
- `updated_at`
