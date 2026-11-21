"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, Heart, ArrowUpRight } from "lucide-react";

export default function MarketingFooter() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50 text-slate-600 text-sm">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12">
          {/* Column 1: Brand Info */}
          <div className="col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-base shadow-sm">
                M
              </div>
              <div className="flex items-center">
                <span className="font-extrabold text-lg text-slate-900 tracking-tight">MarginPilot</span>
                <span className="text-blue-600 font-bold text-xs ml-1 bg-blue-100/70 px-1.5 py-0.5 rounded-full border border-blue-200">
                  AI
                </span>
              </div>
            </Link>
            <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
              The Enterprise AI Business Intelligence &amp; Decision Automation Operating System. Built with verified Neon PostgreSQL, Upstash Redis caching, real ML models, and secure organization data isolation.
            </p>
            <Link href="/status" className="flex items-center gap-2 text-xs text-emerald-600 font-medium hover:text-emerald-700 transition-colors">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>All Systems Operational (99.99% Uptime)</span>
            </Link>
          </div>

          {/* Column 2: Product */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Product</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/features" className="hover:text-blue-600 transition-colors">
                  Features Overview
                </Link>
              </li>
              <li>
                <Link href="/demo" className="hover:text-blue-600 transition-colors flex items-center gap-1">
                  <span>Product Tour</span>
                  <ArrowUpRight className="w-3 h-3 text-slate-400" />
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-blue-600 transition-colors">
                  Plans &amp; Pricing
                </Link>
              </li>
              <li>
                <Link href="/features#simulator" className="hover:text-blue-600 transition-colors">
                  What-If Simulator
                </Link>
              </li>
              <li>
                <Link href="/features#copilot" className="hover:text-blue-600 transition-colors">
                  AI Copilot
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Industries */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Industries</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/industries#retail" className="hover:text-blue-600 transition-colors">
                  Retail &amp; POS
                </Link>
              </li>
              <li>
                <Link href="/industries#manufacturing" className="hover:text-blue-600 transition-colors">
                  Manufacturing &amp; BOM
                </Link>
              </li>
              <li>
                <Link href="/industries#wholesale" className="hover:text-blue-600 transition-colors">
                  Wholesale &amp; Bulk
                </Link>
              </li>
              <li>
                <Link href="/industries#distribution" className="hover:text-blue-600 transition-colors">
                  Distribution &amp; Logistics
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Trust & Legal */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Trust &amp; Legal</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/status" className="hover:text-blue-600 transition-colors flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  <span>System Status</span>
                </Link>
              </li>
              <li>
                <Link href="/security" className="hover:text-blue-600 transition-colors">
                  Security &amp; Compliance
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-blue-600 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-blue-600 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-blue-600 transition-colors">
                  Contact Support
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} MarginPilot AI, Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-slate-800 transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-slate-800 transition-colors">
              Terms
            </Link>
            <Link href="/security" className="hover:text-slate-800 transition-colors">
              Security
            </Link>
            <Link href="/contact" className="hover:text-slate-800 transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
