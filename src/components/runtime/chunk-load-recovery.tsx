"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

const RETRY_KEY_PREFIX = "__graphxify_chunk_retry__";

function isChunkLoadFailure(reason: unknown): boolean {
  if (!reason) {
    return false;
  }

  const message =
    typeof reason === "string"
      ? reason
      : reason instanceof Error
        ? reason.message
        : typeof reason === "object" && reason !== null && "message" in reason
          ? String((reason as { message?: unknown }).message ?? "")
          : "";

  if (message.length === 0) {
    return false;
  }

  const normalized = message.toLowerCase();
  return (
    normalized.includes("chunkloaderror") ||
    normalized.includes("loading chunk") ||
    normalized.includes("failed to fetch dynamically imported module")
  );
}

export function ChunkLoadRecovery(): null {
  const pathname = usePathname();

  useEffect(() => {
    const retryKey = `${RETRY_KEY_PREFIX}:${pathname}`;

    const reloadOnce = () => {
      if (typeof window === "undefined") {
        return;
      }

      if (sessionStorage.getItem(retryKey) === "1") {
        return;
      }

      sessionStorage.setItem(retryKey, "1");
      window.location.reload();
    };

    const onError = (event: ErrorEvent) => {
      if (isChunkLoadFailure(event.error ?? event.message)) {
        reloadOnce();
      }
    };

    const onUnhandledRejection = (event: PromiseRejectionEvent) => {
      if (isChunkLoadFailure(event.reason)) {
        reloadOnce();
      }
    };

    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onUnhandledRejection);

    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onUnhandledRejection);
    };
  }, [pathname]);

  return null;
}

