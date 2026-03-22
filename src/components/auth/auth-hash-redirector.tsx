"use client";

import { useEffect } from "react";

function getTargetPath(hash: string): string | null {
  const params = new URLSearchParams(hash.startsWith("#") ? hash.slice(1) : hash);
  const type = params.get("type");

  if (type === "invite") {
    return `/reset-password?invite=1${hash}`;
  }

  if (type === "recovery") {
    return `/reset-password${hash}`;
  }

  if (type === "magiclink") {
    return `/auth/complete${hash}`;
  }

  return null;
}

export function AuthHashRedirector(): null {
  useEffect(() => {
    if (typeof window === "undefined" || !window.location.hash) {
      return;
    }

    const targetPath = getTargetPath(window.location.hash);
    if (!targetPath) {
      return;
    }

    const currentPath = `${window.location.pathname}${window.location.search}`;
    if (currentPath === targetPath.replace(window.location.hash, "")) {
      return;
    }

    window.location.replace(targetPath);
  }, []);

  return null;
}
