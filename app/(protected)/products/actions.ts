"use server";

import { revalidatePath } from "next/cache";
import { productSchema } from "@/lib/validators";
import { createProduct, deleteProduct, updateProduct } from "@/lib/repositories/products";
import { prisma } from "@/lib/prisma";

type ActionResult = {
  error?: string;
};

const parseProductForm = (formData: FormData) => {
  const data = Object.fromEntries(formData.entries());
  return productSchema.safeParse({
    ...data,
  });
};

export const createProductAction = async (
  formData: FormData
): Promise<ActionResult> => {
  const parsed = parseProductForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos." };
  }
  const input = parsed.data;

  try {
    await createProduct({
      name: input.name,
      category: { connect: { id: input.categoryId } },
      unit: input.unit,
      costPrice: input.costPrice,
      salePrice: input.salePrice,
      minStock: input.minStock,
      currentStock: input.currentStock,
    });
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "Error al crear producto." };
  }
  revalidatePath("/products");
  return {};
};

export const updateProductAction = async (
  id: string,
  formData: FormData
): Promise<ActionResult> => {
  const parsed = parseProductForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos." };
  }
  const input = parsed.data;

  try {
    await updateProduct(id, {
      name: input.name,
      category: { connect: { id: input.categoryId } },
      unit: input.unit,
      costPrice: input.costPrice,
      salePrice: input.salePrice,
      minStock: input.minStock,
      currentStock: input.currentStock,
    });
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "Error al actualizar producto." };
  }
  revalidatePath("/products");
  return {};
};

export const deleteProductAction = async (
  id: string
): Promise<ActionResult> => {
  try {
    await deleteProduct(id);
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "Error al eliminar producto." };
  }
  revalidatePath("/products");
  return {};
};
