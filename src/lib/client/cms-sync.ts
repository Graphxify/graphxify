"use client";

const CHANNEL_NAME = "graphxify-cms-sync";
const STORAGE_KEY = "graphxify-cms-sync-ping";
const WINDOW_EVENT = "graphxify-cms-sync";

export function emitCmsContentChanged(reason: string): void {
  if (typeof window === "undefined") {
    return;
  }

  const payload = { type: "content_changed", reason, at: Date.now() };

  if ("BroadcastChannel" in window) {
    const channel = new BroadcastChannel(CHANNEL_NAME);
    channel.postMessage(payload);
    channel.close();
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore storage write failures
  }

  window.dispatchEvent(new CustomEvent(WINDOW_EVENT, { detail: payload }));
}

export const cmsSyncConfig = {
  CHANNEL_NAME,
  STORAGE_KEY,
  WINDOW_EVENT
} as const;
