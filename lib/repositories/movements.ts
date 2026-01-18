import { MovementReason, MovementType, Prisma } from "@prisma/client";
import { prisma } from "../prisma";

export type MovementFilters = {
  from?: string;
  to?: string;
  type?: MovementType;
  productId?: string;
};

const buildMovementWhere = (
  filters: MovementFilters
): Prisma.StockMovementWhereInput => {
  const where: Prisma.StockMovementWhereInput = {};
  if (filters.type) {
    where.type = filters.type;
  }
  if (filters.productId) {
    where.productId = filters.productId;
  }
  if (filters.from || filters.to) {
    where.createdAt = {};
    if (filters.from) {
      where.createdAt.gte = new Date(filters.from);
    }
    if (filters.to) {
      const toDate = new Date(filters.to);
      toDate.setHours(23, 59, 59, 999);
      where.createdAt.lte = toDate;
    }
  }
  return where;
};

const computeDelta = (
  type: MovementType,
  qty: number,
  direction?: "IN" | "OUT"
): number => {
  if (type === "IN") {
    return qty;
  }
  if (type === "OUT") {
    return -qty;
  }
  if (type === "RETURN") {
    return qty;
  }
  if (type === "ADJUST") {
    if (!direction) {
      throw new Error("Direccion requerida para ajustes.");
    }
    return direction === "IN" ? qty : -qty;
  }
  return 0;
};

export const listMovements = async (filters: MovementFilters) => {
  const where = buildMovementWhere(filters);
  return prisma.stockMovement.findMany({
    where,
    include: {
      product: true,
      user: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const listMovementsPaged = async (
  filters: MovementFilters,
  skip: number,
  take: number
) => {
  const where = buildMovementWhere(filters);
  const items = await prisma.stockMovement.findMany({
    where,
    include: {
      product: true,
      user: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    skip,
    take,
  });
  const total = await prisma.stockMovement.count({ where });
  return { items, total };
};

type MovementCreateInput = {
  type: MovementType;
  reason: MovementReason;
  qty: number;
  direction?: "IN" | "OUT";
  productId: string;
  userId: string;
};

export const createMovement = async (
  input: MovementCreateInput
): Promise<void> => {
  await prisma.$transaction(async (tx) => {
    const product = await tx.product.findUnique({
      where: { id: input.productId },
    });
    if (!product) {
      throw new Error("Producto no encontrado.");
    }

    const delta = computeDelta(input.type, input.qty, input.direction);
    const projected = product.currentStock + delta;
    if (projected < 0) {
      throw new Error("Stock insuficiente para completar el movimiento.");
    }

    await tx.product.update({
      where: { id: product.id },
      data: {
        currentStock:
          delta >= 0 ? { increment: delta } : { decrement: Math.abs(delta) },
      },
    });

    await tx.stockMovement.create({
      data: {
        type: input.type,
        reason: input.reason,
        qty: input.qty,
        direction: input.direction,
        productId: input.productId,
        userId: input.userId,
      },
    });
  });
};
