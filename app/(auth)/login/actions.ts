"use server";

import { loginSchema } from "@/lib/validators";
import { prisma } from "@/lib/prisma";
import { setSessionCookie, verifyPassword } from "@/lib/auth";
import { redirect } from "next/navigation";

type ActionResult = {
  error?: string;
};

export const loginAction = async (
  formData: FormData
): Promise<ActionResult> => {
  const data = Object.fromEntries(formData.entries());
  const parsed = loginSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos." };
  }

  const user = await prisma.user.findUnique({
    where: { username: parsed.data.username },
  });
  if (!user || !verifyPassword(parsed.data.password, user.passwordHash)) {
    return { error: "Credenciales inválidas." };
  }

  await setSessionCookie({ id: user.id, username: user.username });
  redirect("/dashboard");
};
