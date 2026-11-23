"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  BarChart3,
  Brain,
  MessageSquareText,
  Lightbulb,
  Settings2,
  ShieldCheck,
  ShoppingCart,
  Factory,
  Boxes,
  Truck,
  ArrowRight,
  Play,
  TrendingUp,
  Sparkles,
  Users,
  Clock,
  ChevronDown,
  LayoutDashboard,
  CheckCircle2,
  AlertTriangle,
  Flame,
} from "lucide-react";
import MarketingNavbar from "@/components/layout/MarketingNavbar";
import MarketingFooter from "@/components/layout/MarketingFooter";
import { useAuth } from "@/lib/auth-context";

export default function HomePage() {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState("Last 12 Months");

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-600 selection:text-white flex flex-col antialiased">
      {/* Navigation matching mockup */}
      <MarketingNavbar />

      {/* =========================================================================
          HERO SECTION
         ========================================================================= */}
      <section className="relative pt-10 pb-20 px-6 max-w-7xl mx-auto overflow-hidden">
        {/* Subtle decorative background gradient glows */}
        <div className="absolute top-0 right-10 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-40 left-10 w-72 h-72 bg-indigo-50/50 rounded-full blur-2xl pointer-events-none -z-10" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Value Proposition */}
          <div className="lg:col-span-6 space-y-5">
            {/* Tag Pill */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50/90 border border-blue-200/80 text-blue-700 text-xs font-bold tracking-tight shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>MarginPilot AI</span>
            </div>

            {/* Bold Headline matching mockup */}
            <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold text-slate-900 tracking-tight leading-[1.08]">
              Predict. Optimize.
              <span className="text-blue-600 block mt-1">Grow.</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg font-bold text-slate-800 leading-snug pt-1">
              Your AI-powered business intelligence platform for higher profits and smarter decisions.
            </p>

            {/* Narrative description */}
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-lg">
              Unify your business data, forecast demand, optimize inventory, and get AI-driven recommendations — all in one powerful platform.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              {user ? (
                <Link
                  href="/dashboard"
                  className="px-7 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm rounded-full shadow-md transition-all hover:shadow-lg flex items-center gap-2"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Enter Workspace</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <>
                  <Link
                    href="/register"
                    className="px-7 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm rounded-full shadow-md transition-all hover:shadow-lg flex items-center gap-2"
                  >
                    <span>Start Free Trial</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <Link
                    href="/demo"
                    className="px-6 py-3 border-2 border-blue-600 text-blue-700 hover:bg-blue-50/70 font-bold text-xs sm:text-sm rounded-full transition flex items-center gap-2 bg-white"
                  >
                    <Play className="w-3.5 h-3.5 fill-blue-600 text-blue-600" />
                    <span>Watch Demo</span>
                  </Link>
                </>
              )}
            </div>

            {/* Engine Trust Badges */}
            <div className="flex flex-wrap items-center gap-6 pt-5 border-t border-slate-100 text-xs font-semibold text-slate-600">
              {/* Google Gemini Badge */}
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>
                  Powered by <strong className="text-slate-900">Google Gemini</strong>
                </span>
              </div>

              <div className="w-1.5 h-1.5 rounded-full bg-slate-300 hidden sm:block" />

              <span>Advanced ML + Deep Learning</span>
            </div>
          </div>

          {/* Right Column: "Business Overview" Mockup Card */}
          <div className="lg:col-span-6 relative">
            {/* Atmospheric glow behind card */}
            <div className="absolute -inset-1.5 bg-gradient-to-r from-blue-400/20 to-indigo-500/20 rounded-3xl blur-xl -z-10" />

            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xl p-5 sm:p-6 space-y-4">
              {/* Card Header */}
              <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-900">Business Overview</h3>
                <div className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-slate-600 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer">
                  <span>{timeRange}</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </div>
              </div>

              {/* 4 Mini KPI Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="p-2.5 bg-slate-50/70 border border-slate-100 rounded-xl">
                  <span className="text-[10px] font-medium text-slate-500 block">Total Revenue</span>
                  <div className="text-base font-extrabold text-slate-900 mt-0.5">₹24.8L</div>
                  <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5 mt-0.5">
                    ↑ 12.5%
                  </span>
                </div>

                <div className="p-2.5 bg-slate-50/70 border border-slate-100 rounded-xl">
                  <span className="text-[10px] font-medium text-slate-500 block">Profit Margin</span>
                  <div className="text-base font-extrabold text-slate-900 mt-0.5">18.7%</div>
                  <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5 mt-0.5">
                    ↑ 2.1%
                  </span>
                </div>

                <div className="p-2.5 bg-slate-50/70 border border-slate-100 rounded-xl">
                  <span className="text-[10px] font-medium text-slate-500 block">Inventory Health</span>
                  <div className="text-base font-extrabold text-slate-900 mt-0.5">92%</div>
                  <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5 mt-0.5">
                    ↑ 4.3%
                  </span>
                </div>

                <div className="p-2.5 bg-slate-50/70 border border-slate-100 rounded-xl">
                  <span className="text-[10px] font-medium text-slate-500 block">Customer Growth</span>
                  <div className="text-base font-extrabold text-slate-900 mt-0.5">+24%</div>
                  <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5 mt-0.5">
                    ↑ 6.7%
                  </span>
                </div>
              </div>

              {/* Chart & Insights Row matching mockup */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 pt-1">
                {/* Revenue Trend Chart (8 cols) */}
                <div className="sm:col-span-7 bg-slate-50/50 border border-slate-100 rounded-xl p-3 flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-800">Revenue Trend</span>
                    <div className="flex items-center gap-3 text-[10px] font-semibold">
                      <div className="flex items-center gap-1 text-blue-700">
                        <span className="w-2 h-2 rounded-full bg-blue-700" />
                        <span>Actual</span>
                      </div>
                      <div className="flex items-center gap-1 text-sky-500">
                        <span className="w-2 h-2 rounded-full bg-sky-500" />
                        <span>Forecast</span>
                      </div>
                    </div>
                  </div>

                  {/* High Fidelity Interactive SVG Line Chart */}
                  <div className="h-36 w-full relative">
                    <svg className="w-full h-full overflow-visible" viewBox="0 0 280 120" preserveAspectRatio="none">
                      {/* Grid lines */}
                      <line x1="0" y1="20" x2="280" y2="20" stroke="#e2e8f0" strokeDasharray="2 2" strokeWidth="1" />
                      <line x1="0" y1="50" x2="280" y2="50" stroke="#e2e8f0" strokeDasharray="2 2" strokeWidth="1" />
                      <line x1="0" y1="80" x2="280" y2="80" stroke="#e2e8f0" strokeDasharray="2 2" strokeWidth="1" />
                      <line x1="0" y1="110" x2="280" y2="110" stroke="#e2e8f0" strokeWidth="1" />

                      {/* Area Fill */}
                      <defs>
                        <linearGradient id="actualGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#2563eb" stopOpacity="0.25" />
                          <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>

                      {/* Actual Curve Area */}
                      <path
                        d="M 10 95 Q 35 90 60 85 T 110 82 T 160 65 T 210 50 L 210 110 L 10 110 Z"
                        fill="url(#actualGrad)"
                      />

                      {/* Actual Trend Line */}
                      <path
                        d="M 10 95 Q 35 90 60 85 T 110 82 T 160 65 T 210 50"
                        fill="none"
                        stroke="#1d4ed8"
                        strokeWidth="2.5"
                      />

                      {/* Forecast Continuation Line */}
                      <path
                        d="M 210 50 Q 235 42 270 30"
                        fill="none"
                        stroke="#0284c7"
                        strokeWidth="2.5"
                        strokeDasharray="4 3"
                      />

                      {/* Data Dots */}
                      <circle cx="10" cy="95" r="2.5" fill="#1d4ed8" />
                      <circle cx="60" cy="85" r="2.5" fill="#1d4ed8" />
                      <circle cx="110" cy="82" r="2.5" fill="#1d4ed8" />
                      <circle cx="160" cy="65" r="2.5" fill="#1d4ed8" />
                      <circle cx="210" cy="50" r="3.5" fill="#1d4ed8" stroke="#ffffff" strokeWidth="1.5" />
                      <circle cx="270" cy="30" r="3" fill="#0284c7" />
                    </svg>
                  </div>

                  {/* Chart Months Axis */}
                  <div className="flex justify-between text-[9px] font-semibold text-slate-400 pt-1">
                    <span>Jan</span>
                    <span>Feb</span>
                    <span>Mar</span>
                    <span>Apr</span>
                    <span>May</span>
                    <span>Jun</span>
                    <span>Jul</span>
                    <span>Aug</span>
                    <span>Sep</span>
                    <span>Oct</span>
                    <span>Nov</span>
                    <span>Dec</span>
                  </div>
                </div>

                {/* AI Insights Side Panel (5 cols) */}
                <div className="sm:col-span-5 bg-blue-50/50 border border-blue-100 rounded-xl p-3 flex flex-col justify-between space-y-2.5">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 mb-2">
                      <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                      <span>AI Insights</span>
                    </div>

                    <div className="space-y-2 text-[11px] leading-snug">
                      <div className="flex items-start gap-1.5 text-slate-700">
                        <span className="text-blue-600 font-bold shrink-0">✦</span>
                        <span>
                          Sales expected to grow by <strong className="text-slate-900">18% next month</strong>.
                        </span>
                      </div>

                      <div className="flex items-start gap-1.5 text-slate-700">
                        <span className="text-amber-500 font-bold shrink-0">✦</span>
                        <span>
                          Stock risk: <strong className="text-slate-900">3 products</strong> may run out.
                        </span>
                      </div>

                      <div className="flex items-start gap-1.5 text-slate-700">
                        <span className="text-rose-500 font-bold shrink-0">✦</span>
                        <span>
                          Low margin detected in <strong className="text-slate-900">2 categories</strong>.
                        </span>
                      </div>
                    </div>
                  </div>

                  <Link
                    href="/simulator"
                    className="text-[11px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 pt-1 border-t border-blue-100/60"
                  >
                    <span>View Details</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: A Complete Business Intelligence Suite
         ========================================================================= */}
      <section className="py-16 px-6 bg-slate-50/60 border-y border-slate-100">
        <div className="max-w-7xl mx-auto space-y-10">
          {/* Section Header */}
          <div className="text-center space-y-1.5 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              A Complete Business Intelligence Suite
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Everything you need to understand, predict and grow your business.
            </p>
          </div>

          {/* 6 Feature Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
            {/* Card 1 */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-md hover:border-blue-300 transition-all text-center flex flex-col items-center group">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <BarChart3 className="w-5 h-5 stroke-[2.2]" />
              </div>
              <h3 className="text-xs font-bold text-slate-900 mb-1">Advanced Analytics</h3>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Interactive dashboards &amp; real-time insights
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-md hover:border-blue-300 transition-all text-center flex flex-col items-center group">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Brain className="w-5 h-5 stroke-[2.2]" />
              </div>
              <h3 className="text-xs font-bold text-slate-900 mb-1">Predictive AI</h3>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Forecast demand, detect risks &amp; find opportunities
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-md hover:border-blue-300 transition-all text-center flex flex-col items-center group">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <MessageSquareText className="w-5 h-5 stroke-[2.2]" />
              </div>
              <h3 className="text-xs font-bold text-slate-900 mb-1">AI Copilot</h3>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Ask anything, get smart business advice
              </p>
            </div>

            {/* Card 4 */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-md hover:border-blue-300 transition-all text-center flex flex-col items-center group">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Lightbulb className="w-5 h-5 stroke-[2.2]" />
              </div>
              <h3 className="text-xs font-bold text-slate-900 mb-1">What-If Simulator</h3>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Plan scenarios &amp; see the impact instantly
              </p>
            </div>

            {/* Card 5 */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-md hover:border-blue-300 transition-all text-center flex flex-col items-center group">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Settings2 className="w-5 h-5 stroke-[2.2]" />
              </div>
              <h3 className="text-xs font-bold text-slate-900 mb-1">Optimization</h3>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Improve margins, reduce operational costs
              </p>
            </div>

            {/* Card 6 */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-md hover:border-blue-300 transition-all text-center flex flex-col items-center group">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-5 h-5 stroke-[2.2]" />
              </div>
              <h3 className="text-xs font-bold text-slate-900 mb-1">Secure &amp; Reliable</h3>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Enterprise-grade security &amp; privacy
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: Built for Every Business Industry
         ========================================================================= */}
      <section className="py-20 px-6 max-w-7xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="text-center space-y-1.5 max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Built for Every Business Industry
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Tailored solutions for your industry&apos;s unique needs
          </p>
        </div>

        {/* 4 Industry Cards with Real Photos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Industry 1: Retail */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group">
            <div>
              <div className="h-44 w-full relative overflow-hidden bg-slate-100">
                <Image
                  src="/images/retail.jpg"
                  alt="Retail Storefront"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-5 space-y-2">
                <div className="flex items-center gap-2 text-blue-600 font-bold text-sm">
                  <ShoppingCart className="w-4 h-4" />
                  <h3 className="text-slate-900 font-bold text-sm">Retail</h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Manage inventory, boost sales and improve customer loyalty.
                </p>
              </div>
            </div>
            <div className="px-5 pb-5">
              <Link
                href="/industries#retail"
                className="text-xs font-bold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 group-hover:gap-1.5 transition-all"
              >
                <span>Explore Retail</span>
                <span>→</span>
              </Link>
            </div>
          </div>

          {/* Industry 2: Manufacturing */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group">
            <div>
              <div className="h-44 w-full relative overflow-hidden bg-slate-100">
                <Image
                  src="/images/manufacturing.jpg"
                  alt="Manufacturing Plant"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-5 space-y-2">
                <div className="flex items-center gap-2 text-blue-600 font-bold text-sm">
                  <Factory className="w-4 h-4" />
                  <h3 className="text-slate-900 font-bold text-sm">Manufacturing</h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Optimize production, predict maintenance &amp; reduce waste.
                </p>
              </div>
            </div>
            <div className="px-5 pb-5">
              <Link
                href="/industries#manufacturing"
                className="text-xs font-bold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 group-hover:gap-1.5 transition-all"
              >
                <span>Explore Manufacturing</span>
                <span>→</span>
              </Link>
            </div>
          </div>

          {/* Industry 3: Wholesale */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group">
            <div>
              <div className="h-44 w-full relative overflow-hidden bg-slate-100">
                <Image
                  src="/images/wholesale.jpg"
                  alt="Wholesale Logistics Warehouse"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-5 space-y-2">
                <div className="flex items-center gap-2 text-blue-600 font-bold text-sm">
                  <Boxes className="w-4 h-4" />
                  <h3 className="text-slate-900 font-bold text-sm">Wholesale</h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Analyze profitability, manage bulk orders &amp; grow faster.
                </p>
              </div>
            </div>
            <div className="px-5 pb-5">
              <Link
                href="/industries#wholesale"
                className="text-xs font-bold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 group-hover:gap-1.5 transition-all"
              >
                <span>Explore Wholesale</span>
                <span>→</span>
              </Link>
            </div>
          </div>

          {/* Industry 4: Distribution */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group">
            <div>
              <div className="h-44 w-full relative overflow-hidden bg-slate-100">
                <Image
                  src="/images/distribution.jpg"
                  alt="Distribution Fleet Logistics"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-5 space-y-2">
                <div className="flex items-center gap-2 text-blue-600 font-bold text-sm">
                  <Truck className="w-4 h-4" />
                  <h3 className="text-slate-900 font-bold text-sm">Distribution</h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Plan logistics, avoid delays &amp; optimize supply chain.
                </p>
              </div>
            </div>
            <div className="px-5 pb-5">
              <Link
                href="/industries#distribution"
                className="text-xs font-bold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 group-hover:gap-1.5 transition-all"
              >
                <span>Explore Distribution</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: Powered by Cutting-Edge AI & Machine Learning
         ========================================================================= */}
      <section className="py-8 px-6 max-w-7xl mx-auto w-full">
        <div className="bg-gradient-to-r from-blue-50/90 via-sky-50/70 to-indigo-50/90 border border-blue-200/80 rounded-3xl p-8 sm:p-10 shadow-sm relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Heading and Learn More */}
            <div className="lg:col-span-4 space-y-4">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Powered by Cutting-Edge AI &amp; Machine Learning
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Leverage the best of AI technology for smarter, data-driven decisions.
              </p>
              <Link
                href="/features"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm transition"
              >
                <span>Learn More</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Middle Column: 4 Technology Badges Grid */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-3">
              {/* Google Gemini */}
              <div className="bg-white/90 backdrop-blur-sm p-4 rounded-xl border border-blue-100 shadow-2xs space-y-1">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span className="text-xs font-bold text-slate-900">Google Gemini</span>
                </div>
                <p className="text-[10px] text-slate-500 leading-tight">
                  Conversational AI &amp; deep insights
                </p>
              </div>

              {/* ML Models */}
              <div className="bg-white/90 backdrop-blur-sm p-4 rounded-xl border border-blue-100 shadow-2xs space-y-1">
                <div className="flex items-center gap-2">
                  <Brain className="w-4 h-4 text-blue-600 shrink-0" />
                  <span className="text-xs font-bold text-slate-900">ML Models</span>
                </div>
                <p className="text-[10px] text-slate-500 leading-tight">
                  Forecasting, churn &amp; anomaly detection
                </p>
              </div>

              {/* Deep Learning */}
              <div className="bg-white/90 backdrop-blur-sm p-4 rounded-xl border border-blue-100 shadow-2xs space-y-1">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span className="text-xs font-bold text-slate-900">Deep Learning</span>
                </div>
                <p className="text-[10px] text-slate-500 leading-tight">
                  Advanced pattern recognition
                </p>
              </div>

              {/* MLOps */}
              <div className="bg-white/90 backdrop-blur-sm p-4 rounded-xl border border-blue-100 shadow-2xs space-y-1">
                <div className="flex items-center gap-2">
                  <Settings2 className="w-4 h-4 text-sky-600 shrink-0" />
                  <span className="text-xs font-bold text-slate-900">MLOps</span>
                </div>
                <p className="text-[10px] text-slate-500 leading-tight">
                  Automated training &amp; deployment
                </p>
              </div>
            </div>

            {/* Right Column: 3D AI Chip Graphic */}
            <div className="lg:col-span-3 flex justify-center">
              <div className="w-48 h-48 rounded-2xl overflow-hidden border-2 border-blue-300/80 shadow-lg relative bg-slate-900">
                <Image
                  src="/images/ai-chip.jpg"
                  alt="AI Semiconductor Processor"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 5: See the Real Business Impact
         ========================================================================= */}
      <section className="py-20 px-6 max-w-7xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="space-y-1.5">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            See the Real Business Impact
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Measurable results for sustainable growth
          </p>
        </div>

        {/* Stats & Testimonial Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left Stats Grid (8 cols) */}
          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-5 gap-3.5">
            {/* Stat 1 */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs text-center flex flex-col items-center justify-center space-y-1.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div className="text-xl sm:text-2xl font-black text-slate-900">+30%</div>
              <div className="text-[11px] font-semibold text-slate-500">Profitability</div>
            </div>

            {/* Stat 2 */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs text-center flex flex-col items-center justify-center space-y-1.5">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <Boxes className="w-4 h-4" />
              </div>
              <div className="text-xl sm:text-2xl font-black text-slate-900">-40%</div>
              <div className="text-[11px] font-semibold text-slate-500">Inventory Cost</div>
            </div>

            {/* Stat 3 */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs text-center flex flex-col items-center justify-center space-y-1.5">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
              <div className="text-xl sm:text-2xl font-black text-slate-900">+25%</div>
              <div className="text-[11px] font-semibold text-slate-500">Customer Retention</div>
            </div>

            {/* Stat 4 */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs text-center flex flex-col items-center justify-center space-y-1.5">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
              <div className="text-xl sm:text-2xl font-black text-slate-900">Save 70%</div>
              <div className="text-[11px] font-semibold text-slate-500">Time on Reports</div>
            </div>

            {/* Stat 5 */}
            <div className="col-span-2 sm:col-span-1 bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs text-center flex flex-col items-center justify-center space-y-1.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="text-base sm:text-lg font-black text-slate-900">Reduce Risks</div>
              <div className="text-[11px] font-semibold text-slate-500">Proactively</div>
            </div>
          </div>

          {/* Right Testimonial Card (4 cols) */}
          <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <span className="text-3xl text-blue-600 font-serif leading-none block">“</span>
              <p className="text-xs sm:text-sm font-semibold text-slate-800 leading-relaxed italic">
                MarginPilot AI has transformed our business. We now make data-driven decisions with confidence.
              </p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-100 relative shrink-0 border border-slate-200">
                  <Image
                    src="/images/rajesh-mehta.jpg"
                    alt="Rajesh Mehta"
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 leading-tight">Rajesh Mehta</h4>
                  <p className="text-[10px] text-slate-500 font-medium">CEO, ABC Manufacturing</p>
                </div>
              </div>

              {/* Pagination Dots */}
              <div className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2 h-2 rounded-full bg-blue-600" />
                <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 6: Ready to Transform Your Business? (Pre-Footer CTA)
         ========================================================================= */}
      <section className="py-6 px-6 max-w-7xl mx-auto w-full mb-12">
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Left Decorative 3D Chart Illustration */}
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-tr from-blue-600/30 to-blue-400/10 border border-blue-400/20 p-3.5 flex items-end justify-between shrink-0 shadow-inner">
              <div className="w-3.5 bg-blue-500/50 rounded-t h-[40%]" />
              <div className="w-3.5 bg-blue-500/70 rounded-t h-[65%]" />
              <div className="w-3.5 bg-blue-400 rounded-t h-[90%] shadow-[0_0_12px_rgba(96,165,250,0.8)]" />
              <div className="w-3.5 bg-blue-300 rounded-t h-[100%] shadow-[0_0_16px_rgba(147,197,253,1)]" />
            </div>

            <div className="space-y-1.5">
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Ready to Transform Your Business?
              </h2>
              <p className="text-xs sm:text-sm text-slate-300">
                Join thousands of forward-thinking businesses using MarginPilot AI.
              </p>
            </div>
          </div>

          {/* Right Action Button & Micro-copy */}
          <div className="flex flex-col items-center sm:items-end shrink-0">
            <Link
              href="/register"
              className="px-8 py-3.5 bg-white hover:bg-slate-100 text-slate-950 font-extrabold text-sm rounded-xl shadow-lg transition-transform hover:scale-105 flex items-center gap-2"
            >
              <span>Start Free Trial</span>
              <ArrowRight className="w-4 h-4 text-slate-900" />
            </Link>
            <span className="text-[11px] text-slate-400 mt-2 font-medium">
              No credit card required
            </span>
          </div>
        </div>
      </section>

      {/* Footer matching mockup */}
      <MarketingFooter />
    </div>
  );
}
