import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, successResponse, errorResponse } from '@/lib/api-utils';

export async function GET(req: NextRequest) {
  const { error, session } = await requireAuth();
  if (error) return error;

  const cartItems = await prisma.cartItem.findMany({
    where: { userId: (session!.user as any).id },
    include: { product: true },
  });

  return successResponse(cartItems);
}

export async function POST(req: NextRequest) {
  const { error, session } = await requireAuth();
  if (error) return error;

  try {
    const { productId, quantity = 1 } = await req.json();

    if (!productId) {
      return errorResponse('Product ID is required', 'INVALID_INPUT', 400);
    }

    const cartItem = await prisma.cartItem.upsert({
      where: {
        userId_productId: {
          userId: (session!.user as any).id,
          productId,
        },
      },
      update: {
        quantity: { increment: quantity },
      },
      create: {
        userId: (session!.user as any).id,
        productId,
        quantity,
      },
      include: { product: true },
    });

    return successResponse(cartItem);
  } catch (err) {
    return errorResponse('Failed to add to cart', 'SERVER_ERROR', 500);
  }
}
