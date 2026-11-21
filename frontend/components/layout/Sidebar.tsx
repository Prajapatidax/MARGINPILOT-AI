"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  TrendingUp,
  Users,
  LineChart,
  Boxes,
  Truck,
  DollarSign,
  AlertTriangle,
  Bot,
  Sliders,
  FileText,
  Database,
  Cpu,
  Settings,
  HelpCircle,
  ShieldCheck,
  Activity,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  adminOnly?: boolean;
}

const mainNavItems: NavItem[] = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Sales Intelligence", href: "/sales", icon: TrendingUp },
  { name: "Customer Intelligence", href: "/customers", icon: Users },
  { name: "Demand Forecasting", href: "/forecasting", icon: LineChart },
  { name: "Inventory Intelligence", href: "/inventory", icon: Boxes },
  { name: "Supplier Intelligence", href: "/suppliers", icon: Truck },
  { name: "Financial Intelligence", href: "/financial", icon: DollarSign },
  { name: "Anomaly Detection", href: "/anomalies", icon: AlertTriangle },
  { name: "AI Copilot", href: "/copilot", icon: Bot },
  { name: "What-If Simulator", href: "/simulator", icon: Sliders },
  { name: "Reports", href: "/reports", icon: FileText },
  { name: "Data Management", href: "/data-management", icon: Database },
  { name: "ML Model Center", href: "/model-center", icon: Cpu },
];

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-screen select-none">
      {/* Brand Logo */}
      <div className="h-16 flex items-center px-6 border-b border-slate-100 gap-3">
        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold shadow-sm">
          M
        </div>
        <div>
          <span className="font-bold text-slate-900 tracking-tight text-lg">MarginPilot</span>
          <span className="text-blue-600 font-semibold text-xs ml-1 bg-blue-50 px-1.5 py-0.5 rounded">AI</span>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {mainNavItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-blue-50 text-blue-600 font-semibold"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? "text-blue-600" : "text-slate-400"}`} />
              <span>{item.name}</span>
            </Link>
          );
        })}

        {/* Superadmin Link */}
        {user?.is_superadmin && (
          <Link
            href="/admin"
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              pathname === "/admin"
                ? "bg-purple-50 text-purple-600 font-semibold"
                : "text-purple-600 hover:bg-purple-50"
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-purple-600" />
            <span>Admin Console</span>
          </Link>
        )}
      </nav>

      {/* Footer Nav */}
      <div className="p-3 border-t border-slate-100 space-y-1">
        <Link
          href="/settings"
          className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            pathname === "/settings"
              ? "bg-blue-50 text-blue-600 font-semibold"
              : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
          }`}
        >
          <Settings className="w-4 h-4 text-slate-400" />
          <span>Settings</span>
        </Link>
        <Link
          href="/status"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
        >
          <Activity className="w-4 h-4 text-emerald-500" />
          <span>System Status</span>
        </Link>
      </div>
    </aside>
  );
};
