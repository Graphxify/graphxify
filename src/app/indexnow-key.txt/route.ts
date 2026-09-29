import { getIndexNowKey } from "@/lib/indexnow";

// IndexNow key verification file. Search engines fetch this URL (the
// `keyLocation` sent with each submission) and check that it contains the key.
// Returns 404 until INDEXNOW_KEY is configured. See docs/INDEXNOW-SETUP.md.
export const dynamic = "force-dynamic";

export function GET(): Response {
  const key = getIndexNowKey();
  if (!key) {
    return new Response("Not found", { status: 404, headers: { "Content-Type": "text/plain; charset=utf-8" } });
  }
  return new Response(key, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
      "X-Robots-Tag": "noindex"
    }
  });
}
