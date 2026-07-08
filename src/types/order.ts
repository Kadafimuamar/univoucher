export type ProductCategory = 'game' | 'shopping' | 'streaming';

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  description: string;
  priceLabel: string;
  priceBaseUnits: string;
  currencySymbol: string;
  active: boolean;
}

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
    mode: 'manual' | 'api' | 'dm' | 'demo';
    voucherCode?: string;
    voucherHash?: string;
    fulfilledAt?: string;
    note?: string;
  };
  error?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SphereIdentityView {
  directAddress?: string;
  nametag?: string;
  chainPubkey?: string;
}

export interface SphereConnectState {
  connected: boolean;
  connecting: boolean;
  error?: string;
  identity?: SphereIdentityView;
  balance?: unknown;
  assets?: unknown;
}
