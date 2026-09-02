"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";
import type { ProjectionPoint } from "@/lib/weightProjection";

export default function WeightProjectionChart({
  data,
  targetWeightKg,
}: {
  data: ProjectionPoint[];
  targetWeightKg: number;
}) {
  return (
    <ResponsiveContainer width="100%" height={160}>
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
          formatter={(value, name) => [
            value != null ? `${value} kg` : "—",
            name === "actual" ? "Logged" : "Projected",
          ]}
          contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e2e8f0" }}
        />
        <ReferenceLine
          y={targetWeightKg}
          stroke="#f97316"
          strokeDasharray="3 3"
          label={{ value: `Target ${targetWeightKg}kg`, fontSize: 10, fill: "#f97316", position: "insideTopLeft" }}
        />
        <Line
          type="monotone"
          dataKey="actual"
          stroke="#10b981"
          strokeWidth={2}
          dot={{ r: 2 }}
          connectNulls={false}
        />
        <Line
          type="monotone"
          dataKey="projected"
          stroke="#10b981"
          strokeWidth={2}
          strokeDasharray="5 4"
          dot={{ r: 2 }}
          connectNulls
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
