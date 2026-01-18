import { Prisma } from "@prisma/client";
import { prisma } from "../prisma";

export type ProductFilters = {
  query?: string;
  categoryId?: string;
};

const buildProductWhere = (
  filters: ProductFilters
): Prisma.ProductWhereInput => {
  const where: Prisma.ProductWhereInput = {};
  if (filters.query) {
    where.OR = [
      { name: { contains: filters.query, mode: "insensitive" } },
    ];
  }
  if (filters.categoryId) {
    where.categoryId = filters.categoryId;
  }
  return where;
};

export const listProducts = async (filters: ProductFilters) => {
  const where = buildProductWhere(filters);
  return prisma.product.findMany({
    where,
    include: {
      category: true,
    },
    orderBy: {
      name: "asc",
    },
  });
};

export const listProductsPaged = async (
  filters: ProductFilters,
  skip: number,
  take: number
) => {
  const where = buildProductWhere(filters);
  const items = await prisma.product.findMany({
    where,
    include: {
      category: true,
    },
    orderBy: {
      name: "asc",
    },
    skip,
    take,
  });
  const total = await prisma.product.count({ where });
  return { items, total };
};

export const getProductById = async (id: string) =>
  prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
    },
  });

export const createProduct = async (
  data: Prisma.ProductCreateInput
): Promise<void> => {
  await prisma.product.create({ data });
};

export const updateProduct = async (
  id: string,
  data: Prisma.ProductUpdateInput
): Promise<void> => {
  await prisma.product.update({ where: { id }, data });
};

export const deleteProduct = async (id: string): Promise<void> => {
  await prisma.product.delete({ where: { id } });
};
