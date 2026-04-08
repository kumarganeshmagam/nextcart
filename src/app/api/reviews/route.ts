import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, successResponse, errorResponse } from '@/lib/api-utils';
import { z } from 'zod';

const reviewSchema = z.object({
  productId: z.string(),
  rating: z.number().min(1).max(5),
  comment: z.string().min(10),
});

export async function POST(req: NextRequest) {
  const { error, session } = await requireAuth();
  if (error) return error;

  try {
    const body = await req.json();
    const result = reviewSchema.safeParse(body);

    if (!result.success) {
      return errorResponse('Invalid review data', 'INVALID_INPUT', 400);
    }

    const { productId, rating, comment } = result.data;
    const userId = (session!.user as any).id;

    // Check if user already reviewed this product
    const existingReview = await prisma.review.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    if (existingReview) {
      return errorResponse('You have already reviewed this product', 'ALREADY_REVIEWED', 400);
    }

    // Create review and update product rating in transaction
    const review = await prisma.$transaction(async (tx) => {
      const newReview = await tx.review.create({
        data: {
          userId,
          productId,
          rating,
          comment,
        },
      });

      // Recalculate average rating
      const allReviews = await tx.review.findMany({
        where: { productId },
        select: { rating: true },
      });

      const avgRating = allReviews.reduce((acc, r) => acc + r.rating, 0) / allReviews.length;

      await tx.product.update({
        where: { id: productId },
        data: {
          rating: avgRating,
          reviewCount: allReviews.length,
        },
      });

      return newReview;
    });

    return successResponse(review);
  } catch (err) {
    console.error('Review creation error:', err);
    return errorResponse('Failed to submit review', 'SERVER_ERROR', 500);
  }
}
