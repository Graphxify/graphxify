"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { cmsSyncConfig } from "@/lib/client/cms-sync";

type ContentRefreshListenerProps = {
  pathPrefixes: string[];
};

export function ContentRefreshListener({ pathPrefixes }: ContentRefreshListenerProps): null {
  const router = useRouter();
  const pathname = usePathname();
  const lastRefreshRef = useRef(0);

  useEffect(() => {
    const shouldRefresh = pathPrefixes.some((prefix) => pathname.startsWith(prefix));
    if (!shouldRefresh) {
      return;
    }

    const refresh = () => {
      const now = Date.now();
      if (now - lastRefreshRef.current < 350) {
        return;
      }
      lastRefreshRef.current = now;
      router.refresh();
    };

    let channel: BroadcastChannel | null = null;
    if ("BroadcastChannel" in window) {
      channel = new BroadcastChannel(cmsSyncConfig.CHANNEL_NAME);
      channel.onmessage = () => refresh();
    }

    const onStorage = (event: StorageEvent) => {
      if (event.key === cmsSyncConfig.STORAGE_KEY) {
        refresh();
      }
    };

    const onWindowEvent = () => refresh();

    window.addEventListener("storage", onStorage);
    window.addEventListener(cmsSyncConfig.WINDOW_EVENT, onWindowEvent as EventListener);

    return () => {
      channel?.close();
      window.removeEventListener("storage", onStorage);
      window.removeEventListener(cmsSyncConfig.WINDOW_EVENT, onWindowEvent as EventListener);
    };
  }, [pathname, pathPrefixes, router]);

  return null;
}
