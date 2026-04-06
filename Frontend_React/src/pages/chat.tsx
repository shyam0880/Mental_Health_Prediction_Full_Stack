import React, { useState, useRef, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Bot, User, Send, Phone, MessageSquare, Laptop, ExternalLink, Wifi, WifiOff, AlertCircle, RefreshCw, Trash2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import BotpressChat from "@/components/botpress-chat";
import { getAiStatus, setAiMode } from "@/lib/mental-health";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  error?: boolean;
}

const QUICK_PROMPTS = [
  { label: "Feeling stressed", msg: "I am feeling stressed at work lately." },
  { label: "Relaxation tips", msg: "I need some relaxation techniques." },
  { label: "Work-life balance", msg: "Can you give me work-life balance tips?" },
  { label: "Anxiety help", msg: "I need help managing my anxiety." },
];

const RESOURCES = [
  { icon: Phone, color: "red", title: "Crisis Hotline", desc: "24/7 emergency support", action: "988", href: "tel:988" },
  { icon: MessageSquare, color: "blue", title: "Crisis Text Line", desc: "Text HOME to 741741", action: "Text now", href: "sms:741741" },
  { icon: Laptop, color: "green", title: "SAMHSA", desc: "Mental health resources", action: "Visit site", href: "https://www.samhsa.gov" },
];

const CONTEXT = "You are a mental health support assistant. Provide helpful, empathetic responses about stress management, anxiety coping strategies, work-life balance, relaxation methods, and when to seek professional help. Always encourage professional help when needed.";

export default function Chat() {
  const [input, setInput] = useState("");
  const [activeTab, setActiveTab] = useState<"ai" | "botpress">("ai");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // ── Persist chat history in localStorage ──────────────────────────────
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem("chat_history");
      if (!saved) return [];
      return JSON.parse(saved).map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) }));
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("chat_history", JSON.stringify(messages));
    } catch {}
  }, [messages]);

  const clearHistory = () => {
    setMessages([]);
    localStorage.removeItem("chat_history");
  };

  const { data: aiStatus, refetch: refetchStatus } = useQuery({
    queryKey: ["ai-status"],
    queryFn: getAiStatus,
    retry: false,
    staleTime: 30_000,
  });

  const switchModeMutation = useMutation({
    mutationFn: (mode: "local" | "cloud") => setAiMode(mode),
    onSuccess: () => refetchStatus(),
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMutation = useMutation({
    mutationFn: async (text: string) => {
      // Build history from current messages to send as context
      const history = messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));
      const res = await apiRequest("POST", "/chat", {
        question: text,
        context: CONTEXT,
        history,          // send full conversation history
      });
      return res.json() as Promise<{ response: string; mode: string }>;
    },
    onMutate: (text: string) => {
      setMessages((prev) => [...prev, { id: `u-${Date.now()}`, role: "user", content: text, timestamp: new Date() }]);
      setInput("");
    },
    onSuccess: (data) => {
      setMessages((prev) => [...prev, { id: `a-${Date.now()}`, role: "assistant", content: data.response, timestamp: new Date() }]);
    },
    onError: (err: Error) => {
      setMessages((prev) => [...prev, { id: `e-${Date.now()}`, role: "assistant", content: `Sorry, I couldn't connect to the server. ${err.message}`, timestamp: new Date(), error: true }]);
    },
  });

  const handleSend = () => {
    const text = input.trim();
    if (!text || sendMutation.isPending) return;
    sendMutation.mutate(text);
  };

  return (
    <div className="flex flex-col transition-colors duration-200" style={{ height: "calc(100vh - 64px)" }}>

      {/* ── Top bar ── */}
      <div className="flex items-center justify-between px-4 py-2 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 shrink-0">
        <div className="flex gap-1">
          {(["ai", "botpress"] as const).map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab
                  ? tab === "ai" ? "bg-blue-600 text-white" : "bg-green-600 text-white"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}>
              {tab === "ai" ? <><Bot className="h-4 w-4" />AI Chat</> : <><MessageSquare className="h-4 w-4" />Live Bot</>}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          {messages.length > 0 && activeTab === "ai" && (
            <button onClick={clearHistory}
              className="flex items-center gap-1 text-xs text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
              title="Clear chat history">
              <Trash2 className="h-3 w-3" /> Clear
            </button>
          )}
          {aiStatus ? (
            <>
              <span className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                <Wifi className="h-3 w-3" />Backend online
              </span>
              <div className="flex items-center gap-1">
                {aiStatus.available_modes.map((m: string) => (
                  <button
                    key={m}
                    onClick={() => switchModeMutation.mutate(m as "local" | "cloud")}
                    disabled={switchModeMutation.isPending}
                    title={m === "local" ? "Uses local AI model on the server" : "Uses cloud AI (OpenRouter)"}
                    className={`px-2 py-0.5 rounded text-xs font-medium border transition-colors ${
                      aiStatus.current_mode === m
                        ? "bg-blue-600 text-white border-blue-600"
                        : "text-slate-500 dark:text-slate-400 border-slate-300 dark:border-slate-600 hover:border-blue-400"
                    }`}>
                    {m}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <>
              <span className="flex items-center gap-1 text-xs text-red-500 dark:text-red-400">
                <WifiOff className="h-3 w-3" />Backend offline
              </span>
              {/* Show disabled mode buttons when backend is offline */}
              <div className="flex items-center gap-1">
                {(["local", "cloud"] as const).map((m) => (
                  <button
                    key={m}
                    disabled
                    title="Backend is offline — start the Flask server to use AI chat"
                    className="px-2 py-0.5 rounded text-xs font-medium border border-slate-200 dark:border-slate-700 text-slate-300 dark:text-slate-600 cursor-not-allowed opacity-50">
                    {m}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── Botpress tab ── */}
      {activeTab === "botpress" && <div className="flex-1 overflow-hidden"><BotpressChat /></div>}

      {/* ── AI Chat tab ── */}
      {activeTab === "ai" && (
        <div className="flex flex-1 overflow-hidden">

          {/* Main chat column */}
          <div className="flex flex-col flex-1 overflow-hidden bg-slate-50 dark:bg-slate-950">

            {/* Messages area */}
            <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
              {messages.length === 0 && (
                <div className="max-w-2xl mx-auto text-center py-12">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Bot className="h-8 w-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-semibold text-slate-800 dark:text-white mb-2">MindCheck Assistant</h2>
                  <p className="text-slate-500 dark:text-slate-400 mb-8">
                    I'm here to support your mental wellbeing. Ask me anything about stress, anxiety, or work-life balance.
                  </p>
                  <div className="grid grid-cols-2 gap-2 max-w-md mx-auto">
                    {QUICK_PROMPTS.map(({ label, msg }) => (
                      <button key={label} onClick={() => sendMutation.mutate(msg)} disabled={sendMutation.isPending}
                        className="p-3 text-sm text-left bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950 transition-colors text-slate-700 dark:text-slate-300">
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((msg) => (
                <div key={msg.id} className={`flex gap-3 max-w-3xl ${msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    msg.role === "user" ? "bg-blue-600" : msg.error ? "bg-red-500" : "bg-gradient-to-br from-blue-500 to-green-500"
                  }`}>
                    {msg.role === "user" ? <User className="h-4 w-4 text-white" /> : msg.error ? <AlertCircle className="h-4 w-4 text-white" /> : <Bot className="h-4 w-4 text-white" />}
                  </div>
                  <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed max-w-[75%] ${
                    msg.role === "user"
                      ? "bg-blue-600 text-white rounded-tr-sm"
                      : msg.error
                      ? "bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800 rounded-tl-sm"
                      : "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-sm rounded-tl-sm"
                  }`}>
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                    <p className={`text-xs mt-1 ${msg.role === "user" ? "text-blue-200" : "text-slate-400"}`}>
                      {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
              ))}

              {sendMutation.isPending && (
                <div className="flex gap-3 max-w-3xl mr-auto">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center shrink-0">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                  <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm rounded-2xl rounded-tl-sm px-4 py-3">
                    <div className="flex gap-1 items-center h-5">
                      <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:0ms]" />
                      <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:150ms]" />
                      <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:300ms]" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* ── Input bar ── */}
            <div className="shrink-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 px-4 py-3">
              {messages.length > 0 && (
                <div className="flex gap-2 mb-2 flex-wrap">
                  {QUICK_PROMPTS.map(({ label, msg }) => (
                    <button key={label} onClick={() => sendMutation.mutate(msg)} disabled={sendMutation.isPending}
                      className="px-3 py-1 text-xs bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950 hover:text-blue-700 dark:hover:text-blue-300 border border-slate-200 dark:border-slate-700 hover:border-blue-300 rounded-full transition-colors text-slate-600 dark:text-slate-400">
                      {label}
                    </button>
                  ))}
                </div>
              )}
              <div className="flex gap-2 items-end max-w-4xl mx-auto">
                <Textarea ref={textareaRef} value={input} onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                  placeholder={!aiStatus ? "Backend offline — start the Flask server to chat" : "Message MindCheck Assistant… (Enter to send, Shift+Enter for new line)"}
                  disabled={sendMutation.isPending || !aiStatus} rows={1}
                  className="flex-1 resize-none min-h-[44px] max-h-32 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:border-blue-500 rounded-xl text-sm disabled:opacity-60 disabled:cursor-not-allowed" />
                <Button onClick={handleSend} disabled={!input.trim() || sendMutation.isPending || !aiStatus} size="icon"
                  className="h-11 w-11 rounded-xl bg-blue-600 hover:bg-blue-700 shrink-0 disabled:opacity-50">
                  {sendMutation.isPending ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-xs text-slate-400 dark:text-slate-500 text-center mt-1">
                MindCheck can make mistakes. For emergencies, call <a href="tel:988" className="text-blue-500 hover:underline">988</a>.
              </p>
            </div>
          </div>

          {/* ── Resources sidebar ── */}
          <div className="hidden lg:flex flex-col w-64 shrink-0 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-700 p-4 gap-4 overflow-y-auto">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Crisis Resources</p>
            {RESOURCES.map(({ icon: Icon, title, desc, action, href }) => (
              <a key={title} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer"
                className="flex items-start gap-3 p-3 rounded-xl border border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group">
                <div className="w-9 h-9 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center shrink-0">
                  <Icon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{title}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{desc}</p>
                  <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mt-0.5">{action}</p>
                </div>
                <ExternalLink className="h-3 w-3 text-slate-300 dark:text-slate-600 group-hover:text-slate-500 shrink-0 mt-1" />
              </a>
            ))}
            <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-700">
              <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed">
                This assistant provides general mental health information only. It is not a substitute for professional medical advice.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
