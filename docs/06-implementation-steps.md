# 06 — Implementation Steps

## Step 1 — Install

```bash
npm install
```

## Step 2 — Configure env

```bash
cp .env.example .env.local
```

Isi:

```bash
NEXT_PUBLIC_UNIVOUCHER_WALLET_URL=https://sphere.unicity.network
NEXT_PUBLIC_UNIVOUCHER_MERCHANT_NAMETAG=@merchant
NEXT_PUBLIC_UNIVOUCHER_PAYMENT_COIN_ID=<lowercase-64-hex-coin-id>
```

## Step 3 — Preflight audit

```bash
npm run preflight
```

Preflight mengecek format env dan file inti. Ini bukan pengganti test integrasi wallet.

## Step 4 — Run dev server

```bash
npm run dev
```

## Step 5 — Connect wallet

Klik **Connect Sphere Wallet**.

Kemungkinan flow:

- Jika extension ada, autoConnect memakai extension.
- Jika tidak, autoConnect memakai popup Sphere Wallet.

## Step 6 — Cek katalog

Gunakan UI katalog atau chat command:

```txt
show catalog
```

## Step 7 — Checkout

Klik produk, lalu **Pay with Sphere**.

Wallet harus membuka approval untuk intent `send`.

## Step 8 — Fulfillment

MVP menyimpan order sebagai `fulfillment_pending`. Pengiriman voucher real sengaja belum dibuat karena butuh supplier API/secret dan server ledger produksi.

## Step 9 — Produksi

Sebelum produksi:

1. Tambah database order.
2. Tambah server-side reconciliation.
3. Tambah admin fulfillment.
4. Tambah supplier API.
5. Enkripsi voucher code sebelum disimpan.
6. Tambah monitoring untuk failed order.
