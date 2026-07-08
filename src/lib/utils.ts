export function isLowercaseHex64(value: string): boolean {
  return /^[0-9a-f]{64}$/.test(value);
}

export function requirePublicEnv(name: string): string {
  const value = process.env[name];
  if (!value) return '';
  return value.trim();
}

export function createOrderId(): string {
  const random = Math.random().toString(16).slice(2);
  return `uv_${Date.now().toString(36)}_${random}`;
}

export function nowIso(): string {
  return new Date().toISOString();
}

export function safeErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  try {
    return JSON.stringify(error);
  } catch {
    return 'Unknown error';
  }
}

export function extractTransferId(result: unknown): string | undefined {
  if (!result || typeof result !== 'object') return undefined;
  const obj = result as Record<string, unknown>;
  for (const key of ['transferId', 'id', 'txId', 'transactionId']) {
    if (typeof obj[key] === 'string') return obj[key] as string;
  }
  return undefined;
}

export function extractDeliveryPending(result: unknown): boolean | undefined {
  if (!result || typeof result !== 'object') return undefined;
  const obj = result as Record<string, unknown>;
  if (typeof obj.deliveryPending === 'boolean') return obj.deliveryPending;
  if (obj.deliveryState === 'pending-delivery') return true;
  return undefined;
}

export function parseDecimalToBaseUnits(value: string, decimals: number): string {
  if (!Number.isInteger(decimals) || decimals < 0 || decimals > 36) {
    throw new Error('Invalid token decimals.');
  }

  const normalized = value.trim();
  if (!/^\d+(\.\d+)?$/.test(normalized)) {
    throw new Error('Invalid decimal amount.');
  }

  const [wholePart, fractionPart = ''] = normalized.split('.');
  if (fractionPart.length > decimals) {
    throw new Error('Amount has more fractional digits than token decimals.');
  }

  const scale = BigInt(`1${'0'.repeat(decimals)}`);
  const whole = BigInt(wholePart || '0') * scale;
  const fractionText = fractionPart.padEnd(decimals, '0') || '0';
  const fraction = BigInt(fractionText);
  return (whole + fraction).toString();
}
