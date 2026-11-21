"use client";

import React from "react";
import Link from "next/link";
import {
  LineChart,
  Boxes,
  AlertTriangle,
  TrendingUp,
  Store,
  Factory,
  Building,
  Truck,
  ArrowRight,
  Play,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-600 selection:text-white">
      {/* Navigation */}
      <header className="h-20 border-b border-slate-100 sticky top-0 bg-white/95 backdrop-blur-sm z-40">
        <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
              M
            </div>
            <div className="flex items-center">
              <span className="font-extrabold text-xl text-slate-900 tracking-tight">MarginPilot</span>
              <span className="text-blue-600 font-bold text-xs ml-1.5 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                AI
              </span>
            </div>
          </Link>

          {/* Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <Link href="/" className="text-blue-600 font-semibold">
              Home
            </Link>
            <Link href="#features" className="hover:text-slate-900 transition-colors">
              Features
            </Link>
            <Link href="#industries" className="hover:text-slate-900 transition-colors">
              Industries
            </Link>
            <Link href="#pricing" className="hover:text-slate-900 transition-colors">
              Pricing
            </Link>
            <Link href="/docs" className="hover:text-slate-900 transition-colors">
              Docs
            </Link>
          </nav>

          {/* Auth Actions */}
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-slate-900 transition-colors"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-all hover:shadow"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-16 pb-20 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
              Enterprise AI Business Intelligence &amp; Decision Automation
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.12]">
              Turn Your Business Data into <span className="text-blue-600">Profit Growth</span>
            </h1>

            <p className="text-lg text-slate-600 max-w-xl leading-relaxed">
              AI-powered insights, predictions, and recommendations for smarter business decisions. Connect your real operational records and automate forecasting, inventory, and margin optimization.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/register"
                className="px-7 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-md transition-all hover:shadow-lg flex items-center gap-2"
              >
                <span>Start Free Trial</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="#demo"
                className="px-6 py-3.5 border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-sm rounded-xl transition-colors flex items-center gap-2"
              >
                <Play className="w-4 h-4 text-slate-400 fill-slate-400" />
                <span>Watch Demo</span>
              </Link>
            </div>

            {/* Feature Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6">
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center gap-2.5">
                <LineChart className="w-4 h-4 text-blue-600 shrink-0" />
                <span className="text-xs font-semibold text-slate-800">Predict Demand</span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center gap-2.5">
                <Boxes className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-xs font-semibold text-slate-800">Optimize Inventory</span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span className="text-xs font-semibold text-slate-800">Detect Anomalies</span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center gap-2.5">
                <TrendingUp className="w-4 h-4 text-purple-600 shrink-0" />
                <span className="text-xs font-semibold text-slate-800">Grow Profitability</span>
              </div>
            </div>
          </div>

          {/* Hero Visual Mockup */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md rounded-2xl bg-gradient-to-tr from-slate-900 to-slate-800 p-3 shadow-2xl border border-slate-700">
              {/* Floating +32% Badge */}
              <div className="absolute -top-4 -right-4 bg-emerald-500 text-white font-bold text-xs px-3.5 py-1.5 rounded-full shadow-lg flex items-center gap-1 border-2 border-white">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>+32% Profit Growth</span>
              </div>

              {/* Laptop Screen Graphic */}
              <div className="rounded-xl bg-white p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-xs font-bold text-slate-800">MarginPilot AI Analytics</span>
                  <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded font-mono font-bold">
                    LIVE DATA
                  </span>
                </div>
                <div className="h-32 bg-slate-50 rounded-lg p-3 flex flex-col justify-end border border-slate-100 relative overflow-hidden">
                  <div className="absolute top-2 left-3 text-[11px] font-semibold text-slate-500">
                    Gross Margin Forecast
                  </div>
                  <div className="flex items-end justify-between gap-2 h-20 pt-4">
                    <div className="w-full bg-blue-200 h-[40%] rounded-t"></div>
                    <div className="w-full bg-blue-300 h-[60%] rounded-t"></div>
                    <div className="w-full bg-blue-400 h-[75%] rounded-t"></div>
                    <div className="w-full bg-blue-500 h-[85%] rounded-t"></div>
                    <div className="w-full bg-blue-600 h-[100%] rounded-t"></div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2 bg-slate-50 rounded border border-slate-100">
                    <span className="text-slate-400 block text-[10px]">Predicted Revenue</span>
                    <span className="font-bold text-slate-900">$248,750</span>
                  </div>
                  <div className="p-2 bg-slate-50 rounded border border-slate-100">
                    <span className="text-slate-400 block text-[10px]">Active Customers</span>
                    <span className="font-bold text-slate-900">12,850</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Built For Every Business Section */}
      <section id="industries" className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Built for Every Business</h2>
            <p className="text-slate-600 text-sm">
              Configurable canonical models tailored specifically to retail, manufacturing, wholesale, and distribution operations.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Retail */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center mb-4">
                <Store className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Retail</h3>
              <p className="text-xs text-slate-500 mt-1">Smarter retail decisions</p>
              <ul className="mt-4 space-y-2 text-xs text-slate-600">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>POS &amp; Store Performance</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>Customer Segmentation &amp; RFM</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>Promotions &amp; Return Analysis</span>
                </li>
              </ul>
            </div>

            {/* Manufacturing */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                <Factory className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Manufacturing</h3>
              <p className="text-xs text-slate-500 mt-1">Optimize production</p>
              <ul className="mt-4 space-y-2 text-xs text-slate-600">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>Production Batches &amp; BOM</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>Defect &amp; Scrap Rate Tracking</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>Raw Material Lead-Time ML</span>
                </li>
              </ul>
            </div>

            {/* Wholesale */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
                <Building className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Wholesale</h3>
              <p className="text-xs text-slate-500 mt-1">Maximize distribution</p>
              <ul className="mt-4 space-y-2 text-xs text-slate-600">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>Bulk Order Margin Analysis</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>Tiered Pricing Simulator</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>Customer Credit &amp; Churn Risk</span>
                </li>
              </ul>
            </div>

            {/* Distribution */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Distribution</h3>
              <p className="text-xs text-slate-500 mt-1">Streamline operations</p>
              <ul className="mt-4 space-y-2 text-xs text-slate-600">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>Multi-Warehouse Inventory</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>On-Time Delivery Reliability</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>Supplier Lead-Time Anomaly</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="bg-slate-900 text-white py-14 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-xl font-bold tracking-tight">Intelligent. Secure. Scalable.</h3>
            <p className="text-slate-400 text-xs">
              Enterprise-grade data isolation with trained ML models and verified business metrics.
            </p>
          </div>
          <Link
            href="/register"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow transition-colors flex items-center gap-2 shrink-0"
          >
            <span>Get Started</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
