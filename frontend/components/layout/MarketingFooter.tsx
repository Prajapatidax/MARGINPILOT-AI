"use client";

import React from "react";
import Link from "next/link";
import { TrendingUp, ChevronDown } from "lucide-react";

export default function MarketingFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white text-slate-600 text-xs">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Top Tier: Logo, Links & Socials */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 pb-10 border-b border-slate-100">
          {/* Brand Info */}
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm shrink-0">
              <TrendingUp className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center leading-none">
                <span className="font-extrabold text-lg text-slate-900 tracking-tight">MarginPilot</span>
                <span className="text-blue-600 font-extrabold text-lg ml-1">AI</span>
              </div>
              <span className="text-[10px] text-slate-500 font-medium tracking-tight mt-0.5">
                From Business Data To Better Decisions
              </span>
            </div>
          </Link>

          {/* Quick Nav Links */}
          <div className="flex flex-wrap items-center gap-6 text-xs font-semibold text-slate-700">
            <Link href="/features" className="hover:text-blue-600 transition">
              <span>Features</span>
            </Link>
            <Link href="/industries" className="hover:text-blue-600 transition">
              <span>Industries</span>
            </Link>
            <Link href="/pricing" className="hover:text-blue-600 transition">
              <span>Pricing</span>
            </Link>
            <Link href="/status" className="hover:text-blue-600 transition flex items-center gap-1.5 text-slate-800">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Status</span>
            </Link>
            <Link href="/contact" className="hover:text-blue-600 transition">
              <span>About &amp; Contact</span>
            </Link>
          </div>

          {/* Social Icons matching mockup */}
          <div className="flex items-center gap-3 text-slate-600">
            {/* LinkedIn */}
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-blue-50 hover:text-blue-600 flex items-center justify-center transition"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </a>

            {/* YouTube */}
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-red-50 hover:text-red-600 flex items-center justify-center transition"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </a>

            {/* X (formerly Twitter) */}
            <a
              href="https://x.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X"
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 hover:text-slate-900 flex items-center justify-center transition"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>

            {/* GitHub */}
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 hover:text-slate-900 flex items-center justify-center transition"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Bottom Tier: Copyright & Legal */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 MarginPilot AI. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <Link href="/privacy" className="hover:text-slate-800 transition">
              Privacy Policy
            </Link>
            <span className="text-slate-300">|</span>
            <Link href="/terms" className="hover:text-slate-800 transition">
              Terms of Service
            </Link>
            <span className="text-slate-300">|</span>
            <Link href="/refund" className="hover:text-slate-800 transition font-medium text-slate-700">
              Refund Policy (30-Day Guarantee)
            </Link>
            <span className="text-slate-300">|</span>
            <Link href="/cookies" className="hover:text-slate-800 transition">
              Cookie Policy
            </Link>
            <span className="text-slate-300">|</span>
            <Link href="/contact" className="hover:text-slate-800 transition">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
