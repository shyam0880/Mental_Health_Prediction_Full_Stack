import React, { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Heart, AlertTriangle, CheckCircle, MessageCircle, BarChart3, Brain, History, Trash2, X } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { getAvailableModels } from "@/lib/mental-health";

const mlHealthQuestions = [
  { id: "age", question: "What is your age?", type: "number", min: 18, max: 100 },
  { id: "gender", question: "What is your gender?", options: ["Male", "Female", "Other"] },
  { id: "self_employed", question: "Are you self-employed?", options: ["Yes", "No"] },
  { id: "family_history", question: "Do you have a family history of mental illness?", options: ["Yes", "No"] },
  { id: "work_interfere", question: "If you have a mental health condition, do you feel that it interferes with your work?", options: ["Often", "Rarely", "Never", "Sometimes"] },
  { id: "no_employees", question: "How many employees does your company or organization have?", options: ["1-5", "6-25", "26-100", "100-500", "500-1000", "More than 1000"] },
  { id: "remote_work", question: "Do you work remotely at least 50% of the time?", options: ["Yes", "No"] },
  { id: "tech_company", question: "Is your employer primarily a tech company/organization?", options: ["Yes", "No"] },
  { id: "benefits", question: "Does your employer provide mental health benefits?", options: ["Yes", "No", "Don't know"] },
  { id: "care_options", question: "Do you know the options for mental health care your employer provides?", options: ["Yes", "No", "Not sure"] },
  { id: "wellness_program", question: "Has your employer ever discussed mental health as part of an employee wellness program?", options: ["Yes", "No", "Don't know"] },
  { id: "seek_help", question: "Does your employer provide resources to learn more about mental health issues and how to seek help?", options: ["Yes", "No", "Don't know"] },
  { id: "anonymity", question: "Is your anonymity protected if you choose to take advantage of mental health treatment resources?", options: ["Yes", "No", "Don't know"] },
  { id: "leave", question: "How easy is it for you to take medical leave for a mental health condition?", options: ["Very easy", "Somewhat easy", "Don't know", "Somewhat difficult", "Very difficult"] },
  { id: "mental_health_consequence", question: "Do you think that discussing a mental health issue with your employer would have negative consequences?", options: ["Yes", "No", "Maybe"] },
  { id: "phys_health_consequence", question: "Do you think that discussing a physical health issue with your employer would have negative consequences?", options: ["Yes", "No", "Maybe"] },
  { id: "coworkers", question: "Would you be willing to discuss a mental health issue with your coworkers?", options: ["Yes", "No", "Some of them"] },
  { id: "supervisor", question: "Would you be willing to discuss a mental health issue with your direct supervisor(s)?", options: ["Yes", "No", "Some of them"] },
  { id: "mental_health_interview", question: "Would you bring up a mental health issue with a potential employer in an interview?", options: ["Yes", "No", "Maybe"] },
  { id: "phys_health_interview", question: "Would you bring up a physical health issue with a potential employer in an interview?", options: ["Yes", "No", "Maybe"] },
  { id: "mental_vs_physical", question: "Do you feel that your employer takes mental health as seriously as physical health?", options: ["Yes", "No", "Don't know"] },
  { id: "obs_consequence", question: "Have you heard of or observed negative consequences for coworkers with mental health conditions in your workplace?", options: ["Yes", "No"] },
];

export default function Checkup() {
  const [, setLocation] = useLocation();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [showResults, setShowResults] = useState(false);
  const [prediction, setPrediction] = useState<number | null>(null);
  const [suggestion, setSuggestion] = useState("");
  const [selectedModel, setSelectedModel] = useState("GradientBoosting");
  const [showHistory, setShowHistory] = useState(false);

  // ── Assessment history in localStorage ────────────────────────────────
  const [history, setHistory] = useState<Array<{
    id: string; date: string; model: string;
    prediction: number; suggestion: string;
  }>>(() => {
    try {
      return JSON.parse(localStorage.getItem("assessment_history") || "[]");
    } catch { return []; }
  });

  const saveToHistory = (pred: number, sug: string) => {
    const entry = {
      id: Date.now().toString(),
      date: new Date().toLocaleString(),
      model: selectedModel,
      prediction: pred,
      suggestion: sug,
    };
    const updated = [entry, ...history].slice(0, 10); // keep last 10
    setHistory(updated);
    localStorage.setItem("assessment_history", JSON.stringify(updated));
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem("assessment_history");
  };

  const { data: modelData } = useQuery({ queryKey: ["available-models"], queryFn: getAvailableModels, retry: false });

  const predictMutation = useMutation({
    mutationFn: async (formData: Record<string, any>) => {
      const res = await apiRequest("POST", `/predict?model=${selectedModel}`, formData);
      return res.json();
    },
    onSuccess: async (result: { prediction: number }) => {
      setPrediction(result.prediction);
      const suggestionRes = await apiRequest("POST", "/suggest", { prediction: result.prediction.toString(), data: responses });
      const suggestionData = await suggestionRes.json();
      setSuggestion(suggestionData.suggestion);
      saveToHistory(result.prediction, suggestionData.suggestion);
      setShowResults(true);
    },
  });

  const currentQuestion = mlHealthQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / mlHealthQuestions.length) * 100;

  const handleAnswerSelect = (value: string) => {
    setResponses((prev) => ({
      ...prev,
      [currentQuestion.id]: currentQuestion.type === "number" ? parseInt(value) : value,
    }));
  };

  const resetQuestionnaire = () => {
    setCurrentQuestionIndex(0);
    setResponses({});
    setShowResults(false);
    setPrediction(null);
    setSuggestion("");
  };

  if (showResults && prediction !== null) {
    const isRisk = prediction === 1;
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-900 dark:to-slate-800 py-16 transition-colors duration-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="p-8 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
            <CardContent className="p-0 text-center">
              <div className={`w-32 h-32 rounded-full mx-auto mb-6 flex items-center justify-center ${isRisk ? "bg-red-600" : "bg-green-600"}`}>
                {isRisk ? <AlertTriangle className="w-12 h-12 text-white" /> : <CheckCircle className="w-12 h-12 text-white" />}
              </div>
              <h2 className="text-3xl font-bold mb-2">
                <Badge variant="outline" className={`text-lg px-4 py-2 ${isRisk ? "border-red-600 text-red-600" : "border-green-600 text-green-600"}`}>
                  {isRisk ? "Treatment Recommended" : "Good Mental Health"}
                </Badge>
              </h2>
              <p className="text-sm text-slate-400 dark:text-slate-400 mb-4">Model used: {selectedModel}</p>
              <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto">
                {isRisk ? "Based on your responses, our AI model suggests that seeking mental health treatment would be beneficial." : "Based on your responses, you appear to have good mental health status. Keep up the positive habits!"}
              </p>
              {suggestion && (
                <div className="bg-slate-50 dark:bg-slate-700 rounded-xl p-6 mb-8 text-left max-w-2xl mx-auto">
                  <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-4">AI-Generated Personalized Advice</h3>
                  <div className="p-4 bg-white dark:bg-slate-600 rounded-lg shadow-sm flex items-start gap-3">
                    {isRisk ? <Heart className="h-5 w-5 text-red-600 mt-1 shrink-0" /> : <CheckCircle className="h-5 w-5 text-green-600 mt-1 shrink-0" />}
                    <span className="text-slate-700 dark:text-slate-200 whitespace-pre-wrap">{suggestion}</span>
                  </div>
                </div>
              )}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button onClick={() => setLocation("/chat")} className="bg-green-600 hover:bg-green-700">
                  <MessageCircle className="mr-2 h-4 w-4" /> Get Mental Health Tips
                </Button>
                <Button onClick={() => setLocation("/insights")} variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950">
                  <BarChart3 className="mr-2 h-4 w-4" /> View Data Insights
                </Button>
                <Button onClick={resetQuestionnaire} variant="outline">Take Assessment Again</Button>
                {history.length > 1 && (
                  <Button onClick={() => { resetQuestionnaire(); setTimeout(() => setShowHistory(true), 100); }} variant="outline">
                    <History className="mr-2 h-4 w-4" /> View History
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-900 dark:to-slate-800 py-16 transition-colors duration-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-800 dark:text-white mb-4">AI-Powered Mental Health Assessment</h1>
          <p className="text-xl text-slate-600 dark:text-slate-300">Get personalized mental health insights using advanced machine learning</p>
        </div>

        {/* History toggle button */}
        {history.length > 0 && (
          <div className="flex justify-end mb-4">
            <button onClick={() => setShowHistory(!showHistory)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 text-sm font-medium transition-colors">
              <History className="h-4 w-4" />
              {showHistory ? "Hide History" : `Past Assessments (${history.length})`}
            </button>
          </div>
        )}

        {/* History panel */}
        {showHistory && history.length > 0 && (
          <Card className="mb-6 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-800 dark:text-white flex items-center gap-2">
                  <History className="h-4 w-4" /> Assessment History
                </h3>
                <div className="flex gap-2">
                  <button onClick={clearHistory}
                    className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 transition-colors">
                    <Trash2 className="h-3 w-3" /> Clear all
                  </button>
                  <button onClick={() => setShowHistory(false)} className="text-slate-400 hover:text-slate-600">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {history.map((entry) => (
                  <div key={entry.id} className={`p-4 rounded-lg border-l-4 ${entry.prediction === 1 ? "border-red-500 bg-red-50 dark:bg-red-950/30" : "border-green-500 bg-green-50 dark:bg-green-950/30"}`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {entry.prediction === 1
                          ? <AlertTriangle className="h-4 w-4 text-red-600" />
                          : <CheckCircle className="h-4 w-4 text-green-600" />}
                        <span className={`text-sm font-semibold ${entry.prediction === 1 ? "text-red-700 dark:text-red-400" : "text-green-700 dark:text-green-400"}`}>
                          {entry.prediction === 1 ? "Treatment Recommended" : "Good Mental Health"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                        <Badge variant="outline" className="text-xs dark:border-slate-600">{entry.model}</Badge>
                        <span>{entry.date}</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">{entry.suggestion}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Model selector */}
        {modelData?.models && modelData.models.length > 0 && (
          <Card className="mb-6 p-4 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
            <CardContent className="p-0 flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200 font-medium">
                <Brain className="h-4 w-4 text-blue-600" /> Prediction Model:
              </div>
              <div className="flex flex-wrap gap-2">
                {modelData.models.map((m: string) => (
                  <button key={m} onClick={() => setSelectedModel(m)}
                    className={`px-3 py-1 rounded-full text-sm font-medium border transition-all ${
                      selectedModel === m
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-300 dark:border-slate-600 hover:border-blue-400"
                    }`}>
                    {m}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="p-8 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
          <CardContent className="p-0 space-y-8">
            {/* Progress */}
            <div>
              <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400 mb-2">
                <span>Progress</span>
                <span>{currentQuestionIndex + 1}/{mlHealthQuestions.length}</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            {/* Question */}
            <div>
              <h3 className="text-2xl font-semibold text-slate-800 dark:text-white mb-6">{currentQuestion.question}</h3>
              {currentQuestion.type === "number" ? (
                <input
                  type="number"
                  min={currentQuestion.min}
                  max={currentQuestion.max}
                  value={responses[currentQuestion.id] || ""}
                  onChange={(e) => handleAnswerSelect(e.target.value)}
                  className="w-full p-4 text-lg border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white placeholder-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 outline-none transition-colors"
                  placeholder={`Enter your age (${currentQuestion.min}-${currentQuestion.max})`}
                />
              ) : (
                <RadioGroup value={responses[currentQuestion.id] || ""} onValueChange={handleAnswerSelect} className="space-y-3">
                  {currentQuestion.options?.map((option) => (
                    <div key={option}
                      className="flex items-center p-4 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950 cursor-pointer transition-all">
                      <RadioGroupItem value={option} id={`option-${option}`} className="mr-4" />
                      <Label htmlFor={`option-${option}`} className="text-lg cursor-pointer flex-1 text-slate-800 dark:text-slate-200">{option}</Label>
                    </div>
                  ))}
                </RadioGroup>
              )}
            </div>

            {/* Navigation */}
            <div className="flex justify-between pt-8">
              <Button onClick={() => setCurrentQuestionIndex((p) => p - 1)} variant="outline" disabled={currentQuestionIndex === 0}>
                <ChevronLeft className="mr-2 h-4 w-4" /> Previous
              </Button>
              <Button onClick={() => {
                if (currentQuestionIndex < mlHealthQuestions.length - 1) setCurrentQuestionIndex((p) => p + 1);
                else predictMutation.mutate(responses);
              }} disabled={!responses[currentQuestion.id] || predictMutation.isPending} className="bg-blue-600 hover:bg-blue-700">
                {predictMutation.isPending ? "Analyzing with AI..." : currentQuestionIndex === mlHealthQuestions.length - 1
                  ? <><span>Get AI Prediction</span><CheckCircle className="ml-2 h-4 w-4" /></>
                  : <><span>Next</span><ChevronRight className="ml-2 h-4 w-4" /></>}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
