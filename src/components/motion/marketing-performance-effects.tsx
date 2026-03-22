"use client";

import { useEffect, useState } from "react";
import { CursorGlow } from "@/components/motion/cursor-glow";
import { DeferredEffects } from "@/components/motion/deferred-effects";
import { ScrollProgress } from "@/components/motion/scroll-progress";
import { SmoothScrollDriver } from "@/components/motion/smooth-scroll-driver";

type NavigatorWithHints = Navigator & {
  connection?: { saveData?: boolean };
  deviceMemory?: number;
};

type IdleWindow = Window & {
  requestIdleCallback?: (callback: () => void, options?: { timeout?: number }) => number;
  cancelIdleCallback?: (id: number) => void;
};

function readCapabilities() {
  if (typeof window === "undefined") {
    return {
      reducedMotion: false,
      allowShellEffects: false,
      allowCursorGlow: false
    };
  }

  const navigatorHints = window.navigator as NavigatorWithHints;
  const saveData = Boolean(navigatorHints.connection?.saveData);
  const deviceMemory = navigatorHints.deviceMemory ?? 8;
  const hardwareConcurrency = navigatorHints.hardwareConcurrency ?? 8;
  const finePointer = window.matchMedia("(pointer: fine)").matches;
  const wideViewport = window.matchMedia("(min-width: 1024px)").matches;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const allowShellEffects = !reducedMotion && finePointer && wideViewport && !saveData && deviceMemory >= 6 && hardwareConcurrency >= 6;
  const allowCursorGlow = allowShellEffects && deviceMemory >= 8 && hardwareConcurrency >= 8;

  return {
    reducedMotion,
    allowShellEffects,
    allowCursorGlow
  };
}

export function MarketingPerformanceEffects(): JSX.Element | null {
  const [{ reducedMotion, allowShellEffects, allowCursorGlow }, setCapabilities] = useState(() => ({
    reducedMotion: false,
    allowShellEffects: false,
    allowCursorGlow: false
  }));
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (reducedMotion) {
      setCapabilities({ reducedMotion: true, allowShellEffects: false, allowCursorGlow: false });
      setReady(false);
      return;
    }

    const updateCapabilities = () => {
      setCapabilities(readCapabilities());
    };

    updateCapabilities();
    window.addEventListener("resize", updateCapabilities, { passive: true });

    const idleWindow = window as IdleWindow;
    const onReady = () => setReady(true);
    const idleId = idleWindow.requestIdleCallback
      ? idleWindow.requestIdleCallback(onReady, { timeout: 900 })
      : window.setTimeout(onReady, 280);

    return () => {
      window.removeEventListener("resize", updateCapabilities);
      if (typeof idleId === "number" && idleWindow.cancelIdleCallback) {
        idleWindow.cancelIdleCallback(idleId);
        return;
      }
      window.clearTimeout(idleId);
    };
  }, [reducedMotion]);

  if (reducedMotion || !ready) {
    return null;
  }

  return (
    <>
      {allowShellEffects ? <SmoothScrollDriver /> : null}
      {allowShellEffects ? <ScrollProgress /> : null}
      {allowShellEffects ? <DeferredEffects /> : null}
      {allowCursorGlow ? <CursorGlow /> : null}
    </>
  );
}
