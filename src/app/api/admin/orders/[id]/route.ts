import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin, successResponse, errorResponse } from '@/lib/api-utils';

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const { status } = await req.json();
    const order = await prisma.order.update({
      where: { id: params.id },
      data: { status }
    });
    return successResponse(order);
  } catch (err) {
    return errorResponse('Failed to update order status', 'SERVER_ERROR', 500);
  }
}
