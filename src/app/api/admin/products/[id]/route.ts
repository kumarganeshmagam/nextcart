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
    const body = await req.json();
    const product = await prisma.product.update({
      where: { id: params.id },
      data: body
    });
    return successResponse(product);
  } catch (err) {
    return errorResponse('Failed to update product', 'SERVER_ERROR', 500);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    await prisma.product.delete({
      where: { id: params.id }
    });
    return successResponse({ success: true });
  } catch (err) {
    return errorResponse('Failed to delete product', 'SERVER_ERROR', 500);
  }
}
