# 03 — Payment and Fulfillment Flow

## Sphere payment flow

```txt
User selects product
  ↓
CheckoutPanel validates:
  - Sphere wallet connected
  - merchant nametag exists
  - coinId is lowercase 64-hex
  - amount is base-units string
  ↓
client.intent('send', {
  to: merchantNametag,
  amount: product.priceBaseUnits,
  coinId: paymentCoinId
})
  ↓
Sphere Wallet displays approval UI
  ↓
User approves or rejects
```

## UniVoucher fulfillment flow in this starter

Sphere Connect only handles the wallet operation. Voucher delivery belongs to UniVoucher.

For the current Vercel MVP, fulfillment is intentionally local demo fulfillment:

```txt
pending_wallet_confirmation
  ↓
Sphere send intent resolves
  ↓
paid
  ↓
fulfillOrderLocally(order)
  ↓
fulfilled + voucher code visible in Local order ledger
```

Existing old orders in `paid` or `fulfillment_pending` can be repaired by clicking **Fulfill demo voucher** in the order ledger.

## Why not invoice/accounting?

Accounting/invoice intents are defined in the Connect protocol but are experimental and not enabled in Sphere Wallet/Connect. They are not used in this starter.

## Error handling

| Error / condition | UI action |
|---|---|
| user rejects wallet popup | order becomes `failed`; no voucher issued |
| insufficient balance | order becomes `failed`; show wallet error |
| invalid merchant nametag | checkout should fail; no voucher issued |
| invalid coinId | payment button disabled |
| network mismatch | connection fails; user must use Sphere testnet2 |
| `deliveryPending` | not treated as payment failure; warning is displayed |

## Production requirement

Do not keep real voucher stock in browser code. For production, replace demo fulfillment with a server-side supplier/API flow after server-side payment verification.
