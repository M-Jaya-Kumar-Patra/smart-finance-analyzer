"use client";

import { PieChart, Pie, Cell, Tooltip } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default function ExpenseChart({ data }) {
  return (
    <PieChart width={300} height={300}>
      <Pie data={data} dataKey="value" outerRadius={100}>
        {data.map((entry, index) => (
          <Cell key={index} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
    </PieChart>
  );
}