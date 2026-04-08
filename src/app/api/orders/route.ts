import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, successResponse, errorResponse } from '@/lib/api-utils';
import { z } from 'zod';

const orderSchema = z.object({
  subtotal: z.number(),
  tax: z.number(),
  shippingCost: z.number(),
  total: z.number(),
  shippingMethod: z.string(),
  shippingAddress: z.object({
    name: z.string(),
    address1: z.string(),
    city: z.string(),
    state: z.string(),
    zip: z.string(),
    country: z.string(),
  }),
  couponCode: z.string().optional(),
  discountAmount: z.number().optional(),
});

export async function GET(req: NextRequest) {
  const { error, session } = await requireAuth();
  if (error) return error;

  const orders = await prisma.order.findMany({
    where: { userId: (session!.user as any).id },
    include: { items: { include: { product: true } } },
    orderBy: { createdAt: 'desc' },
  });

  return successResponse(orders);
}

export async function POST(req: NextRequest) {
  const { error, session } = await requireAuth();
  if (error) return error;

  try {
    const body = await req.json();
    const result = orderSchema.safeParse(body);

    if (!result.success) {
      return errorResponse('Invalid order data', 'INVALID_INPUT', 400);
    }

    const { 
      subtotal, tax, shippingCost, total, 
      shippingMethod, shippingAddress, 
      couponCode, discountAmount 
    } = result.data;

    const userId = (session!.user as any).id;

    // Get cart items to create order items
    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: { product: true },
    });

    if (cartItems.length === 0) {
      return errorResponse('Cart is empty', 'EMPTY_CART', 400);
    }

    // Create order in transaction
    const order = await prisma.$transaction(async (tx) => {
      // 1. Create order
      const newOrder = await tx.order.create({
        data: {
          userId,
          status: 'Pending',
          subtotal,
          tax,
          shippingCost,
          total,
          shippingMethod,
          shippingAddress: JSON.stringify(shippingAddress),
          couponCode,
          discountAmount: discountAmount || 0,
          items: {
            create: cartItems.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.product.price,
            })),
          },
        },
        include: { items: true },
      });

      // 2. Reduce stock for each product
      for (const item of cartItems) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: { decrement: item.quantity },
          },
        });
      }

      // 3. Clear cart
      await tx.cartItem.deleteMany({
        where: { userId },
      });

      return newOrder;
    });

    return successResponse(order);
  } catch (err) {
    console.error('Order creation error:', err);
    return errorResponse('Failed to create order', 'SERVER_ERROR', 500);
  }
}
