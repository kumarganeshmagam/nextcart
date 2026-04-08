import { getServerSession } from 'next-auth';
import { authOptions } from './auth';
import { NextResponse } from 'next/server';

export async function getSession() {
  return getServerSession(authOptions);
}

export async function requireAuth() {
  const session = await getSession();
  if (!session?.user) {
    return { error: NextResponse.json({ error: 'Unauthorized', code: 'UNAUTHORIZED' }, { status: 401 }), session: null };
  }
  return { error: null, session };
}

export async function requireAdmin() {
  const session = await getSession();
  if (!session?.user) {
    return { error: NextResponse.json({ error: 'Unauthorized', code: 'UNAUTHORIZED' }, { status: 401 }), session: null };
  }
  if ((session.user as { role: string }).role !== 'admin') {
    return { error: NextResponse.json({ error: 'Forbidden', code: 'FORBIDDEN' }, { status: 403 }), session: null };
  }
  return { error: null, session };
}

export function successResponse<T>(data: T, meta?: { total: number; page: number; limit: number }) {
  return NextResponse.json({ data, ...(meta ? { meta } : {}) });
}

export function errorResponse(message: string, code: string, status: number) {
  return NextResponse.json({ error: message, code }, { status });
}
