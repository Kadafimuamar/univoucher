# UniVoucher Sphere Starter

UniVoucher is a connect-first digital voucher marketplace starter for Unicity Sphere testnet2.

## v5 status

This version fixes the live Vercel demo issues:

- Vercel public env is read correctly.
- UCT amount is converted to 18-decimal base units.
- BigInt build error is fixed without changing `tsconfig`.
- Agent command matching now works for `buy steam`, `buy amazon`, `buy google play`, `buy netflix`, `orders`, and `wallet status`.
- After Sphere `send` intent resolves, the app issues a local demo voucher and marks the order as `fulfilled`.
- Existing `paid` / `fulfillment_pending` orders can be repaired with the **Fulfill demo voucher** button.
- Next.js is pinned to 15.4.10.

## Required Vercel environment variables

```env
NEXT_PUBLIC_UNIVOUCHER_WALLET_URL=https://sphere.unicity.network
NEXT_PUBLIC_UNIVOUCHER_MERCHANT_NAMETAG=@yourmerchant
NEXT_PUBLIC_UNIVOUCHER_PAYMENT_COIN_ID=f581d30f593e4b369d684a4563b5246f07b1d265f7178a2c0a82b81f39c24dc0
NEXT_PUBLIC_UNIVOUCHER_PAYMENT_SYMBOL=UCT
NEXT_PUBLIC_UNIVOUCHER_PAYMENT_DECIMALS=18
```

Do not put `UCT` in `NEXT_PUBLIC_UNIVOUCHER_PAYMENT_COIN_ID`. Sphere Connect `send` expects the canonical lowercase 64-hex coinId.

## Local commands

```bash
npm install
npm run preflight
npm run build
npm run dev
```

## Deploy to Vercel

```bash
git add .
git commit -m "fix fulfillment and agent"
git push
```

Then redeploy from Vercel. If env values were recently changed, redeploy without existing build cache.

## Important production warning

The voucher fulfillment in this starter is a demo-only local browser fulfillment so the MVP works immediately after a Sphere send approval.

For real voucher sales, move voucher issuance to a server-side API with database-backed orders, payment verification, stock locking, and supplier integration.
