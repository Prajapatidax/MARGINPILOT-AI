"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  ArrowRight,
  ChevronDown,
  LayoutDashboard,
  TrendingUp,
  Activity,
  Play,
  ShoppingCart,
  Factory,
  Boxes,
  Truck,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";

interface NavItem {
  label: string;
  href: string;
  hasDropdown?: boolean;
  isStatus?: boolean;
  children?: { label: string; href: string; desc: string; icon: any }[];
}

export default function MarketingNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [industriesOpen, setIndustriesOpen] = useState(false);
  const pathname = usePathname();
  const { user } = useAuth();

  const navLinks: NavItem[] = [
    { label: "Home", href: "/" },
    { label: "Features", href: "/features" },
    {
      label: "Industries",
      href: "/industries",
      hasDropdown: true,
      children: [
        {
          label: "Retail & POS",
          href: "/industries#retail",
          desc: "Inventory velocity & margin tracking",
          icon: ShoppingCart,
        },
        {
          label: "Manufacturing",
          href: "/industries#manufacturing",
          desc: "Production schedule & BOM optimization",
          icon: Factory,
        },
        {
          label: "Wholesale & Bulk",
          href: "/industries#wholesale",
          desc: "Bulk order pricing & tier profitability",
          icon: Boxes,
        },
        {
          label: "Distribution & Logistics",
          href: "/industries#distribution",
          desc: "Fleet routes, buffers & supply lead-times",
          icon: Truck,
        },
      ],
    },
    { label: "Pricing", href: "/pricing" },
    { label: "Status", href: "/status", isStatus: true },
    { label: "About", href: "/contact" },
  ];

  return (
    <header className="h-20 border-b border-slate-100 sticky top-0 bg-white/95 backdrop-blur-md z-50 select-none">
      <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between">
        {/* Brand with TrendingUp Icon and Subtitle matching mockup */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105 shrink-0">
            <TrendingUp className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center leading-none">
              <span className="font-extrabold text-xl text-slate-900 tracking-tight">MarginPilot</span>
              <span className="text-blue-600 font-extrabold text-xl ml-1">AI</span>
            </div>
            <span className="text-[10px] text-slate-500 font-medium tracking-tight mt-0.5">
              From Business Data To Better Decisions
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-semibold">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== "/" && pathname?.startsWith(link.href));

            if (link.hasDropdown) {
              return (
                <div
                  key={link.label}
                  className="relative group"
                  onMouseEnter={() => setIndustriesOpen(true)}
                  onMouseLeave={() => setIndustriesOpen(false)}
                >
                  <Link
                    href={link.href}
                    className={`relative flex items-center gap-1 transition-colors py-2 ${
                      isActive
                        ? "text-blue-600 font-bold"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <span>{link.label}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:rotate-180 transition-transform duration-200" />
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
                    )}
                  </Link>

                  {/* Dropdown Menu */}
                  {industriesOpen && (
                    <div className="absolute top-full left-0 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Tailored Industry Solutions
                      </div>
                      <div className="space-y-1">
                        {link.children?.map((child) => {
                          const Icon = child.icon;
                          return (
                            <Link
                              key={child.label}
                              href={child.href}
                              onClick={() => setIndustriesOpen(false)}
                              className="p-2.5 rounded-xl hover:bg-slate-50 transition flex items-start gap-2.5 group/item"
                            >
                              <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5 group-hover/item:bg-blue-600 group-hover/item:text-white transition-colors">
                                <Icon className="w-3.5 h-3.5" />
                              </div>
                              <div>
                                <span className="font-bold text-slate-900 block text-xs group-hover/item:text-blue-600 transition-colors">
                                  {child.label}
                                </span>
                                <span className="text-[10px] text-slate-500 font-normal block leading-tight">
                                  {child.desc}
                                </span>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={link.label}
                href={link.href}
                className={`relative flex items-center gap-1.5 transition-colors py-2 ${
                  isActive
                    ? "text-blue-600 font-bold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {/* Live green pulse for the Status link */}
                {link.isStatus && (
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                )}
                <span>{link.label}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right CTA Actions */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <Link
              href="/dashboard"
              className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-all hover:shadow flex items-center gap-2"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="px-4 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-all hover:shadow flex items-center gap-1.5"
              >
                <span>Start Free Trial</span>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-slate-600 hover:text-slate-900 focus:outline-none"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-6 py-5 shadow-xl space-y-4">
          <nav className="flex flex-col space-y-2 text-xs font-medium">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <div key={link.label} className="space-y-1">
                  <Link
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`py-2 px-3 rounded-lg flex items-center justify-between ${
                      isActive ? "bg-blue-50 text-blue-600 font-bold" : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {link.isStatus && (
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      )}
                      <span>{link.label}</span>
                    </div>
                    {link.hasDropdown && <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
                  </Link>

                  {/* Mobile Industry Sublinks */}
                  {link.hasDropdown && (
                    <div className="pl-6 space-y-1 py-1 border-l-2 border-slate-100 ml-3">
                      {link.children?.map((child) => (
                        <Link
                          key={child.label}
                          href={child.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className="block py-1.5 px-2 text-[11px] text-slate-600 hover:text-blue-600"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            {user ? (
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 text-xs font-bold text-white bg-blue-600 rounded-lg flex items-center justify-center gap-2 shadow"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Go to Dashboard</span>
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2 text-xs font-bold text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50 transition"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2 text-xs font-bold text-white bg-blue-600 rounded-lg shadow transition"
                >
                  Start Free Trial
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
