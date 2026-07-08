# 01 — Grand Design UniVoucher

## Visi produk

UniVoucher adalah marketplace voucher digital untuk pembelian voucher game/digital goods menggunakan Sphere Wallet di jaringan Unicity testnet2.

Target MVP:

1. User membuka dApp.
2. User connect Sphere Wallet.
3. User melihat katalog voucher.
4. User memilih voucher.
5. dApp membuat order draft.
6. User menyetujui pembayaran lewat Sphere Wallet.
7. dApp menyimpan order sebagai paid/fulfillment pending.
8. Fulfillment module mengirim voucher setelah payment accepted.

## Komponen utama

```txt
User Browser
  └─ Next.js dApp
      ├─ Sphere Connect Client
      │   └─ Sphere Wallet / extension / popup
      ├─ Product Catalog
      ├─ Checkout Panel
      ├─ Agent Chat Router
      ├─ Order Ledger Adapter
      └─ Fulfillment Adapter
```

## Boundary penting

### dApp boundary

Boleh:

- Membaca identity/balance/assets via Connect query.
- Meminta `send` intent via Connect.
- Menyimpan order metadata.
- Menampilkan status order.

Tidak boleh pada MVP:

- Menyimpan mnemonic user.
- Menganggap DM sebagai bukti pembayaran.
- Mengirim `coinId: 'UCT'` pada Connect intent.
- Menggunakan accounting/invoice sebagai flow produksi.

### Wallet boundary

Wallet bertanggung jawab untuk:

- Private key custody.
- User approval.
- Payment intent execution.
- Network compatibility.

### Merchant boundary

Merchant harus punya recipient yang resolvable, misalnya nametag `@merchant`. Jika tidak resolvable, Connect dapat mengembalikan `INVALID_RECIPIENT`.

## Arsitektur proses

```txt
[Connect Wallet]
      ↓
[Read identity + assets]
      ↓
[Select product]
      ↓
[Create local order draft]
      ↓
[client.intent('send')]
      ↓
[Wallet approval]
      ↓
[Payment result]
      ↓
[Persist paid order]
      ↓
[Fulfillment pending]
      ↓
[Voucher delivered]
```

## MVP decision

Starter ini memakai **Connect-first dApp** karena paling aman untuk user wallet custody dan sesuai pedoman Connect. Embedded SDK hanya dibahas sebagai opsi lanjutan, bukan implementasi awal.
