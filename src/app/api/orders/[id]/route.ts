import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, successResponse, errorResponse } from '@/lib/api-utils';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { error, session } = await requireAuth();
  if (error) return error;

  const userId = (session!.user as any).id;
  const userRole = (session!.user as any).role;

  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: { items: { include: { product: true } } },
  });

  if (!order) {
    return errorResponse('Order not found', 'NOT_FOUND', 404);
  }

  // Only allow user who placed order or admin to view
  if (order.userId !== userId && userRole !== 'admin') {
    return errorResponse('Forbidden', 'FORBIDDEN', 403);
  }

  return successResponse(order);
}
