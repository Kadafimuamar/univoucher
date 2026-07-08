# 04 — Agent Flow

## Tujuan agent MVP

Agent membantu user memilih produk dan mengeksekusi UI action yang aman. Agent tidak boleh langsung mengirim pembayaran tanpa validasi dan approval wallet.

## Command yang didukung

| Input user | Action |
|---|---|
| `show catalog` | tampilkan katalog |
| `buy steam` | pilih produk Steam pertama |
| `buy amazon` | pilih produk Amazon pertama |
| `orders` | tampilkan order history |
| `wallet status` | tampilkan instruksi cek wallet |

## Guardrail agent

1. Produk harus berasal dari `catalog.ts`.
2. Amount harus `product.priceBaseUnits`.
3. Recipient harus `NEXT_PUBLIC_UNIVOUCHER_MERCHANT_NAMETAG`.
4. CoinId harus `NEXT_PUBLIC_UNIVOUCHER_PAYMENT_COIN_ID` dan lolos regex 64-hex lowercase.
5. Payment tetap membutuhkan user approval via Sphere Wallet.

## Flow agent

```txt
User chat: "buy steam"
  ↓
parseAgentCommand()
  ↓
return { type: 'select_product', productId: 'steam-10' }
  ↓
UI membuka CheckoutPanel
  ↓
User klik Pay with Sphere
  ↓
Connect intent send
```

## Lanjutan LLM yang aman

Jika nanti memakai OpenRouter/OpenAI, gunakan LLM hanya untuk intent classification:

```json
{
  "intent": "select_product",
  "productKeyword": "steam"
}
```

Hasil LLM wajib divalidasi deterministic sebelum payment.
