import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const requiredFiles = [
  'package.json',
  'src/app/page.tsx',
  'src/lib/sphere/useSphereConnect.ts',
  'src/lib/sphere/config.ts',
  'src/components/CheckoutPanel.tsx',
  'docs/07-audit.md',
];

const errors = [];
const warnings = [];

for (const file of requiredFiles) {
  if (!fs.existsSync(path.join(root, file))) errors.push(`Missing required file: ${file}`);
}

function readEnvFile(filename) {
  const file = path.join(root, filename);
  if (!fs.existsSync(file)) return {};
  const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/);
  const env = {};
  for (const line of lines) {
    if (!line || line.trim().startsWith('#') || !line.includes('=')) continue;
    const idx = line.indexOf('=');
    env[line.slice(0, idx).trim()] = line.slice(idx + 1).trim();
  }
  return env;
}

const env = {
  ...readEnvFile('.env.example'),
  ...readEnvFile('.env.local'),
};

const coinId = env.NEXT_PUBLIC_UNIVOUCHER_PAYMENT_COIN_ID || process.env.NEXT_PUBLIC_UNIVOUCHER_PAYMENT_COIN_ID || '';
const merchant = env.NEXT_PUBLIC_UNIVOUCHER_MERCHANT_NAMETAG || process.env.NEXT_PUBLIC_UNIVOUCHER_MERCHANT_NAMETAG || '';
const walletUrl = env.NEXT_PUBLIC_UNIVOUCHER_WALLET_URL || process.env.NEXT_PUBLIC_UNIVOUCHER_WALLET_URL || '';

if (!walletUrl) warnings.push('NEXT_PUBLIC_UNIVOUCHER_WALLET_URL is empty; default code uses https://sphere.unicity.network.');
if (!merchant || merchant === '@merchant') warnings.push('Set NEXT_PUBLIC_UNIVOUCHER_MERCHANT_NAMETAG to a real resolvable merchant nametag.');
if (!/^[0-9a-f]{64}$/.test(coinId)) warnings.push('NEXT_PUBLIC_UNIVOUCHER_PAYMENT_COIN_ID must be lowercase 64-hex. Do not use UCT symbol.');

console.log('UniVoucher preflight audit');
console.log('==========================');

if (errors.length === 0) console.log('Files: OK');
else {
  console.log('Files: FAILED');
  for (const error of errors) console.log(`- ERROR: ${error}`);
}

if (warnings.length === 0) console.log('Config: OK');
else {
  console.log('Config warnings:');
  for (const warning of warnings) console.log(`- ${warning}`);
}

if (errors.length > 0) process.exit(1);
