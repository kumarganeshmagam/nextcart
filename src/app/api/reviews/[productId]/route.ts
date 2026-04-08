import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse } from '@/lib/api-utils';

export async function GET(
  req: NextRequest,
  { params }: { params: { productId: string } }
) {
  const reviews = await prisma.review.findMany({
    where: { productId: params.productId },
    include: { user: { select: { id: true, name: true } } },
    orderBy: { createdAt: 'desc' },
  });

  return successResponse(reviews);
}
