import crypto from "crypto";
import { NextResponse } from "next/server";

// Admin sessions: the password is checked on the server against
// ADMIN_SECRET_KEY (never sent to the browser), and a signed, httpOnly
// cookie proves the session on later requests.
export const SESSION_COOKIE = "samblog_admin";
const SESSION_SECONDS = 60 * 60 * 12;

const adminSecret = () => process.env.ADMIN_SECRET_KEY;

const sign = (value) =>
  crypto.createHmac("sha256", adminSecret()).update(value).digest("base64url");

const sameText = (a, b) => {
  const hashA = crypto.createHash("sha256").update(a).digest();
  const hashB = crypto.createHash("sha256").update(b).digest();
  return crypto.timingSafeEqual(hashA, hashB);
};

export const passwordMatches = (password) =>
  Boolean(adminSecret()) &&
  typeof password === "string" &&
  sameText(password, adminSecret());

export const createSessionCookie = () => {
  const expires = Date.now() + SESSION_SECONDS * 1000;
  return {
    name: SESSION_COOKIE,
    value: `${expires}.${sign(`admin:${expires}`)}`,
    options: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: SESSION_SECONDS,
    },
  };
};

export const isAdminRequest = (request) => {
  if (!adminSecret()) return false;
  const [expires, signature] = (
    request.cookies.get(SESSION_COOKIE)?.value || ""
  ).split(".");
  if (!expires || !signature || Number(expires) < Date.now()) return false;
  return sameText(signature, sign(`admin:${expires}`));
};

export const unauthorized = () =>
  NextResponse.json(
    { success: false, error: "Unauthorized access" },
    { status: 401 }
  );
