"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Bot,
  Send,
  Sparkles,
  TrendingDown,
  Database,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  PlusCircle,
  MessageSquare,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import api from "@/lib/api";

interface MessageItem {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  chart_data?: {
    type: string;
    title: string;
    data: any[];
    xKey: string;
    yKey: string;
    unit?: string;
  } | null;
  grounding_sources?: any[] | null;
  created_at: string;
}

interface ConversationSummary {
  id: string;
  title: string;
  created_at: string;
  message_count: number;
}

export default function CopilotPage() {
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [inputPrompt, setInputPrompt] = useState<string>("");
  const [isSending, setIsSending] = useState<boolean>(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Suggested prompt chips matching business workflows
  const promptSuggestions = [
    "Why did my revenue decline last month?",
    "What products are at stockout risk?",
    "Which customers have high churn risk?",
    "Detect unusual transaction margins",
  ];

  const fetchConversations = async () => {
    try {
      const res = await api.get("/copilot/conversations");
      setConversations(res.data);
      if (res.data.length > 0 && !activeConversationId) {
        loadConversation(res.data[0].id);
      }
    } catch (err) {
      console.error("Failed to fetch conversations:", err);
    }
  };

  const loadConversation = async (id: string) => {
    setActiveConversationId(id);
    setIsLoadingHistory(true);
    try {
      const res = await api.get(`/copilot/conversations/${id}`);
      setMessages(res.data.messages);
    } catch (err) {
      console.error("Failed to load conversation history:", err);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (textToSend?: string) => {
    const prompt = textToSend || inputPrompt;
    if (!prompt.trim() || isSending) return;

    setInputPrompt("");
    const tempUserMsg: MessageItem = {
      id: "temp-" + Date.now(),
      role: "user",
      content: prompt,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempUserMsg]);
    setIsSending(true);

    try {
      const res = await api.post("/copilot/chat", {
        message: prompt,
        conversation_id: activeConversationId || undefined,
      });

      const assistantMsg = res.data;
      if (!activeConversationId) {
        setActiveConversationId(assistantMsg.conversation_id);
      }
      setMessages((prev) => [...prev, assistantMsg]);
      await fetchConversations();
    } catch (err) {
      console.error("Failed to get copilot answer:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: "err-" + Date.now(),
          role: "assistant",
          content: "Sorry, I encountered an issue accessing the analytical data store. Please verify your permissions and try again.",
          created_at: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const handleStartNewSession = () => {
    setActiveConversationId(null);
    setMessages([]);
  };

  return (
    <div className="space-y-4 max-w-6xl mx-auto h-[calc(100vh-6rem)] flex flex-col">
      {/* Page Header matching mockup */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Bot className="w-7 h-7 text-blue-600" />
            AI Copilot
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Ask anything about your business data — strictly grounded in verified database records
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-full border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Database Grounding Active
          </div>

          <button
            onClick={handleStartNewSession}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-2xs transition"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            New Advisory Chat
          </button>
        </div>
      </div>

      {/* Main Container: Chat + Session History */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-1 min-h-0">
        {/* Sidebar Sessions (Hidden on small screens) */}
        <div className="hidden md:flex flex-col bg-white rounded-xl border border-slate-200 p-3 overflow-y-auto shadow-2xs">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 px-2 py-1 mb-2">
            Recent Sessions
          </div>
          <div className="space-y-1">
            {conversations.length === 0 ? (
              <div className="text-xs text-slate-400 p-2">No prior sessions.</div>
            ) : (
              conversations.map((c) => (
                <button
                  key={c.id}
                  onClick={() => loadConversation(c.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition flex items-center gap-2 ${
                    activeConversationId === c.id
                      ? "bg-blue-50 text-blue-700 border border-blue-200"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{c.title}</span>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Chat Thread Console */}
        <div className="md:col-span-3 bg-white rounded-xl border border-slate-200 flex flex-col shadow-2xs overflow-hidden">
          {/* Messages Scroll Area */}
          <div className="flex-1 p-5 overflow-y-auto space-y-4">
            {messages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
                <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                  <Bot className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-slate-700 text-sm">
                  MarginPilot Business Copilot
                </h3>
                <p className="text-xs max-w-sm mt-1">
                  Ask natural language questions about your revenue changes, product profitability, churn predictions, or stockout alerts.
                </p>

                {/* Prompt Starter Chips */}
                <div className="flex flex-wrap gap-2 justify-center mt-5">
                  {promptSuggestions.map((prompt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(prompt)}
                      className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-full text-xs text-slate-700 font-medium transition shadow-2xs"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((m) => {
              const isUser = m.role === "user";
              return (
                <div
                  key={m.id}
                  className={`flex ${isUser ? "justify-end" : "justify-start"} gap-3`}
                >
                  {!isUser && (
                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={`max-w-2xl rounded-2xl p-4 text-sm ${
                      isUser
                        ? "bg-blue-600 text-white shadow-2xs rounded-br-xs"
                        : "bg-slate-50 border border-slate-200 text-slate-900 shadow-2xs rounded-bl-xs"
                    }`}
                  >
                    <div className="whitespace-pre-line leading-relaxed">
                      {m.content}
                    </div>

                    {/* Inline Chart Widget if generated by Copilot */}
                    {m.chart_data && (
                      <div className="mt-4 pt-4 border-t border-slate-200 bg-white p-3 rounded-xl">
                        <div className="text-xs font-semibold text-slate-700 mb-2">
                          {m.chart_data.title}
                        </div>
                        <div className="h-44 w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                              data={m.chart_data.data}
                              margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
                            >
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                              <XAxis
                                dataKey={m.chart_data.xKey}
                                tickLine={false}
                                axisLine={false}
                                tick={{ fontSize: 11, fill: "#64748b" }}
                              />
                              <YAxis
                                tickLine={false}
                                axisLine={false}
                                tick={{ fontSize: 11, fill: "#64748b" }}
                              />
                              <Tooltip
                                contentStyle={{
                                  backgroundColor: "#ffffff",
                                  borderColor: "#e2e8f0",
                                  borderRadius: "6px",
                                  fontSize: "11px",
                                }}
                              />
                              <Bar
                                dataKey={m.chart_data.yKey}
                                fill="#2563eb"
                                radius={[3, 3, 0, 0]}
                                name="Revenue"
                              />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    )}

                    {/* Grounding Source Attribution */}
                    {m.grounding_sources && m.grounding_sources.length > 0 && (
                      <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center gap-1.5 text-[11px] text-slate-400">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Verified from database:</span>
                        <span className="font-mono text-slate-500">
                          {m.grounding_sources.map((s: any) => s.table || s.source).join(", ")}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {isSending && (
              <div className="flex justify-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 animate-pulse">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-2xl rounded-bl-xs p-4 text-xs text-slate-500 flex items-center gap-2">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-600" />
                  Analyzing business data and generating grounded insight...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestion Bar */}
          {messages.length > 0 && (
            <div className="px-4 py-2 border-t border-slate-100 flex items-center gap-2 overflow-x-auto bg-slate-50/50">
              <span className="text-[11px] text-slate-400 font-medium shrink-0">
                Suggested follow-ups:
              </span>
              {promptSuggestions.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(prompt)}
                  className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-md text-[11px] text-slate-600 whitespace-nowrap transition"
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}

          {/* Input Box matching mockup */}
          <div className="p-3 bg-white border-t border-slate-200">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputPrompt}
                onChange={(e) => setInputPrompt(e.target.value)}
                placeholder="Ask a question..."
                className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                disabled={isSending}
              />
              <button
                type="submit"
                disabled={!inputPrompt.trim() || isSending}
                className="w-10 h-10 rounded-xl bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow-xs transition disabled:opacity-40 shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
