import { BarChart, Bar, XAxis, YAxis, Tooltip, Cell, LabelList, ResponsiveContainer } from "recharts";

interface ModelResult { accuracy: number; }
interface ModelBulletChartProps { data: Record<string, ModelResult>; }

const TOOLTIP_STYLE = {
  backgroundColor: "#1E293B",
  border: "1px solid #475569",
  borderRadius: "8px",
  color: "#F1F5F9",
};

const TICK_COLOR = "#64748B";   // slate-500 — readable on both light and dark

export default function ModelBulletChart({ data }: ModelBulletChartProps) {
  if (!data || Object.keys(data).length === 0) {
    return <div className="text-center text-slate-400 italic py-8">No model data available.</div>;
  }

  const chartData = Object.entries(data)
    .map(([model, { accuracy }]) => ({ model, accuracy: parseFloat((accuracy * 100).toFixed(1)) }))
    .sort((a, b) => b.accuracy - a.accuracy);

  const maxAccuracy = chartData[0]?.accuracy ?? 0;

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart layout="vertical" data={chartData} margin={{ top: 4, right: 56, left: 120, bottom: 4 }}>
        <XAxis type="number" domain={[60, 100]}
          tick={{ fill: TICK_COLOR, fontSize: 11 }}
          axisLine={false} tickLine={false}
          tickFormatter={(v) => `${v}%`} />
        <YAxis dataKey="model" type="category"
          tick={{ fill: TICK_COLOR, fontSize: 12 }}
          axisLine={false} tickLine={false} width={115} />
        <Tooltip contentStyle={TOOLTIP_STYLE}
          cursor={{ fill: "rgba(0,0,0,0.04)" }}
          formatter={(v: number) => [`${v}%`, "Accuracy"]} />
        <Bar dataKey="accuracy" radius={[0, 4, 4, 0]}>
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`}
              fill={entry.accuracy === maxAccuracy ? "#f87171" : "#34d399"} />
          ))}
          <LabelList dataKey="accuracy" position="right"
            style={{ fill: TICK_COLOR, fontWeight: 600, fontSize: 12 }}
            formatter={(v: number) => `${v}%`} />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
