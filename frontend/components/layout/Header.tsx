"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Search,
  Bell,
  ChevronDown,
  Building2,
  Check,
  LogOut,
  User as UserIcon,
  Sparkles,
  Settings,
  CreditCard,
  Shield,
  Activity,
  Clock,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export const Header: React.FC = () => {
  const { user, activeOrg, switchOrg, logout } = useAuth();
  const [orgDropdownOpen, setOrgDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  // Free Trial Countdown
  const getTrialInfo = () => {
    if (!activeOrg?.trial_ends_at) {
      return { days: 14, hours: 0, text: "14d Trial Active", isExpired: false };
    }
    const end = new Date(activeOrg.trial_ends_at).getTime();
    const now = Date.now();
    const diff = end - now;
    if (diff <= 0) {
      return { days: 0, hours: 0, text: "Trial Ended", isExpired: true };
    }
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    return {
      days,
      hours,
      text: days > 0 ? `${days}d ${hours}h left` : `${hours}h left`,
      isExpired: false,
    };
  };

  const trial = getTrialInfo();

  return (
    <header className="h-16 bg-white/95 backdrop-blur-md border-b border-slate-200/80 flex items-center justify-between px-6 select-none sticky top-0 z-30 shadow-2xs">
      {/* Spacious Search Bar with Keyboard Hint */}
      <div className="flex-1 max-w-md mr-4">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search records, SKU, customers, models..."
            className="w-full pl-10 pr-12 py-2 text-xs bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-inner"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 bg-white border border-slate-200 rounded shadow-2xs pointer-events-none">
            Ctrl K
          </kbd>
        </div>
      </div>

      {/* Right Controls with Breathing Room */}
      <div className="flex items-center gap-3">
        {/* Free Trial Countdown Pill (Task 4) */}
        <Link
          href="/settings?tab=Subscription"
          title="Click to view subscription and billing details"
          className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
            trial.isExpired
              ? "bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
              : "bg-blue-50/80 text-blue-700 border-blue-200 hover:bg-blue-100/80"
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full ${
              trial.isExpired ? "bg-red-500" : "bg-blue-600 animate-pulse"
            }`}
          />
          <span className="font-bold">{activeOrg?.subscription_plan || "Growth"}</span>
          <span className="text-slate-400">•</span>
          <span className="text-[11px] font-medium flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {trial.text}
          </span>
        </Link>

        {/* Organization Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setOrgDropdownOpen(!orgDropdownOpen);
              setUserDropdownOpen(false);
            }}
            className="flex items-center gap-2.5 px-3 py-2 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 text-xs font-semibold text-slate-800 transition shadow-2xs"
          >
            <div className="w-5 h-5 rounded-md bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold">
              {activeOrg?.name ? activeOrg.name.charAt(0).toUpperCase() : "O"}
            </div>
            <span className="max-w-[130px] truncate text-slate-900 font-bold">
              {activeOrg?.name || "Workspace"}
            </span>
            <span className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded font-medium">
              {activeOrg?.currency || "USD"}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {orgDropdownOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-1">
              <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Active Workspaces
                </span>
                <span className="text-[11px] text-blue-600 font-semibold">
                  {user?.organizations?.length || 1} available
                </span>
              </div>
              <div className="max-h-56 overflow-y-auto py-1">
                {user?.organizations?.map((org) => {
                  const isSelected = org.id === activeOrg?.id;
                  return (
                    <button
                      key={org.id}
                      onClick={() => {
                        switchOrg(org.id);
                        setOrgDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-4 py-2.5 text-xs text-left transition ${
                        isSelected ? "bg-blue-50/70 text-blue-700 font-semibold" : "hover:bg-slate-50 text-slate-700"
                      }`}
                    >
                      <div className="truncate">
                        <p className="font-bold text-slate-900 truncate">{org.name}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {org.business_type} • {org.currency} • {org.country}
                        </p>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-blue-600 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Notifications */}
        <button
          className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition relative"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="w-2 h-2 bg-blue-600 rounded-full absolute top-1.5 right-1.5"></span>
        </button>

        {/* User Navigation Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setUserDropdownOpen(!userDropdownOpen);
              setOrgDropdownOpen(false);
            }}
            className="flex items-center gap-2 pl-2 pr-1.5 py-1 rounded-xl hover:bg-slate-100 transition"
          >
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
              {user?.full_name ? user.full_name.charAt(0).toUpperCase() : "U"}
            </div>
            <div className="text-left hidden md:block leading-tight">
              <p className="text-xs font-bold text-slate-900 truncate max-w-[120px]">
                {user?.full_name || "Account"}
              </p>
              <p className="text-[10px] text-slate-400 capitalize">
                {activeOrg?.user_role?.toLowerCase() || "Owner"}
              </p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {userDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl py-1 z-50 animate-in fade-in slide-in-from-top-1">
              <div className="px-4 py-3 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-900 truncate">{user?.full_name}</p>
                <p className="text-[11px] text-slate-400 truncate mt-0.5">{user?.email}</p>
              </div>

              <div className="py-1">
                <Link
                  href="/settings?tab=Profile"
                  onClick={() => setUserDropdownOpen(false)}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 transition"
                >
                  <UserIcon className="w-3.5 h-3.5 text-slate-400" />
                  <span>Your Profile</span>
                </Link>
                <Link
                  href="/settings?tab=Organization"
                  onClick={() => setUserDropdownOpen(false)}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 transition"
                >
                  <Settings className="w-3.5 h-3.5 text-slate-400" />
                  <span>Workspace Settings</span>
                </Link>
                <Link
                  href="/settings?tab=Subscription"
                  onClick={() => setUserDropdownOpen(false)}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 transition"
                >
                  <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                  <span>Subscription &amp; Plans</span>
                </Link>
                <Link
                  href="/status"
                  onClick={() => setUserDropdownOpen(false)}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 transition"
                >
                  <Activity className="w-3.5 h-3.5 text-emerald-500" />
                  <span>System Status</span>
                </Link>
              </div>

              <div className="border-t border-slate-100 pt-1">
                <button
                  onClick={() => {
                    logout();
                    setUserDropdownOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-red-600 hover:bg-red-50 transition text-left font-medium"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
