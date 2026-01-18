"use server";

import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";
import { registerSchema } from "@/lib/validators";
import { redirect } from "next/navigation";

type ActionResult = {
  error?: string;
};

export const registerAction = async (
  formData: FormData
): Promise<ActionResult> => {
  const data = Object.fromEntries(formData.entries());
  const parsed = registerSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos." };
  }

  const existing = await prisma.user.findUnique({
    where: { username: parsed.data.username },
  });
  if (existing) {
    return { error: "El usuario ya existe." };
  }

  await prisma.user.create({
    data: {
      username: parsed.data.username,
      passwordHash: hashPassword(parsed.data.password),
    },
  });

  redirect("/login");
};
