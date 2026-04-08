import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin, successResponse, errorResponse } from '@/lib/api-utils';

export async function POST(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const body = await req.json();
    const product = await prisma.product.create({
      data: {
        ...body,
        slug: body.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
        reviewCount: 0,
        rating: 0,
      }
    });
    return successResponse(product);
  } catch (err) {
    return errorResponse('Failed to create product', 'SERVER_ERROR', 500);
  }
}

export async function GET(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;
  
  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: 'desc' }
  });
  return successResponse(products);
}
