import type { UniVoucherOrder } from '@/types/order';

const ORDER_STORAGE_KEY = 'univoucher.orders.v1';

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

export function listOrders(): UniVoucherOrder[] {
  if (!isBrowser()) return [];
  const raw = window.localStorage.getItem(ORDER_STORAGE_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as UniVoucherOrder[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveOrder(order: UniVoucherOrder): UniVoucherOrder[] {
  if (!isBrowser()) return [];
  const existing = listOrders().filter((item) => item.id !== order.id);
  const next = [order, ...existing];
  window.localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(new Event('univoucher:orders-changed'));
  return next;
}

export function clearOrders(): void {
  if (!isBrowser()) return;
  window.localStorage.removeItem(ORDER_STORAGE_KEY);
  window.dispatchEvent(new Event('univoucher:orders-changed'));
}
