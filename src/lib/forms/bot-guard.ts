import "server-only";

import type { NextRequest } from "next/server";
import { ELAPSED_FIELD, HONEYPOT_FIELD, MIN_FILL_MS } from "@/lib/forms/bot-trap";

export type BotVerdict =
  | { ok: true }
  /** silent: answer like a success so the bot learns nothing; otherwise return `message`. */
  | { ok: false; silent: true; reason: string }
  | { ok: false; silent: false; reason: string; status: number; message: string };

/** Browsers always send Origin on fetch POSTs; it must be this site. */
export function isSameOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  if (!origin || !host) return false;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export function guardSubmission(request: NextRequest, body: Record<string, unknown>): BotVerdict {
  if (!isSameOrigin(request)) {
    return { ok: false, silent: false, reason: "origin", status: 403, message: "This form can only be submitted from graphxify.com." };
  }
  if (typeof body[HONEYPOT_FIELD] === "string" && (body[HONEYPOT_FIELD] as string).trim()) {
    return { ok: false, silent: true, reason: "honeypot" };
  }
  if (body[ELAPSED_FIELD] === undefined) {
    // A page open since before this protection shipped: ask for a refresh, never drop a real lead.
    return { ok: false, silent: false, reason: "no-timing", status: 400, message: "Please refresh the page and send the form again." };
  }
  const elapsed = Number(body[ELAPSED_FIELD]);
  if (!Number.isFinite(elapsed) || elapsed < MIN_FILL_MS) {
    return { ok: false, silent: true, reason: "too-fast" };
  }
  return { ok: true };
}

/** Link-stuffed or markup-laden text is the signature of spam bots. */
export function looksLikeSpam(text: string | undefined): boolean {
  if (!text) return false;
  const links = (text.match(/https?:\/\/|www\./gi) ?? []).length;
  return links > 2 || /<a\s|<\/?script|\[url=|\[link=/i.test(text);
}
