"use client";

import dynamic from "next/dynamic";

type Point = { date: string; count: number };

const AnalyticsChart = dynamic(
  () => import("@/app/dashboard/(components)/analytics-chart").then((mod) => mod.AnalyticsChart),
  { ssr: false }
);

export default function AnalyticsClient({ data }: { data: Point[] }) {
  return <AnalyticsChart data={data} />;
}
