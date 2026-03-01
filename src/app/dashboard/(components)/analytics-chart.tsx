"use client";

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type Point = { date: string; count: number };

export function AnalyticsChart({ data }: { data: Point[] }): JSX.Element {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="date" stroke="rgba(148, 146, 142, 0.92)" fontSize={12} />
          <YAxis stroke="rgba(148, 146, 142, 0.92)" fontSize={12} allowDecimals={false} />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(13,13,15,0.94)",
              border: "1px solid rgba(242,240,235,0.18)",
              color: "#f2f0eb"
            }}
          />
          <Line type="monotone" dataKey="count" stroke="#00a3ff" strokeWidth={2} dot={{ fill: "#00a3ff", r: 3 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
