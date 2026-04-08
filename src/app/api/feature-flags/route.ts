import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse } from '@/lib/api-utils';

export async function GET(req: NextRequest) {
  const flags = await prisma.featureFlag.findMany();
  // Return as a simple object mapping key -> enabled
  const flagMap = flags.reduce((acc, f) => ({
    ...acc,
    [f.key]: f.enabled
  }), {});
  
  return successResponse(flagMap);
}
