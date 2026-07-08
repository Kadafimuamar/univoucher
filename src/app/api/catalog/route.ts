import { NextResponse } from 'next/server';
import { getActiveProducts } from '@/lib/catalog';

export async function GET() {
  return NextResponse.json({ products: getActiveProducts() });
}
