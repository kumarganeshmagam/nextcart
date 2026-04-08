import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { errorResponse, successResponse } from '@/lib/api-utils';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q');

  if (!q) {
    return errorResponse('Search query is required', 'INVALID_INPUT', 400);
  }

  const products = await prisma.product.findMany({
    where: {
      OR: [
        { name: { contains: q } },
        { description: { contains: q } },
      ],
    },
    include: { category: true },
    take: 20,
  });

  return successResponse(products);
}
