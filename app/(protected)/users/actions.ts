"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";
import { requireUser } from "@/lib/auth";
import { userCreateSchema, userUpdateSchema } from "@/lib/validators";
import { createUser, deleteUser, updateUser } from "@/lib/repositories/users";

type ActionResult = {
  error?: string;
};

export const createUserAction = async (
  formData: FormData
): Promise<ActionResult> => {
  const data = Object.fromEntries(formData.entries());
  const parsed = userCreateSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos." };
  }

  const existing = await prisma.user.findUnique({
    where: { username: parsed.data.username },
  });
  if (existing) {
    return { error: "El usuario ya existe." };
  }

  await createUser(parsed.data.username, hashPassword(parsed.data.password));
  revalidatePath("/users");
  return {};
};

export const updateUserAction = async (
  id: string,
  formData: FormData
): Promise<ActionResult> => {
  const data = Object.fromEntries(formData.entries());
  const parsed = userUpdateSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos." };
  }

  const existing = await prisma.user.findFirst({
    where: {
      username: parsed.data.username,
      NOT: { id },
    },
  });
  if (existing) {
    return { error: "El usuario ya existe." };
  }

  const updateData: { username: string; passwordHash?: string } = {
    username: parsed.data.username,
  };
  if (parsed.data.password) {
    updateData.passwordHash = hashPassword(parsed.data.password);
  }

  await updateUser(id, updateData);
  revalidatePath("/users");
  return {};
};

export const deleteUserAction = async (
  id: string
): Promise<ActionResult> => {
  const current = await requireUser();
  if (current.id === id) {
    return { error: "No puedes borrar tu propio usuario." };
  }
  const total = await prisma.user.count();
  if (total <= 1) {
    return { error: "Debe existir al menos un usuario." };
  }
  await deleteUser(id);
  revalidatePath("/users");
  return {};
};
