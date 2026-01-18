"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import { addStockSchema } from "@/lib/validators";
import { createMovement } from "@/lib/repositories/movements";

type ActionResult = {
  error?: string;
};

export const addStockAction = async (
  formData: FormData
): Promise<ActionResult> => {
  const user = await requireUser();
  const data = Object.fromEntries(formData.entries());
  const parsed = addStockSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos." };
  }

  try {
    await createMovement({
      type: "IN",
      reason: "PURCHASE",
      qty: parsed.data.qty,
      productId: parsed.data.productId,
      userId: user.id,
    });
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "Error al ingresar stock." };
  }

  revalidatePath("/products");
  revalidatePath("/dashboard");
  return {};
};
