"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

type Point = { date: string; value: number };

export default function TrendChart({
  data,
  unit,
  color = "#10b981",
}: {
  data: Point[];
  unit: string;
  color?: string;
}) {
  if (data.length < 2) {
    return (
      <p className="py-3 text-center text-xs text-slate-400">
        Log a couple more entries to see a trend.
      </p>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={110}>
      <LineChart data={data} margin={{ top: 5, right: 8, bottom: 0, left: -20 }}>
        <XAxis
          dataKey="date"
          tick={{ fontSize: 10, fill: "#94a3b8" }}
          tickFormatter={(d: string) => d.slice(5)}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 10, fill: "#94a3b8" }}
          domain={["auto", "auto"]}
          width={36}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          formatter={(value) => [`${value} ${unit}`, ""]}
          contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e2e8f0" }}
        />
        <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} dot={{ r: 2 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}
