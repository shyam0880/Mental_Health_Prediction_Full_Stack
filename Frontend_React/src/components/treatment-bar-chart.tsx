import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface TreatmentBarChartProps {
  data: Record<string, Array<Record<string, string | number>>>;
}

const TOOLTIP_STYLE = {
  backgroundColor: "#1E293B",
  border: "1px solid #475569",
  borderRadius: "8px",
  color: "#F1F5F9",
};

// Readable on both light and dark backgrounds
const TICK_COLOR = "#64748B";

export default function TreatmentBarChart({ data }: TreatmentBarChartProps) {
  const isValidData = data && typeof data === "object" && Object.keys(data).length > 0;
  const keys = isValidData ? Object.keys(data) : [];
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectedKey = keys[selectedIndex] ?? null;
  const selectedData = selectedKey ? data[selectedKey] : [];

  if (!isValidData) {
    return <div className="text-center text-slate-400 italic py-8">No data available.</div>;
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Category</span>
        <select
          className="bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 text-sm rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
          value={selectedIndex}
          onChange={(e) => setSelectedIndex(parseInt(e.target.value))}
        >
          {keys.map((item, index) => (
            <option key={index} value={index}>{item}</option>
          ))}
        </select>
      </div>

      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={selectedData} margin={{ top: 4, right: 8, left: -10, bottom: 4 }}>
          <XAxis dataKey={selectedKey!} tick={{ fill: TICK_COLOR, fontSize: 11 }}
            axisLine={{ stroke: "#94A3B8" }} tickLine={false} />
          <YAxis tick={{ fill: TICK_COLOR, fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ fill: "rgba(0,0,0,0.04)" }} />
          <Legend wrapperStyle={{ color: TICK_COLOR, fontSize: 12, paddingTop: 8 }} />
          <Bar dataKey="Yes" stackId="a" fill="#4ade80" radius={[0, 0, 0, 0]} />
          <Bar dataKey="No" stackId="a" fill="#818cf8" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
