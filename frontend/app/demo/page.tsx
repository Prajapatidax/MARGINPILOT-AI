"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize2,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Bot,
  Sliders,
  TrendingUp,
  LineChart,
  Calendar,
  Send,
} from "lucide-react";
import MarketingNavbar from "@/components/layout/MarketingNavbar";
import MarketingFooter from "@/components/layout/MarketingFooter";

export default function DemoPage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeChapter, setActiveChapter] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [bookSubmitted, setBookSubmitted] = useState(false);

  const chapters = [
    {
      time: "0:00",
      title: "Platform Overview & Multi-Tenant Onboarding",
      desc: "Creating an isolated organization, selecting business category, and uploading CSV/XLSX data with intelligent column mapping.",
      previewImg: "/demo-ch1.png",
      tag: "Onboarding",
    },
    {
      time: "1:15",
      title: "Real-Time Sales & Margin Analytics",
      desc: "Sub-second database queries across millions of rows calculating exact gross profit, net margin, and revenue trends.",
      previewImg: "/demo-ch2.png",
      tag: "Financial Intelligence",
    },
    {
      time: "2:30",
      title: "Machine Learning: Churn & Forecasting",
      desc: "Exploring XGBoost churn risk models with SHAP feature attributions and 90-day PyTorch LSTM demand forecasts.",
      previewImg: "/demo-ch3.png",
      tag: "Machine Learning",
    },
    {
      time: "3:45",
      title: "AI Copilot: Verified SQL Querying",
      desc: "Asking natural language questions like 'Why did revenue decline last month?' and receiving verified database metrics.",
      previewImg: "/demo-ch4.png",
      tag: "AI Copilot",
    },
    {
      time: "4:45",
      title: "What-If Business Scenario Simulator",
      desc: "Simulating 10% price reductions and wholesale volume discounts to evaluate projected profit impact before execution.",
      previewImg: "/demo-ch5.png",
      tag: "Decision Automation",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-600 selection:text-white flex flex-col">
      <MarketingNavbar />

      {/* Hero */}
      <section className="pt-16 pb-12 px-6 max-w-7xl mx-auto text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold">
          <Play className="w-3 h-3 fill-current" />
          Interactive 5-Minute Product Tour
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight max-w-3xl mx-auto">
          See <span className="text-blue-600">MarginPilot AI</span> in Action
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
          Watch how enterprises convert operational records into verified profit growth, automated demand forecasts, and calibrated what-if decision simulations.
        </p>
      </section>

      {/* Video Player & Interactive Chapters */}
      <section className="pb-20 px-6 max-w-6xl mx-auto w-full">
        <div className="bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-800">
          {/* Main Video Viewport / Interactive Mockup Frame */}
          <div className="aspect-video w-full bg-slate-950 relative flex items-center justify-center overflow-hidden group">
            {/* Background Graphic Representing the Active Chapter */}
            <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-900 to-blue-950/40 p-8 flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="px-3 py-1 rounded-full bg-blue-600/30 text-blue-300 font-semibold border border-blue-500/30">
                  {chapters[activeChapter].tag}
                </span>
                <span className="font-mono text-slate-300">
                  Chapter {activeChapter + 1} of {chapters.length} ({chapters[activeChapter].time})
                </span>
              </div>

              {/* Centered Graphic Simulation */}
              <div className="max-w-xl mx-auto text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center mx-auto shadow-inner">
                  {activeChapter === 0 && <RotateCcw className="w-8 h-8" />}
                  {activeChapter === 1 && <LineChart className="w-8 h-8" />}
                  {activeChapter === 2 && <TrendingUp className="w-8 h-8" />}
                  {activeChapter === 3 && <Bot className="w-8 h-8" />}
                  {activeChapter === 4 && <Sliders className="w-8 h-8" />}
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {chapters[activeChapter].title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {chapters[activeChapter].desc}
                </p>
              </div>

              {/* Interactive Play Button Overlay */}
              <div className="text-center">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="px-6 py-2.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-lg transition-all inline-flex items-center gap-2"
                >
                  {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                  <span>{isPlaying ? "Pause Tour" : "Play Chapter"}</span>
                </button>
              </div>
            </div>

            {/* Video Control Bar */}
            <div className="absolute bottom-0 inset-x-0 bg-slate-950/90 backdrop-blur-md px-6 py-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-300">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="hover:text-white transition-colors"
                  aria-label="Play or pause"
                >
                  {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                </button>
                <span className="font-mono text-[11px] text-slate-400">
                  {chapters[activeChapter].time} / 5:30
                </span>
              </div>

              {/* Chapter Indicators */}
              <div className="hidden sm:flex items-center gap-1.5 flex-1 max-w-md mx-6">
                {chapters.map((ch, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveChapter(idx)}
                    className={`h-1.5 rounded-full flex-1 transition-all ${
                      activeChapter === idx ? "bg-blue-500" : "bg-slate-700 hover:bg-slate-600"
                    }`}
                    title={ch.title}
                  />
                ))}
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="hover:text-white transition-colors"
                  aria-label="Toggle mute"
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <Link
                  href="/dashboard"
                  className="px-3 py-1 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-semibold text-[11px] transition-colors"
                >
                  Open Live App
                </Link>
              </div>
            </div>
          </div>

          {/* Chapter Selector Playlist */}
          <div className="p-6 bg-slate-900 border-t border-slate-800 grid grid-cols-1 md:grid-cols-5 gap-3">
            {chapters.map((ch, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setActiveChapter(idx);
                  setIsPlaying(true);
                }}
                className={`p-3 rounded-2xl text-left border transition-all ${
                  activeChapter === idx
                    ? "bg-slate-800 border-blue-500 shadow-sm"
                    : "bg-slate-950/60 border-slate-800/80 hover:bg-slate-800/50"
                }`}
              >
                <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                  <span className="font-mono text-blue-400 font-bold">{ch.time}</span>
                  <span className="text-[10px] uppercase font-semibold text-slate-500">Ch {idx + 1}</span>
                </div>
                <h4 className="text-xs font-bold text-white line-clamp-1">{ch.title}</h4>
              </button>
            ))}
          </div>
        </div>

        {/* Demo Experience Actions */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 space-y-4">
            <h3 className="text-xl font-bold text-slate-900">Want to test it with your real data?</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Create an organization account and upload a sample CSV. Our statistical column mapper automatically parses order numbers, customer IDs, and unit economics in seconds.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <Link
                href="/register"
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow transition-colors flex items-center gap-2"
              >
                <span>Start Free Trial</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/dashboard"
                className="px-6 py-3 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold text-xs rounded-xl transition-colors"
              >
                Launch Sandbox
              </Link>
            </div>
          </div>

          {/* Book 1-on-1 Form */}
          <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-xl font-bold text-slate-900">Book a Private Technical Demo</h3>
            <p className="text-xs text-slate-500">
              Schedule a 30-minute walkthrough with our Principal AI Architects to evaluate ERP connectors and custom deep learning models.
            </p>

            {bookSubmitted ? (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Thank you! Our solutions team will contact you within 2 business hours.</span>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setBookSubmitted(true);
                }}
                className="space-y-3 text-xs"
              >
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    required
                    placeholder="First Name"
                    className="p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-slate-50/50"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Company Name"
                    className="p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-slate-50/50"
                  />
                </div>
                <input
                  type="email"
                  required
                  placeholder="Work Email (e.g. name@company.com)"
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-slate-50/50"
                />
                <button
                  type="submit"
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Request Dedicated Session</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
