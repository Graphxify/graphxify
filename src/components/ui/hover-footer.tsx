"use client";

import { motion } from "framer-motion";
import type { MouseEvent } from "react";
import { useId, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export const TextHoverEffect = ({
  text,
  duration,
  className
}: {
  text: string;
  duration?: number;
  automatic?: boolean;
  className?: string;
}): JSX.Element => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hovered, setHovered] = useState(false);
  const [maskPosition, setMaskPosition] = useState({ x: 150, y: 50 });
  const id = useId().replace(/:/g, "");
  const gradientId = `textGradient-${id}`;
  const textMaskId = `textMask-${id}`;
  const neonFilterId = `neonFilter-${id}`;

  function onPointerMove(event: MouseEvent<SVGSVGElement>): void {
    const svg = svgRef.current;
    if (!svg) {
      return;
    }
    const rect = svg.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) {
      return;
    }

    const normalizedX = (event.clientX - rect.left) / rect.width;
    const normalizedY = (event.clientY - rect.top) / rect.height;
    setMaskPosition({
      x: Math.max(0, Math.min(1, normalizedX)) * 300,
      y: Math.max(0, Math.min(1, normalizedY)) * 100
    });
  }

  return (
    <svg
      ref={svgRef}
      width="100%"
      height="100%"
      viewBox="0 0 300 100"
      xmlns="http://www.w3.org/2000/svg"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setMaskPosition({ x: 150, y: 50 });
      }}
      onMouseMove={onPointerMove}
      className={cn("cursor-pointer select-none uppercase", className)}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#00A3FF" />
          <stop offset="100%" stopColor="#0052CC" />
        </linearGradient>

        <filter id={neonFilterId} x="-40%" y="-160%" width="180%" height="420%" colorInterpolationFilters="sRGB">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2.6" result="blurPrimary" />
          <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blurSecondary" />
          <feMerge>
            <feMergeNode in="blurSecondary" />
            <feMergeNode in="blurPrimary" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <mask id={textMaskId} maskUnits="userSpaceOnUse" x="0" y="0" width="300" height="100">
          <rect x="0" y="0" width="300" height="100" fill="black" />
          <motion.circle
            animate={{
              cx: maskPosition.x,
              cy: maskPosition.y,
              r: hovered ? 26 : 0
            }}
            transition={{ duration: duration ?? 0.16, ease: [0.16, 1, 0.3, 1] }}
            fill="white"
          />
          <motion.circle
            animate={{
              cx: maskPosition.x,
              cy: maskPosition.y,
              r: hovered ? 42 : 0
            }}
            transition={{ duration: duration ?? 0.2, ease: [0.16, 1, 0.3, 1] }}
            fill="white"
            fillOpacity="0.45"
          />
        </mask>
      </defs>

      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        strokeWidth="0.62"
        stroke="currentColor"
        className="fill-transparent text-7xl font-semibold text-fg/26 dark:text-fg/24"
      >
        {text}
      </text>

      <motion.g
        initial={false}
        animate={{ opacity: hovered ? 0.65 : 0 }}
        transition={{ duration: duration ?? 0.18, ease: [0.16, 1, 0.3, 1] }}
      >
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          stroke={`url(#${gradientId})`}
          strokeWidth="0.7"
          fill="transparent"
          filter={`url(#${neonFilterId})`}
          className="text-7xl font-semibold"
        >
          {text}
        </text>
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          fill={`url(#${gradientId})`}
          fillOpacity="0.14"
          filter={`url(#${neonFilterId})`}
          className="text-7xl font-semibold"
        >
          {text}
        </text>
      </motion.g>

      <g mask={`url(#${textMaskId})`}>
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          stroke={`url(#${gradientId})`}
          strokeWidth="0.82"
          fill="transparent"
          filter={`url(#${neonFilterId})`}
          className="text-7xl font-semibold"
        >
          {text}
        </text>
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          fill={`url(#${gradientId})`}
          fillOpacity="0.3"
          filter={`url(#${neonFilterId})`}
          className="text-7xl font-semibold"
        >
          {text}
        </text>
      </g>
    </svg>
  );
};

export const FooterBackgroundGradient = (): JSX.Element => {
  return (
    <div
      className="absolute inset-0 z-0 bg-transparent dark:bg-[radial-gradient(125%_125%_at_50%_10%,rgba(15,15,17,0.6)_50%,rgba(0,163,255,0.2)_100%)]"
      aria-hidden="true"
    />
  );
};
