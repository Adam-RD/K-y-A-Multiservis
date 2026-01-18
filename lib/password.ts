import crypto from "crypto";

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

export const hashPassword = (password: string): string => {
  const salt = crypto.randomBytes(16);
  const derived = crypto.scryptSync(password, salt, 64);
  return `${base64UrlEncode(salt)}:${base64UrlEncode(derived)}`;
};

export const verifyPassword = (password: string, stored: string): boolean => {
  const [saltEncoded, hashEncoded] = stored.split(":");
  if (!saltEncoded || !hashEncoded) {
    return false;
  }
  const salt = base64UrlDecode(saltEncoded);
  const expectedHash = base64UrlDecode(hashEncoded);
  const derived = crypto.scryptSync(password, salt, expectedHash.length);
  if (derived.length !== expectedHash.length) {
    return false;
  }
  return crypto.timingSafeEqual(derived, expectedHash);
};
