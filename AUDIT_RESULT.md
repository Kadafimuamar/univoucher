# UniVoucher v5 Audit Result

Date: 2026-07-08

## Root cause confirmed from live screenshot

The Vercel deploy, Sphere Connect session, merchant env, and coinId validation are now working.

The remaining failures were application-layer issues, not Sphere Connect issues:

1. **Voucher never appeared after `fulfillment_pending`**
   - The previous starter stopped after `client.intent('send', ...)` resolved.
   - It saved the order as `fulfillment_pending` but did not run any UniVoucher fulfillment code.
   - Sphere Connect is only the wallet-dApp protocol for wallet actions. It does not issue game vouchers.

2. **UniVoucher assistant did not select products**
   - The old matcher compared the full string `buy steam` against product fields like `steam-10` and `Steam Voucher 10`.
   - Because `steam-10` does not contain the exact substring `buy steam`, the agent fell back to catalog instead of selecting Steam.

3. **Production env/coinId/amount fixes from previous versions remain preserved**
   - Env reads use direct `process.env.NEXT_PUBLIC_*` access so Vercel inlines them into the browser bundle.
   - UCT amount uses 18 decimals, so 10 UCT becomes `10000000000000000000` base units.
   - BigInt literal syntax was removed to support the existing TS target.

4. **Next.js security warning addressed within the same release line**
   - Next.js upgraded from 15.4.8 to 15.4.10.

## v5 changes

- Added `src/lib/fulfillment.ts`.
- Payment success now performs this sequence:
  1. create order as `pending_wallet_confirmation`
  2. call Sphere Connect `send`
  3. mark order as `paid`
  4. issue local demo voucher and mark order as `fulfilled`
- Order history now displays voucher code when fulfilled.
- Existing `paid` or `fulfillment_pending` orders can be repaired with a **Fulfill demo voucher** button.
- Agent parser now strips action words and matches product tokens, so these work:
  - `buy steam`
  - `buy google play`
  - `buy amazon`
  - `buy netflix`
  - `orders`
  - `wallet status`
- Agent messages changed to English-only.

## Build result

Command executed:

```bash
npm install
npm run build
```

Result:

```txt
Next.js 15.4.10
Compiled successfully
Linting and checking validity of types: passed
Generating static pages: passed
```

## Remaining production limitation

The new fulfillment is **demo local fulfillment**. It is intentionally client-side so your current Vercel demo works immediately.

For real voucher sales, do not keep voucher stock in the browser. The production version must add:

- server-side order database
- server-side payment verification
- server-side supplier/voucher API
- one-time voucher redemption/stock locking
- admin fulfillment dashboard

## Sphere-grounded technical rule

This patch does not change the Sphere payment contract:

```ts
client.intent('send', {
  to: merchantNametag,
  amount: product.priceBaseUnits,
  coinId: paymentCoinId,
});
```

`amount` remains base units as a string, and `coinId` remains canonical lowercase 64-hex.


## v6 install audit

- Fixed package-lock resolved tarball URLs so they point to public npm registry, not the internal sandbox registry.
- Added .npmrc with `registry=https://registry.npmjs.org/`.
- ZIP excludes `node_modules`. If Windows has EPERM cleanup warnings, delete `node_modules` after closing VS Code/Next/npm processes, then run `npm ci` or `npm install`.
