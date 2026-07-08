# 02 — Folder Architecture

```txt
src/
├── app/
│   ├── api/
│   │   ├── agent/route.ts        # Deterministic agent router untuk MVP
│   │   └── catalog/route.ts      # API katalog statis
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                  # Single-page UniVoucher UI
├── components/
│   ├── AgentChat.tsx             # Chat command: catalog, buy, orders, status
│   ├── CheckoutPanel.tsx         # Payment intent UI
│   ├── OrderHistory.tsx          # Local order history
│   ├── ProductCatalog.tsx        # Product cards
│   └── SphereConnectCard.tsx     # Connect/disconnect + identity/assets
├── lib/
│   ├── agent.ts                  # Deterministic command parser
│   ├── catalog.ts                # Product list + selectors
│   ├── orderStorage.ts           # localStorage order ledger adapter
│   ├── utils.ts                  # formatting + validation
│   └── sphere/
│       ├── config.ts             # wallet URL, merchant nametag, coinId
│       └── useSphereConnect.ts   # autoConnect hook
└── types/
    └── order.ts                  # Order/Product/Payment types
```

## Kenapa agent deterministic dulu?

Agar tidak melebar ke LLM/tool-calling yang belum diperlukan. MVP agent hanya menerjemahkan command user ke action UI:

- `show catalog`
- `buy steam`
- `buy amazon`
- `orders`
- `wallet status`

Jika nanti ditambah LLM, LLM hanya boleh menghasilkan intent terstruktur yang divalidasi oleh deterministic router. Jangan biarkan LLM langsung membuat payment intent tanpa validasi produk, amount, coinId, dan recipient.
