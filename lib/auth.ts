import crypto from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { hashPassword, verifyPassword } from "./password";

const SESSION_COOKIE = "papeleria_session";
const SESSION_TTL_SECONDS = 60 * 60 * 8;

export type SessionUser = {
  id: string;
  username: string;
};

type SessionPayload = {
  userId: string;
  username: string;
  exp: number;
};

const getSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not set");
  }
  return secret;
};

const base64UrlEncode = (buffer: Buffer): string =>
  buffer
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

const base64UrlDecode = (value: string): Buffer => {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/");
  const padLength = (4 - (padded.length % 4)) % 4;
  return Buffer.from(padded + "=".repeat(padLength), "base64");
};

const sign = (payload: string): string => {
  const hmac = crypto.createHmac("sha256", getSecret());
  hmac.update(payload);
  return base64UrlEncode(hmac.digest());
};

const createToken = (payload: SessionPayload): string => {
  const encodedPayload = base64UrlEncode(Buffer.from(JSON.stringify(payload)));
  const signature = sign(encodedPayload);
  return `${encodedPayload}.${signature}`;
};

const verifyToken = (token: string): SessionPayload | null => {
  const [payload, signature] = token.split(".");
  if (!payload || !signature) {
    return null;
  }
  const expected = sign(payload);
  const expectedBuffer = Buffer.from(expected);
  const signatureBuffer = Buffer.from(signature);
  if (expectedBuffer.length !== signatureBuffer.length) {
    return null;
  }
  if (!crypto.timingSafeEqual(expectedBuffer, signatureBuffer)) {
    return null;
  }
  try {
    const decoded = base64UrlDecode(payload).toString("utf-8");
    const parsed = JSON.parse(decoded) as Partial<SessionPayload>;
    if (!parsed.userId || !parsed.username || !parsed.exp) {
      return null;
    }
    if (parsed.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }
    return {
      userId: parsed.userId,
      username: parsed.username,
      exp: parsed.exp,
    };
  } catch {
    return null;
  }
};

export { hashPassword, verifyPassword };

export const setSessionCookie = async (user: SessionUser): Promise<void> => {
  const payload: SessionPayload = {
    userId: user.id,
    username: user.username,
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
  };
  const token = createToken(payload);
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
};

export const clearSessionCookie = async (): Promise<void> => {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
};

export const getSessionUser = async (): Promise<SessionUser | null> => {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) {
    return null;
  }
  const payload = verifyToken(token);
  if (!payload) {
    return null;
  }
  return { id: payload.userId, username: payload.username };
};

export const requireUser = async (): Promise<SessionUser> => {
  const user = await getSessionUser();
  if (!user) {
    redirect("/login");
  }
  return user;
};
