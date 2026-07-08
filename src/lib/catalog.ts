import type { Product } from '@/types/order';
import { PAYMENT_DECIMALS, PAYMENT_SYMBOL } from '@/lib/sphere/config';
import { parseDecimalToBaseUnits } from '@/lib/utils';

function pricedProduct(input: Omit<Product, 'priceLabel' | 'priceBaseUnits' | 'currencySymbol'> & { price: string }): Product {
  return {
    ...input,
    priceLabel: `${input.price} ${PAYMENT_SYMBOL}`,
    priceBaseUnits: parseDecimalToBaseUnits(input.price, PAYMENT_DECIMALS),
    currencySymbol: PAYMENT_SYMBOL,
  };
}

export const PRODUCTS: Product[] = [
  pricedProduct({
    id: 'steam-10',
    name: 'Steam Voucher 10',
    category: 'game',
    description: 'Digital Steam wallet voucher. Demo fulfillment after Sphere payment approval.',
    price: '10',
    active: true,
  }),
  pricedProduct({
    id: 'google-play-10',
    name: 'Google Play Voucher 10',
    category: 'game',
    description: 'Google Play voucher for games/apps. Demo fulfillment after Sphere payment approval.',
    price: '10',
    active: true,
  }),
  pricedProduct({
    id: 'amazon-10',
    name: 'Amazon Gift Card 10',
    category: 'shopping',
    description: 'Amazon digital gift card. Demo fulfillment after Sphere payment approval.',
    price: '10',
    active: true,
  }),
  pricedProduct({
    id: 'netflix-15',
    name: 'Netflix Voucher 15',
    category: 'streaming',
    description: 'Netflix digital voucher. Demo fulfillment after Sphere payment approval.',
    price: '15',
    active: true,
  }),
];

export function getActiveProducts(): Product[] {
  return PRODUCTS.filter((product) => product.active);
}

export function getProductById(productId: string): Product | undefined {
  return PRODUCTS.find((product) => product.id === productId && product.active);
}

function normalizeKeyword(input: string): string {
  return input
    .toLowerCase()
    .replace(/\b(buy|beli|purchase|checkout|pay|order|voucher|gift|card|please|tolong|mau|want|show|catalog|produk|product)\b/g, ' ')
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function productSearchText(product: Product): string {
  return [product.id, product.name, product.category, product.description]
    .join(' ')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ');
}

export function findProductByKeyword(input: string): Product | undefined {
  const normalized = normalizeKeyword(input);
  const tokens = normalized.split(' ').filter(Boolean);
  const products = getActiveProducts();

  if (tokens.length === 0) return undefined;

  let best: { product: Product; score: number } | undefined;
  for (const product of products) {
    const text = productSearchText(product);
    const score = tokens.reduce((total, token) => total + (text.includes(token) ? 1 : 0), 0);
    if (score > 0 && (!best || score > best.score)) {
      best = { product, score };
    }
  }

  return best?.product;
}
