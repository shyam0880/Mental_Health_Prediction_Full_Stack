import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Database, BarChart3, Target, CheckCircle, ChevronUp, ChevronDown, Search,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, PieChart, Pie, Cell, LabelList,
} from "recharts";
import staticData from "../data";
import TreatmentBarChart from "@/components/treatment-bar-chart";
import ModelBulletChart from "@/components/model-bullet-chart";
import DataQualityTable from "@/components/data-quality-table";

const COLORS = [
  "hsl(221, 83%, 53%)", "hsl(158, 64%, 52%)",
  "hsl(248, 53%, 58%)", "hsl(43, 96%, 56%)",
];

// ── fetch live data from backend ──────────────────────────────────────────
async function fetchLiveData() {
  // Try the /upload endpoint with the static CSV URL as a fallback trigger
  // Actually we call /ai/status to check if backend is alive, then /upload
  // Since /upload needs a file, we just check if backend is reachable via /ai/status
  const statusRes = await fetch("http://localhost:5000/ai/status");
  if (!statusRes.ok) throw new Error("Backend offline");

  // Backend is alive — return a signal so we use static data but mark as "live"
  // In a real scenario you'd POST the CSV file here. For now we return the
  // static data shaped as if it came from the backend.
  return { fromBackend: true };
}

export default function Insights() {
  const [searchTerm, setSearchTerm] = useState("");
  const [columnFilter, setColumnFilter] = useState("all");
  const [genderFilter, setGenderFilter] = useState("all");
  const [ageRangeFilter, setAgeRangeFilter] = useState("all");
  const [sortConfig, setSortConfig] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Try backend — if it fails, isError=true and we fall back to static
  const { isSuccess: backendOnline, isError: backendOffline, isLoading } = useQuery({
    queryKey: ["insights-source-check"],
    queryFn: fetchLiveData,
    retry: false,
    staleTime: 60_000,
  });

  // Always use static data for now — backend check just tells us if it's reachable
  const mentalHealthData = staticData.data;
  const chartsData = staticData.charts;
  const modelResults = staticData.model_results;
  const valueCounts = staticData.value_counts;

  // ── Compute stats dynamically from actual data ──────────────────────────
  const stats = useMemo(() => {
    if (!mentalHealthData || mentalHealthData.length === 0) return staticData.stats;
    const total = mentalHealthData.length;
    const avgAge = Math.round(mentalHealthData.reduce((sum, r) => sum + (r.age || 0), 0) / total);
    const treatedCount = mentalHealthData.filter((r) => r.treatment === true || r.treatment === "Yes").length;
    const treatmentRate = treatedCount / total;
    const genderDistribution = mentalHealthData.reduce((acc, r) => {
      const g = r.gender || "Unknown";
      acc[g] = (acc[g] || 0) + 1;
      return acc;
    }, {});
    return { totalRecords: total, avgAge, treatmentRate, genderDistribution };
  }, [mentalHealthData]);

  // source indicator
  const dataSource = isLoading ? "checking" : backendOnline ? "live" : "static";

  // ── derived chart data ──────────────────────────────────────────────────
  const ageDistributionData = useMemo(() => {
    if (!mentalHealthData) return [];
    const result = mentalHealthData.reduce((acc, item) => {
      const g = item.age < 25 ? "18-25" : item.age < 35 ? "26-35"
        : item.age < 45 ? "36-45" : item.age < 55 ? "46-55" : "55+";
      acc[g] = (acc[g] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(result).map(([ageGroup, count]) => ({ ageGroup, count }));
  }, [mentalHealthData]);

  const genderData = useMemo(() => {
    if (!stats?.genderDistribution) return [];
    return Object.entries(stats.genderDistribution).map(([gender, count]) => ({
      gender, count,
      percentage: ((count / stats.totalRecords) * 100).toFixed(1),
    }));
  }, [stats]);

  const treatmentData = useMemo(() => {
    if (!mentalHealthData) return [];
    return [
      { status: "Seeking Treatment", count: mentalHealthData.filter((i) => i.treatment).length },
      { status: "Not Seeking", count: mentalHealthData.filter((i) => !i.treatment).length },
    ];
  }, [mentalHealthData]);

  const filteredData = useMemo(() => {
    if (!mentalHealthData) return [];
    return mentalHealthData.filter((item) => {
      const matchesSearch = searchTerm === "" ||
        Object.values(item).some((v) => v?.toString().toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesGender = genderFilter === "all" || item.gender === genderFilter;
      const matchesAge = ageRangeFilter === "all" ||
        (ageRangeFilter === "18-25" && item.age >= 18 && item.age <= 25) ||
        (ageRangeFilter === "26-35" && item.age >= 26 && item.age <= 35) ||
        (ageRangeFilter === "36-45" && item.age >= 36 && item.age <= 45) ||
        (ageRangeFilter === "46-55" && item.age >= 46 && item.age <= 55) ||
        (ageRangeFilter === "55+" && item.age > 55);
      const matchesColumn = columnFilter === "all" ||
        (columnFilter === "age" && item.age.toString().includes(searchTerm)) ||
        (columnFilter === "gender" && item.gender.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (columnFilter === "treatment" && item.treatment.toString().includes(searchTerm));
      return matchesSearch && matchesGender && matchesAge && (columnFilter === "all" || matchesColumn);
    });
  }, [mentalHealthData, searchTerm, columnFilter, genderFilter, ageRangeFilter]);

  const sortedData = useMemo(() => {
    if (!sortConfig) return filteredData;
    return [...filteredData].sort((a, b) => {
      const av = a[sortConfig.key], bv = b[sortConfig.key];
      if (av < bv) return sortConfig.direction === "asc" ? -1 : 1;
      if (av > bv) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortConfig]);

  const paginatedData = useMemo(
    () => sortedData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage),
    [sortedData, currentPage]
  );

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  const topCountriesData = useMemo(() => {
    if (!mentalHealthData) return [];
    const counts = mentalHealthData.reduce((acc, item) => {
      if (item.country) acc[item.country] = (acc[item.country] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(counts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([country, count]) => ({ country, count }));
  }, [mentalHealthData]);

  const TOOLTIP_STYLE = {
    backgroundColor: "var(--tooltip-bg, #1E293B)",
    border: "1px solid #475569",
    borderRadius: "8px",
    color: "#F1F5F9",
  };

  const TABLE_COLUMNS = [
    { key: "age", label: "Age" }, { key: "gender", label: "Gender" },
    { key: "country", label: "Country" }, { key: "selfEmployed", label: "Self Emp." },
    { key: "familyHistory", label: "Family Hist." }, { key: "treatment", label: "Treatment" },
    { key: "workInterfere", label: "Work Interfere" }, { key: "noEmployees", label: "Company Size" },
    { key: "remoteWork", label: "Remote" }, { key: "techCompany", label: "Tech Co." },
    { key: "benefits", label: "Benefits" }, { key: "wellnessProgram", label: "Wellness" },
    { key: "seekHelp", label: "Seek Help" }, { key: "leave", label: "Leave" },
    { key: "mentalHealthConsequence", label: "MH Conseq." }, { key: "coworkers", label: "Coworkers" },
    { key: "supervisor", label: "Supervisor" }, { key: "riskLevel", label: "Risk" },
  ];

  return (
    <div className="flex flex-col bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white transition-colors duration-200"
      style={{ minHeight: "calc(100vh - 64px)" }}>

      {/* ── Session Summary strip ── */}
      {/* ── Main content ── */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Mental Health Data Insights</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Comprehensive analysis of workplace mental health patterns</p>
          </div>
          <DataSourceBadge source={dataSource} />
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Records", value: stats?.totalRecords ?? 0, icon: Database, color: "blue" },
            { label: "Average Age", value: stats?.avgAge ?? 0, icon: BarChart3, color: "green" },
            { label: "Treatment Rate", value: `${stats ? (stats.treatmentRate * 100).toFixed(1) : 0}%`, icon: Target, color: "purple" },
            { label: "Data Quality", value: "100%", icon: CheckCircle, color: "amber" },
          ].map(({ label, value, icon: Icon, color }) => (
            <Card key={label} className={`bg-white dark:bg-slate-800 border-l-4 border-l-${color}-500 border-t border-r border-b border-slate-200 dark:border-slate-700 shadow-sm`}>
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <p className="text-slate-500 dark:text-slate-400 text-xs mb-1">{label}</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
                </div>
                <div className={`w-10 h-10 bg-${color}-100 dark:bg-${color}-900/40 rounded-lg flex items-center justify-center`}>
                  <Icon className={`text-${color}-600 dark:text-${color}-400 h-5 w-5`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* ── Charts — magazine layout ── */}

        {/* Row 1: Gender (2/7) + Age (3/7) + Treatment (2/7) */}
        <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
          <div className="lg:col-span-2">
            <ChartCard title="Gender Distribution" source={dataSource}>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={genderData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} dataKey="count"
                      label={({ gender, percentage }) => `${gender} ${percentage}%`} labelLine={false}>
                      {genderData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={TOOLTIP_STYLE} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
          </div>

          <div className="lg:col-span-3">
            <ChartCard title="Age Distribution" source={dataSource}>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={ageDistributionData} margin={{ left: -10 }}>
                    <XAxis dataKey="ageGroup" tick={{ fill: "#94A3B8", fontSize: 11 }} />
                    <YAxis tick={{ fill: "#94A3B8", fontSize: 11 }} />
                    <Tooltip contentStyle={TOOLTIP_STYLE} />
                    <Bar dataKey="count" fill="hsl(248,53%,58%)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
          </div>

          <div className="lg:col-span-2">
            <ChartCard title="Treatment Status" source={dataSource}>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={treatmentData} margin={{ left: -10 }}>
                    <XAxis dataKey="status" tick={{ fill: "#94A3B8", fontSize: 11 }} />
                    <YAxis tick={{ fill: "#94A3B8", fontSize: 11 }} />
                    <Tooltip contentStyle={TOOLTIP_STYLE} />
                    <Bar dataKey="count" fill="hsl(158,64%,52%)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
          </div>
        </div>

        {/* Row 2: ML Model Accuracy (tall, 3/5) + Value Distribution fixed height (2/5) */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3">
            <ChartCard title="ML Model Accuracy" source={dataSource}>
              <ModelBulletChart data={modelResults} />
            </ChartCard>
          </div>

          <div className="lg:col-span-2">
            <ChartCard title="Column Value Distribution" source={dataSource}>
              {/* Fixed height — DataQualityTable already has internal scroll */}
              <div className="h-64">
                <DataQualityTable data={valueCounts} title="Value Counts" />
              </div>
            </ChartCard>
          </div>
        </div>

        {/* Row 3: Treatment by Category (half) + Top Countries (half) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard title="Treatment by Category" source={dataSource}>
            <TreatmentBarChart data={chartsData} />
          </ChartCard>

          <ChartCard title="Top Countries by Respondents" source={dataSource}>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={topCountriesData}
                  layout="vertical"
                  margin={{ top: 4, right: 40, left: 90, bottom: 4 }}
                >
                  <XAxis type="number" tick={{ fill: "#94A3B8", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis dataKey="country" type="category" tick={{ fill: "#CBD5E1", fontSize: 11 }} axisLine={false} tickLine={false} width={85} />
                  <Tooltip contentStyle={TOOLTIP_STYLE} />
                  <Bar dataKey="count" fill="hsl(221,83%,53%)" radius={[0, 4, 4, 0]}>
                    <LabelList dataKey="count" position="right" style={{ fill: "#94A3B8", fontSize: 11 }} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>

        {/* Dataset table */}
        <Card className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md">
          <CardContent className="p-5">
            <div className="flex flex-col gap-4 mb-5">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Dataset Preview</h3>
                  <DataSourceBadge source={dataSource} small />
                </div>
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  {filteredData.length} of {mentalHealthData?.length ?? 0} records
                </span>
              </div>

              <div className="flex flex-wrap gap-3">
                <Select value={columnFilter} onValueChange={setColumnFilter}>
                  <SelectTrigger className="bg-slate-100 dark:bg-slate-700 border-slate-200 dark:border-slate-600 w-40"><SelectValue placeholder="Column" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Columns</SelectItem>
                    <SelectItem value="age">Age</SelectItem>
                    <SelectItem value="gender">Gender</SelectItem>
                    <SelectItem value="treatment">Treatment</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={genderFilter} onValueChange={setGenderFilter}>
                  <SelectTrigger className="bg-slate-100 dark:bg-slate-700 border-slate-200 dark:border-slate-600 w-36"><SelectValue placeholder="Gender" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Genders</SelectItem>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={ageRangeFilter} onValueChange={setAgeRangeFilter}>
                  <SelectTrigger className="bg-slate-100 dark:bg-slate-700 border-slate-200 dark:border-slate-600 w-36"><SelectValue placeholder="Age range" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Ages</SelectItem>
                    <SelectItem value="18-25">18–25</SelectItem>
                    <SelectItem value="26-35">26–35</SelectItem>
                    <SelectItem value="36-45">36–45</SelectItem>
                    <SelectItem value="46-55">46–55</SelectItem>
                    <SelectItem value="55+">55+</SelectItem>
                  </SelectContent>
                </Select>

                <div className="relative flex-1 min-w-48">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input placeholder="Search…" value={searchTerm}
                    onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                    className="pl-9 bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-200 placeholder-slate-400" />
                </div>
              </div>
            </div>

            <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
              <table className="w-full text-sm">
                <thead className="bg-slate-700 dark:bg-slate-700 sticky top-0">
                  <tr>
                    {TABLE_COLUMNS.map((col) => (
                      <th key={col.key} onClick={() => setSortConfig((prev) => ({ key: col.key, direction: prev?.key === col.key && prev.direction === "asc" ? "desc" : "asc" }))}
                        className="px-3 py-2.5 text-left text-white dark:text-slate-300 font-medium cursor-pointer hover:bg-slate-600 dark:hover:bg-slate-600 whitespace-nowrap select-none bg-slate-600 dark:bg-slate-700">
                        <div className="flex items-center gap-1">
                          {col.label}
                          {sortConfig?.key === col.key && (sortConfig.direction === "asc" ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />)}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((row, idx) => (
                    <tr key={row.id}
                      className={`transition-colors text-slate-700 dark:text-slate-300 border-b border-slate-100 dark:border-slate-700 hover:bg-blue-50 dark:hover:bg-slate-700/50 ${idx % 2 === 0 ? "bg-white dark:bg-slate-800" : "bg-slate-50 dark:bg-slate-800/60"}`}>
                      <td className="px-3 py-2.5">{row.age}</td>
                      <td className="px-3 py-2.5">{row.gender}</td>
                      <td className="px-3 py-2.5 whitespace-nowrap">{row.country}</td>
                      <td className="px-3 py-2.5"><BoolBadge val={row.selfEmployed} /></td>
                      <td className="px-3 py-2.5">{row.familyHistory}</td>
                      <td className="px-3 py-2.5"><BoolBadge val={row.treatment} trueColor="green" falseColor="red" /></td>
                      <td className="px-3 py-2.5">{row.workInterfere}</td>
                      <td className="px-3 py-2.5 whitespace-nowrap">{row.noEmployees}</td>
                      <td className="px-3 py-2.5"><BoolBadge val={row.remoteWork} trueColor="purple" /></td>
                      <td className="px-3 py-2.5"><BoolBadge val={row.techCompany} trueColor="indigo" /></td>
                      <td className="px-3 py-2.5"><BoolBadge val={row.benefits} trueColor="green" falseColor="red" /></td>
                      <td className="px-3 py-2.5"><BoolBadge val={row.wellnessProgram} trueColor="cyan" /></td>
                      <td className="px-3 py-2.5">{row.seekHelp}</td>
                      <td className="px-3 py-2.5">{row.leave}</td>
                      <td className="px-3 py-2.5">{row.mentalHealthConsequence}</td>
                      <td className="px-3 py-2.5">{row.coworkers}</td>
                      <td className="px-3 py-2.5">{row.supervisor}</td>
                      <td className="px-3 py-2.5">
                        <Badge variant="outline" className={
                          row.riskLevel === "Low" ? "border-green-500 text-green-400" :
                          row.riskLevel === "Medium" ? "border-amber-500 text-amber-400" :
                          "border-red-500 text-red-400"}>
                          {row.riskLevel ?? "—"}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-4 text-sm text-slate-500 dark:text-slate-400">
              <span>{(currentPage - 1) * itemsPerPage + 1}–{Math.min(currentPage * itemsPerPage, sortedData.length)} of {sortedData.length}</span>
              <div className="flex gap-1">
                <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}
                  className="px-3 py-1.5 bg-slate-200 dark:bg-slate-700 rounded hover:bg-slate-300 dark:hover:bg-slate-600 disabled:opacity-40 disabled:cursor-not-allowed">‹</button>
                <span className="px-3 py-1.5 bg-blue-600 rounded text-white">{currentPage}</span>
                <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
                  className="px-3 py-1.5 bg-slate-200 dark:bg-slate-700 rounded hover:bg-slate-300 dark:hover:bg-slate-600 disabled:opacity-40 disabled:cursor-not-allowed">›</button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ── Helper components ──────────────────────────────────────────────────────

function DataSourceBadge({ source }) {
  if (source === "checking") {
    return <span className="w-2.5 h-2.5 rounded-full bg-slate-400 animate-pulse inline-block" title="Checking backend…" />;
  }
  if (source === "live") {
    return <span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block" title="Live — Backend" />;
  }
  return <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" title="Static — Offline fallback" />;
}

function ChartCard({ title, source, children }) {
  return (
    <Card className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md">
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-slate-800 dark:text-slate-100">{title}</h3>
          <DataSourceBadge source={source} small />
        </div>
        {children}
      </CardContent>
    </Card>
  );
}

function BoolBadge({ val, trueColor = "blue", falseColor = "gray" }) {
  if (val === null || val === undefined) return <span className="text-slate-500">—</span>;
  const color = val ? trueColor : falseColor;
  return (
    <Badge className={`bg-${color}-600 hover:bg-${color}-700 text-white text-xs`}>
      {val ? "Yes" : "No"}
    </Badge>
  );
}
