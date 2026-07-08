import type { Product, UniVoucherOrder } from '@/types/order';
import { nowIso } from '@/lib/utils';

const DEMO_STOCK: Record<string, string[]> = {
  'steam-10': [
    'STEAM-UV10-7K2M-PQ9R',
    'STEAM-UV10-4W8X-LN2C',
    'STEAM-UV10-H3J9-ZT6A',
  ],
  'google-play-10': [
    'GPLAY-UV10-Q7P2-M4LX',
    'GPLAY-UV10-Z8KA-2N9D',
    'GPLAY-UV10-C5VR-J7TH',
  ],
  'amazon-10': [
    'AMZN-UV10-KD7P-4XQ9',
    'AMZN-UV10-LM2C-8WZ4',
    'AMZN-UV10-N9TJ-6PVA',
  ],
  'netflix-15': [
    'NFLX-UV15-R8QK-2M6Z',
    'NFLX-UV15-V4CX-7N3P',
    'NFLX-UV15-J9TL-5W2A',
  ],
};

function hashLike(input: string): string {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return Math.abs(hash >>> 0).toString(16).padStart(8, '0');
}

export function hasDemoVoucherStock(productId: string): boolean {
  return Boolean(DEMO_STOCK[productId]?.length);
}

export function getDemoVoucherForOrder(order: UniVoucherOrder): string | undefined {
  const stock = DEMO_STOCK[order.productId];
  if (!stock?.length) return undefined;
  const indexSeed = parseInt(hashLike(order.id).slice(0, 6), 16);
  return stock[indexSeed % stock.length];
}

export function fulfillOrderLocally(order: UniVoucherOrder, product?: Product): UniVoucherOrder {
  const voucherCode = getDemoVoucherForOrder(order);
  const fulfilledAt = nowIso();

  if (!voucherCode) {
    return {
      ...order,
      status: 'fulfillment_pending',
      fulfillment: {
        mode: 'manual',
        note: product
          ? `No demo stock configured for ${product.name}. Fulfill this order from your supplier/admin flow.`
          : 'No demo stock configured for this product. Fulfill this order from your supplier/admin flow.',
      },
      updatedAt: fulfilledAt,
    };
  }

  return {
    ...order,
    status: 'fulfilled',
    fulfillment: {
      mode: 'demo',
      voucherCode,
      voucherHash: hashLike(`${order.id}:${voucherCode}:${order.amountBaseUnits}`),
      fulfilledAt,
      note: 'Demo local fulfillment only. For production, issue vouchers from a server-side supplier/API after payment verification.',
    },
    updatedAt: fulfilledAt,
  };
}
