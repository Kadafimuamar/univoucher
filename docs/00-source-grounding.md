# 00 — Source Grounding

Dokumen ini mencatat aturan teknis yang menjadi dasar desain UniVoucher.

## Sumber teknis yang dipakai

- Sphere SDK README: https://github.com/unicity-sphere/sphere-sdk
- Browser Quick Start: https://raw.githubusercontent.com/unicity-sphere/sphere-sdk/main/docs/QUICKSTART-BROWSER.md
- Connect Guide: https://github.com/unicity-sphere/sphere-sdk/blob/main/docs/CONNECT.md
- Connect Example: https://github.com/unicity-sphere/sphere-sdk-connect-example

## Aturan yang diterapkan

### 1. SDK package

Instalasi utama:

```bash
npm install @unicitylabs/sphere-sdk
```

Starter ini mem-pin dependency ke versi yang dipakai oleh official connect example: `0.10.2`.

### 2. Connect adalah path utama dApp

Connect memungkinkan dApp membaca balance, mengirim token, dan sign message tanpa private key keluar dari wallet.

Implikasi desain:

- Frontend tidak menyimpan mnemonic.
- dApp tidak membuat server wallet atas nama user.
- Semua operasi pembayaran user dilakukan lewat wallet approval.

### 3. Network harus testnet2

Connect handshake membawa network info. Jika dApp tidak mengirim network atau network berbeda, handshake ditolak dengan `INCOMPATIBLE_NETWORK`.

Implementasi:

```ts
network: SPHERE_NETWORKS.testnet2
```

### 4. Payment intent memakai base units dan coinId 64-hex

Pada Connect intent:

```ts
client.intent('send', {
  to: '@merchant',
  amount: '1000000',
  coinId: '<lowercase-64-hex-coin-id>'
});
```

`amount` wajib string base unit. `coinId` wajib canonical lowercase 64-hex. Jangan pakai simbol `UCT` di Connect.

### 5. wallet-api/mailbox penting untuk embedded SDK, tetapi starter ini memakai Connect

Dokumentasi SDK menjelaskan setup embedded browser wallet harus dua layer:

1. `createBrowserProviders()` untuk storage + transport + oracle.
2. `createWalletApiProviders()` untuk delivery/mailbox + token storage.

Starter ini tidak membuat embedded wallet supaya tidak memegang mnemonic user. Jika nanti ingin mode embedded wallet, ikuti dua layer tersebut, jangan hanya `createBrowserProviders()`.

### 6. Nostr/DM bukan payment rail

Messaging/nametag memakai Nostr, tetapi v2 payment delivery memakai wallet-api mailbox. Maka DM hanya opsional untuk notifikasi/support, bukan bukti pembayaran.

### 7. Accounting/invoice tidak dipakai pada MVP

Dokumentasi menyebut accounting/invoice experimental dan tidak enabled di Sphere Wallet/Connect. Karena itu MVP memakai payment intent `send` + order ledger aplikasi.
