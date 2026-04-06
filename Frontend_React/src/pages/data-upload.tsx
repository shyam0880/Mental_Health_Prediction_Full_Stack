import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Upload, FileText, Database, BarChart3 } from "lucide-react";
import ModelBulletChart from "@/components/model-bullet-chart";

import { FLASK_API_URL } from "@/lib/queryClient";

export default function DataUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [uploadResult, setUploadResult] = useState<any>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const uploadMutation = useMutation({
    mutationFn: async (f: File) => {
      const formData = new FormData();
      formData.append("file", f);
      const res = await fetch(`${FLASK_API_URL}/upload_csv`, { method: "POST", body: formData });
      if (!res.ok) throw new Error("Upload failed");
      return res.json();
    },
    onSuccess: (data) => setUploadResult(data),
  });

  const handleFileSelect = (f: File) => {
    if (f && f.type === "text/csv") setFile(f);
    else alert("Please select a CSV file");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-900 dark:to-slate-800 py-16 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-800 dark:text-white mb-4">Data Upload & ML Training</h1>
          <p className="text-xl text-slate-600 dark:text-slate-300">Upload your mental health CSV dataset to train ML models and generate insights</p>
        </div>

        {!uploadResult ? (
          <Card className="max-w-2xl mx-auto bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
            <CardContent className="p-8">
              <div
                className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                  isDragOver
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
                    : "border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500"
                }`}
                onDrop={(e) => { e.preventDefault(); setIsDragOver(false); const f = e.dataTransfer.files[0]; if (f) handleFileSelect(f); }}
                onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                onDragLeave={(e) => { e.preventDefault(); setIsDragOver(false); }}
              >
                <Upload className="h-16 w-16 text-slate-400 dark:text-slate-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mb-2">Upload CSV Dataset</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-6">Drag and drop your CSV file here, or click to browse</p>
                <Input type="file" accept=".csv" className="mb-4 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200"
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileSelect(f); }} />
                {file && (
                  <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-700 rounded-lg flex items-center justify-center gap-2">
                    <FileText className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                    <span className="text-slate-700 dark:text-slate-200">{file.name}</span>
                    <span className="text-slate-500 dark:text-slate-400">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                  </div>
                )}
                <Button onClick={() => file && uploadMutation.mutate(file)} disabled={!file || uploadMutation.isPending} className="mt-6 bg-blue-600 hover:bg-blue-700">
                  {uploadMutation.isPending
                    ? <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />Processing & Training Models...</>
                    : <><Upload className="mr-2 h-4 w-4" />Upload & Process</>}
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {/* Dataset Overview */}
            <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-6 flex items-center text-slate-800 dark:text-white">
                  <Database className="mr-2 h-6 w-6" />Dataset Overview
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {[
                    { label: "Rows", value: uploadResult.shape[0].toLocaleString(), color: "blue" },
                    { label: "Columns", value: uploadResult.shape[1], color: "green" },
                    { label: "Duplicates Removed", value: uploadResult.duplicates, color: "amber" },
                    { label: "Models Trained", value: Object.keys(uploadResult.model_results).length, color: "purple" },
                  ].map(({ label, value, color }) => (
                    <div key={label} className={`text-center p-4 bg-${color}-50 dark:bg-${color}-950 rounded-lg`}>
                      <div className={`text-3xl font-bold text-${color}-600 dark:text-${color}-400 mb-2`}>{value}</div>
                      <div className="text-slate-600 dark:text-slate-400">{label}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Model Accuracy */}
            <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-6 flex items-center text-slate-800 dark:text-white">
                  <BarChart3 className="mr-2 h-6 w-6" />ML Model Accuracy
                </h2>
                <ModelBulletChart data={uploadResult.model_results} />
              </CardContent>
            </Card>

            {/* Gender Distribution */}
            <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-white">Gender Distribution</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {Object.entries(uploadResult.gender_count).map(([gender, count]) => (
                    <div key={gender} className="text-center p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                      <div className="text-2xl font-bold text-slate-700 dark:text-slate-200 mb-2">{count as number}</div>
                      <Badge variant="outline" className="dark:border-slate-500 dark:text-slate-300">{gender}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Dataset Columns */}
            <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-white">Dataset Columns</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {uploadResult.overview.each_columns.map((col: string) => (
                    <Badge key={col} variant="outline" className="p-2 text-center dark:border-slate-600 dark:text-slate-300">{col}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="text-center">
              <Button onClick={() => { setUploadResult(null); setFile(null); }} variant="outline"
                className="dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700">
                Upload Another Dataset
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
