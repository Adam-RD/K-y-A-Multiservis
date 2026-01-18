"use server";

import { revalidatePath } from "next/cache";
import { movementSchema } from "@/lib/validators";
import { createMovement } from "@/lib/repositories/movements";
import { requireUser } from "@/lib/auth";

type ActionResult = {
  error?: string;
};

export const createMovementAction = async (
  formData: FormData
): Promise<ActionResult> => {
  const user = await requireUser();
  const data = Object.fromEntries(formData.entries());
  const parsed = movementSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos invalidos." };
  }
  const input = parsed.data;
  if (input.type !== "OUT" || input.reason !== "SALE") {
    return { error: "Solo se permiten ventas." };
  }
  try {
    await createMovement({
      type: input.type,
      reason: input.reason,
      qty: input.qty,
      productId: input.productId,
      userId: user.id,
    });
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "Error inesperado al registrar movimiento." };
  }
  revalidatePath("/movements");
  revalidatePath("/products");
  revalidatePath("/dashboard");
  return {};
};
