import "server-only";
import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE = "ri_admin";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 14;

const secret = () => {
  const value = process.env.ADMIN_SECRET;
  if (!value) throw new Error("ADMIN_SECRET is not set. Add it to .env.local.");
  return value;
};

const sign = (payload: string) =>
  createHmac("sha256", secret()).update(payload).digest("base64url");

const safeEqual = (a: string, b: string) => {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
};

export const passwordMatches = (attempt: string) => {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) throw new Error("ADMIN_PASSWORD is not set. Add it to .env.local.");
  return safeEqual(sign(attempt), sign(expected));
};

export const startSession = async () => {
  const expires = Date.now() + MAX_AGE_SECONDS * 1000;
  const payload = `admin.${expires}`;
  (await cookies()).set(COOKIE, `${payload}.${sign(payload)}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
};

export const endSession = async () => {
  (await cookies()).delete(COOKIE);
};

export const isSignedIn = async () => {
  const value = (await cookies()).get(COOKIE)?.value;
  if (!value) return false;
  const lastDot = value.lastIndexOf(".");
  const payload = value.slice(0, lastDot);
  const signature = value.slice(lastDot + 1);
  if (!safeEqual(signature, sign(payload))) return false;
  const expires = Number(payload.split(".")[1]);
  return Number.isFinite(expires) && expires > Date.now();
};

export const requireAdmin = async () => {
  if (!(await isSignedIn())) redirect("/admin/login");
};
