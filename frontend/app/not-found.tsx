"use client";

import React from "react";
import Link from "next/link";
import {
  Home,
  LayoutDashboard,
  Search,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  FileQuestion,
  HelpCircle,
  Activity,
} from "lucide-react";
import MarketingNavbar from "@/components/layout/MarketingNavbar";
import MarketingFooter from "@/components/layout/MarketingFooter";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-600 selection:text-white flex flex-col">
      <MarketingNavbar />

      <main className="flex-1 flex items-center justify-center py-16 px-6 relative overflow-hidden">
        {/* Decorative background blurs */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-50/80 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-2xl mx-auto text-center space-y-6">
          {/* 404 Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold shadow-2xs">
            <FileQuestion className="w-4 h-4 text-blue-600" />
            <span>Error 404 • Resource Not Found</span>
          </div>

          {/* Large Gradient Number */}
          <h1 className="text-7xl sm:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500 tracking-tighter select-none">
            404
          </h1>

          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Page Not Found
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
              The page you are looking for doesn&apos;t exist, has been relocated, or is temporarily inaccessible.
            </p>
          </div>

          {/* Primary Quick Nav Actions */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
            <Link
              href="/"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all hover:shadow flex items-center gap-2"
            >
              <Home className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>

            <Link
              href="/dashboard"
              className="px-6 py-3 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs border border-slate-200 rounded-xl shadow-2xs transition flex items-center gap-2"
            >
              <LayoutDashboard className="w-4 h-4 text-blue-600" />
              <span>Go to Dashboard</span>
            </Link>

            <Link
              href="/status"
              className="px-5 py-3 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold text-xs border border-slate-200 rounded-xl transition flex items-center gap-2"
            >
              <Activity className="w-4 h-4 text-emerald-600" />
              <span>System Status</span>
            </Link>
          </div>

          {/* Helpful Navigation Links Grid */}
          <div className="pt-8 border-t border-slate-100 max-w-lg mx-auto">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
              Explore Popular Sections
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs text-slate-700 font-semibold">
              <Link
                href="/features"
                className="p-2.5 bg-slate-50 hover:bg-blue-50/70 hover:text-blue-700 rounded-xl border border-slate-200/60 transition"
              >
                Features
              </Link>
              <Link
                href="/industries"
                className="p-2.5 bg-slate-50 hover:bg-blue-50/70 hover:text-blue-700 rounded-xl border border-slate-200/60 transition"
              >
                Industries
              </Link>
              <Link
                href="/pricing"
                className="p-2.5 bg-slate-50 hover:bg-blue-50/70 hover:text-blue-700 rounded-xl border border-slate-200/60 transition"
              >
                Pricing Plans
              </Link>
              <Link
                href="/contact"
                className="p-2.5 bg-slate-50 hover:bg-blue-50/70 hover:text-blue-700 rounded-xl border border-slate-200/60 transition"
              >
                Contact Help
              </Link>
            </div>
          </div>
        </div>
      </main>

      <MarketingFooter />
    </div>
  );
}
