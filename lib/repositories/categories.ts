import { prisma } from "../prisma";

export const listCategories = async () =>
  prisma.category.findMany({ orderBy: { name: "asc" } });

export const listCategoriesPaged = async (skip: number, take: number) => {
  const items = await prisma.category.findMany({
    orderBy: { name: "asc" },
    skip,
    take,
  });
  const total = await prisma.category.count();
  return { items, total };
};

export const createCategory = async (name: string): Promise<void> => {
  await prisma.category.create({ data: { name } });
};

export const updateCategory = async (
  id: string,
  name: string
): Promise<void> => {
  await prisma.category.update({ where: { id }, data: { name } });
};

export const deleteCategory = async (id: string): Promise<void> => {
  const inUse = await prisma.product.count({ where: { categoryId: id } });
  if (inUse > 0) {
    throw new Error("No se puede borrar: categoría en uso.");
  }
  await prisma.category.delete({ where: { id } });
};
