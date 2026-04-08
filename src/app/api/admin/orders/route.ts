import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin, successResponse, errorResponse } from '@/lib/api-utils';

export async function GET(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  const orders = await prisma.order.findMany({
    include: {
      user: { select: { id: true, name: true, email: true } },
      items: { include: { product: true } }
    },
    orderBy: { createdAt: 'desc' }
  });

  return successResponse(orders);
}
