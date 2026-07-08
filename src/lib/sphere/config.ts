import { isLowercaseHex64 } from '@/lib/utils';

/**
 * IMPORTANT:
 * Next.js only inlines NEXT_PUBLIC_* variables in the browser bundle when the
 * variable name is referenced directly, for example:
 *   process.env.NEXT_PUBLIC_UNIVOUCHER_PAYMENT_COIN_ID
 * Dynamic access like process.env[name] is not inlined and becomes undefined in
 * client components on Vercel production builds.
 */
export const SPHERE_WALLET_URL =
  (process.env.NEXT_PUBLIC_UNIVOUCHER_WALLET_URL || 'https://sphere.unicity.network').trim();

export const MERCHANT_NAMETAG =
  (process.env.NEXT_PUBLIC_UNIVOUCHER_MERCHANT_NAMETAG || '').trim();

export const PAYMENT_COIN_ID =
  (process.env.NEXT_PUBLIC_UNIVOUCHER_PAYMENT_COIN_ID || '').trim();

export const PAYMENT_SYMBOL =
  (process.env.NEXT_PUBLIC_UNIVOUCHER_PAYMENT_SYMBOL || 'UCT').trim();

const parsedPaymentDecimals = Number(process.env.NEXT_PUBLIC_UNIVOUCHER_PAYMENT_DECIMALS || '18');

export const PAYMENT_DECIMALS = Number.isInteger(parsedPaymentDecimals) && parsedPaymentDecimals >= 0 && parsedPaymentDecimals <= 36
  ? parsedPaymentDecimals
  : 18;

export function getPaymentConfigStatus() {
  return {
    walletUrl: SPHERE_WALLET_URL,
    merchantNametag: MERCHANT_NAMETAG,
    paymentCoinId: PAYMENT_COIN_ID,
    paymentSymbol: PAYMENT_SYMBOL,
    paymentDecimals: PAYMENT_DECIMALS,
    validCoinId: isLowercaseHex64(PAYMENT_COIN_ID),
    ready: Boolean(MERCHANT_NAMETAG) && isLowercaseHex64(PAYMENT_COIN_ID),
  };
}
