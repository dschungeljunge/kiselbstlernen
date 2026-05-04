/**
 * Next.js Middleware – API-Schutz
 *
 * - Rate-Limiting pro IP für alle API-Routen
 * - Stricter Limit für OpenAI-Proxy-Routen (Kostenschutz)
 */

import { NextResponse, type NextRequest } from "next/server";

const WINDOW_MS = 60_000; // 1 Minute
const MAX_GENERAL_REQUESTS = 60;
const MAX_AI_REQUESTS = 20;

const hits = new Map<string, { count: number; resetAt: number }>();

const AI_ROUTES = [
  "/api/profile-chat",
  "/api/profile-insight",
  "/api/reflection-chat",
  "/api/reflection/chat",
  "/api/reflection/conclusion-chat",
  "/api/reflection/situation",
  "/api/reflection/ziel",
  "/api/reflection/transcribe",
];

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

function isRateLimited(key: string, max: number): boolean {
  const now = Date.now();
  const entry = hits.get(key);

  if (!entry || now > entry.resetAt) {
    hits.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }

  entry.count++;
  return entry.count > max;
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (!pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  const ip = getClientIp(req);
  const isAiRoute = AI_ROUTES.some((r) => pathname.startsWith(r));
  const limit = isAiRoute ? MAX_AI_REQUESTS : MAX_GENERAL_REQUESTS;
  const bucketKey = isAiRoute ? `ai:${ip}` : `gen:${ip}`;

  if (isRateLimited(bucketKey, limit)) {
    return NextResponse.json(
      { error: "Zu viele Anfragen. Bitte warte einen Moment." },
      { status: 429 },
    );
  }

  const res = NextResponse.next();
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("X-Frame-Options", "DENY");
  return res;
}

export const config = {
  matcher: ["/api/:path*"],
};
