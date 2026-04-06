import { useState } from "react";

interface DataQualityTableProps {
  data: Record<string, Record<string, number>>;
  title?: string;
}

export default function DataQualityTable({ data, title = "Value Counts" }: DataQualityTableProps) {
  const isValidData = data && typeof data === "object" && Object.keys(data).length > 0;
  const keys = isValidData ? Object.keys(data) : [];
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectedKey = keys[selectedIndex] ?? "";
  const selectedData = selectedKey ? data[selectedKey] : {};

  if (!isValidData) {
    return <div className="text-center text-slate-400 italic py-4">No data available.</div>;
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-slate-600 dark:text-slate-300">{title}</span>
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

      <div className="overflow-y-auto max-h-full rounded-lg border border-slate-200 dark:border-slate-600">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-slate-600 dark:bg-slate-700">
            <tr>
              <th className="px-3 py-2 text-left text-white font-medium">{selectedKey}</th>
              <th className="px-3 py-2 text-right text-white font-medium">Count</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
            {Object.entries(selectedData)
              .sort(([, a], [, b]) => (b as number) - (a as number))
              .map(([key, value]) => (
                <tr key={key} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                  <td className="px-3 py-2 text-slate-700 dark:text-slate-300">{key}</td>
                  <td className="px-3 py-2 text-right text-slate-800 dark:text-slate-200 font-medium tabular-nums">
                    {(value as number).toLocaleString()}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
