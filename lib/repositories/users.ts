import { prisma } from "../prisma";

export const listUsersPaged = async (skip: number, take: number) => {
  const items = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    skip,
    take,
  });
  const total = await prisma.user.count();
  return { items, total };
};

export const createUser = async (username: string, passwordHash: string) => {
  await prisma.user.create({
    data: { username, passwordHash },
  });
};

export const updateUser = async (
  id: string,
  data: { username: string; passwordHash?: string }
) => {
  await prisma.user.update({
    where: { id },
    data,
  });
};

export const deleteUser = async (id: string) => {
  await prisma.user.delete({ where: { id } });
};
