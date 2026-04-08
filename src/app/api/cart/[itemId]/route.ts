import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, successResponse, errorResponse } from '@/lib/api-utils';

export async function PUT(
  req: NextRequest,
  { params }: { params: { itemId: string } }
) {
  const { error, session } = await requireAuth();
  if (error) return error;

  try {
    const { quantity } = await req.json();

    if (typeof quantity !== 'number' || quantity < 1) {
      return errorResponse('Invalid quantity', 'INVALID_INPUT', 400);
    }

    const updatedItem = await prisma.cartItem.update({
      where: {
        id: params.itemId,
        userId: (session!.user as any).id,
      },
      data: { quantity },
      include: { product: true },
    });

    return successResponse(updatedItem);
  } catch (err) {
    return errorResponse('Failed to update cart item', 'SERVER_ERROR', 500);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { itemId: string } }
) {
  const { error, session } = await requireAuth();
  if (error) return error;

  try {
    await prisma.cartItem.delete({
      where: {
        id: params.itemId,
        userId: (session!.user as any).id,
      },
    });

    return successResponse({ success: true });
  } catch (err) {
    return errorResponse('Failed to remove cart item', 'SERVER_ERROR', 500);
  }
}
