"use server";

import { clearSessionCookie } from "@/lib/auth";
import { redirect } from "next/navigation";

export const logoutAction = async (): Promise<void> => {
  await clearSessionCookie();
  redirect("/login");
};
