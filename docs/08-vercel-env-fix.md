# Vercel Environment Variable Fix

If Vercel Environment Variables are set but the browser still shows:

- Merchant: Missing env
- Coin ID valid: No

then the issue is usually not Vercel. It is the Next.js build-time inlining rule.

Do not read public client env vars dynamically:

```ts
const name = 'NEXT_PUBLIC_UNIVOUCHER_PAYMENT_COIN_ID';
process.env[name]; // wrong in client bundle
```

Use direct references:

```ts
process.env.NEXT_PUBLIC_UNIVOUCHER_PAYMENT_COIN_ID; // correct
```

After changing env values in Vercel, redeploy without existing build cache.
