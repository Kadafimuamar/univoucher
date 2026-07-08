import { findProductByKeyword, getActiveProducts } from '@/lib/catalog';

export type AgentAction =
  | { type: 'show_catalog'; message: string }
  | { type: 'select_product'; productId: string; message: string }
  | { type: 'show_orders'; message: string }
  | { type: 'wallet_status'; message: string }
  | { type: 'help'; message: string };

const HELP_MESSAGE = 'Try: show catalog, buy steam, buy google play, buy amazon, buy netflix, orders, or wallet status.';

export function parseAgentCommand(input: string): AgentAction {
  const text = input.trim().toLowerCase();

  if (!text) {
    return { type: 'help', message: HELP_MESSAGE };
  }

  if (/(orders|order history|history|riwayat)/.test(text)) {
    return { type: 'show_orders', message: 'Opening your local order ledger.' };
  }

  if (/(wallet|balance|saldo|status|address|nametag)/.test(text)) {
    return { type: 'wallet_status', message: 'Wallet details are shown in the Sphere Connect card above. Use Refresh after a payment.' };
  }

  const asksToBuy = /(buy|beli|purchase|checkout|pay|order)/.test(text);
  const product = findProductByKeyword(text);

  if (asksToBuy && product) {
    return {
      type: 'select_product',
      productId: product.id,
      message: `${product.name} selected. Review the checkout panel, then click Pay with Sphere.`,
    };
  }

  if (asksToBuy && !product) {
    return {
      type: 'show_catalog',
      message: 'I could not match a product from that request. Opening the active catalog.',
    };
  }

  if (/(catalog|katalog|produk|products|voucher|list|show)/.test(text)) {
    return {
      type: 'show_catalog',
      message: `${getActiveProducts().length} active products are available. Select one or type buy steam / buy amazon.`,
    };
  }

  if (product) {
    return {
      type: 'select_product',
      productId: product.id,
      message: `${product.name} selected. Review the checkout panel, then click Pay with Sphere.`,
    };
  }

  return {
    type: 'help',
    message: HELP_MESSAGE,
  };
}
