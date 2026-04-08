import { prisma } from './prisma';

export async function getFeatureFlag(key: string): Promise<boolean> {
  const flag = await prisma.featureFlag.findUnique({ where: { key } });
  return flag?.enabled ?? false;
}

export async function getAllFeatureFlags() {
  return prisma.featureFlag.findMany();
}
