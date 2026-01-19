import { getSessionUser } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export const GET = async () => {
  const user = await getSessionUser();
  return Response.json({ authenticated: Boolean(user) });
};
