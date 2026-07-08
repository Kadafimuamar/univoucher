# 07 — Technical Audit

## Confirmed issue: fulfillment stopped at pending state

Sphere Connect handles wallet-dApp operations such as reading identity/balance/assets and requesting token sends. It does not create or deliver game vouchers.

The previous starter correctly requested payment, but it never executed a UniVoucher fulfillment function after payment resolution. That is why orders remained `fulfillment_pending` and no voucher appeared.

## Fix

`CheckoutPanel` now runs:

```txt
pending_wallet_confirmation
  -> Sphere Connect send intent
  -> paid
  -> local demo fulfillment
  -> fulfilled + voucher code displayed
```

The local demo fulfillment is implemented in `src/lib/fulfillment.ts`.

## Confirmed issue: agent product matching

The previous product matcher tried to match the full input text. Example:

```txt
Input: buy steam
Product text: steam-10 Steam Voucher 10 game
```

The full string `buy steam` does not exist in product text, so it failed.

## Fix

The parser now removes action words and scores product tokens. `buy steam`, `buy google play`, `buy amazon`, and `buy netflix` now select products correctly.

## Guardrails still preserved

- `client.intent('send', { to, amount, coinId })`
- `amount` is string base units
- `coinId` is lowercase 64-hex
- testnet2 via `SPHERE_NETWORKS.testnet2`
- invoice/accounting flows are not used

## Build validation

`npm run build` passed on Next.js 15.4.10.
