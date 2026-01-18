"use server";

import { revalidatePath } from "next/cache";
import { categorySchema } from "@/lib/validators";
import {
  createCategory,
  deleteCategory,
  updateCategory,
} from "@/lib/repositories/categories";

type ActionResult = {
  error?: string;
};

export const createCategoryAction = async (
  formData: FormData
): Promise<ActionResult> => {
  const parsed = categorySchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos." };
  }
  try {
    await createCategory(parsed.data.name);
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "Error al crear categoría." };
  }
  revalidatePath("/categories");
  return {};
};

export const updateCategoryAction = async (
  id: string,
  formData: FormData
): Promise<ActionResult> => {
  const parsed = categorySchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos." };
  }
  try {
    await updateCategory(id, parsed.data.name);
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "Error al actualizar categoría." };
  }
  revalidatePath("/categories");
  return {};
};

export const deleteCategoryAction = async (id: string): Promise<ActionResult> => {
  try {
    await deleteCategory(id);
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "Error al borrar categoría." };
  }
  revalidatePath("/categories");
  return {};
};
