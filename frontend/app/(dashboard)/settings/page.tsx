"use client";

import React, { useState } from "react";
import {
  Settings,
  User,
  Building2,
  CreditCard,
  Grid,
  Shield,
  Bell,
  CheckCircle2,
  Save,
} from "lucide-react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<string>("Organization");
  const [companyName, setCompanyName] = useState<string>("Acme Corporation");
  const [businessType, setBusinessType] = useState<string>("Retail");
  const [currency, setCurrency] = useState<string>("USD");
  const [timezone, setTimezone] = useState<string>("(UTC-5:00) New York");
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  const tabs = [
    { name: "Profile", icon: User },
    { name: "Organization", icon: Building2 },
    { name: "Subscription", icon: CreditCard },
    { name: "Integrations", icon: Grid },
    { name: "Security", icon: Shield },
    { name: "Notifications", icon: Bell },
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Page Header matching mockup */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <Settings className="w-7 h-7 text-blue-600" />
          Settings
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage your account and preferences
        </p>
      </div>

      {/* Main Grid: Tabs on left, Form on right */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
        {/* Left Navigation Tabs matching mockup */}
        <div className="bg-white rounded-xl border border-slate-200 p-2 shadow-2xs space-y-1">
          {tabs.map((t) => {
            const Icon = t.icon;
            const isActive = activeTab === t.name;
            return (
              <button
                key={t.name}
                onClick={() => setActiveTab(t.name)}
                className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition ${
                  isActive
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-blue-600" : "text-slate-400"}`} />
                {t.name}
              </button>
            );
          })}
        </div>

        {/* Right Content Panel matching mockup */}
        <div className="md:col-span-3 bg-white rounded-xl border border-slate-200 p-6 shadow-2xs">
          <h2 className="text-base font-bold text-slate-900 mb-6">
            Organization Settings
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {/* Form Fields matching mockup */}
            <form onSubmit={handleSave} className="md:col-span-2 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Company Name
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Business Type
                  </label>
                  <select
                    value={businessType}
                    onChange={(e) => setBusinessType(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                  >
                    <option value="Retail">Retail</option>
                    <option value="Manufacturing">Manufacturing</option>
                    <option value="Wholesale">Wholesale</option>
                    <option value="Distribution">Distribution</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Currency
                  </label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="CAD">CAD ($)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Timezone
                </label>
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                >
                  <option value="(UTC-5:00) New York">(UTC-5:00) New York</option>
                  <option value="(UTC-8:00) Los Angeles">(UTC-8:00) Los Angeles</option>
                  <option value="(UTC+0:00) London">(UTC+0:00) London</option>
                  <option value="(UTC+1:00) Berlin">(UTC+1:00) Berlin</option>
                </select>
              </div>

              {saveSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Organization settings updated successfully.
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-2xs transition inline-flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  Save Changes
                </button>
              </div>
            </form>

            {/* Office Picture Preview Card matching mockup */}
            <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 text-center">
              <div className="w-full h-40 rounded-lg overflow-hidden border border-slate-200 mb-3 bg-blue-100 flex items-center justify-center">
                <Building2 className="w-16 h-16 text-blue-500 opacity-60" />
              </div>
              <div className="text-xs font-bold text-slate-900">
                {companyName}
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Primary Workspace
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
