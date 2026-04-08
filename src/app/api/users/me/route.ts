import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, successResponse, errorResponse } from '@/lib/api-utils';

export async function GET(req: NextRequest) {
  const { error, session } = await requireAuth();
  if (error) return error;

  const user = await prisma.user.findUnique({
    where: { id: (session!.user as any).id },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
      addresses: true,
    },
  });

  return successResponse(user);
}

export async function PUT(req: NextRequest) {
  const { error, session } = await requireAuth();
  if (error) return error;

  try {
    const { name, email } = await req.json();

    const updatedUser = await prisma.user.update({
      where: { id: (session!.user as any).id },
      data: { name, email },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    return successResponse(updatedUser);
  } catch (err) {
    return errorResponse('Failed to update profile', 'SERVER_ERROR', 500);
  }
}
