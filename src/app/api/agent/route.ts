import { NextRequest, NextResponse } from 'next/server';
import { parseAgentCommand } from '@/lib/agent';

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => ({}))) as { message?: string };
  const action = parseAgentCommand(body.message || '');
  return NextResponse.json({ action });
}
