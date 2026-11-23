"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Cookie,
  ShieldCheck,
  Lock,
  CheckCircle2,
  Settings,
  RotateCcw,
  Sliders,
  Info,
  ExternalLink,
} from "lucide-react";
import MarketingNavbar from "@/components/layout/MarketingNavbar";
import MarketingFooter from "@/components/layout/MarketingFooter";

export default function CookiePolicyPage() {
  const lastUpdated = "November 23, 2026";

  const [consentStatus, setConsentStatus] = useState<string>("essential_only");
  const [performanceEnabled, setPerformanceEnabled] = useState(true);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true);
  const [savedNotification, setSavedNotification] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("marginpilot_cookie_consent") || "essential_only";
    setConsentStatus(saved);
    setPerformanceEnabled(localStorage.getItem("marginpilot_performance_cookies") !== "false");
    setAnalyticsEnabled(localStorage.getItem("marginpilot_analytics_cookies") !== "false");
  }, []);

  const handleSaveSettings = () => {
    localStorage.setItem("marginpilot_cookie_consent", "custom");
    localStorage.setItem("marginpilot_performance_cookies", performanceEnabled ? "true" : "false");
    localStorage.setItem("marginpilot_analytics_cookies", analyticsEnabled ? "true" : "false");
    setConsentStatus("custom");
    setSavedNotification(true);
    setTimeout(() => setSavedNotification(false), 3000);
  };

  const handleOpenBanner = () => {
    window.dispatchEvent(new CustomEvent("marginpilot-reopen-cookie-banner"));
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-600 selection:text-white flex flex-col">
      <MarketingNavbar />

      {/* Header Banner */}
      <section className="bg-slate-50 border-b border-slate-200 py-14 px-6">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">
            <Cookie className="w-3.5 h-3.5" />
            <span>Transparency &amp; Consent Management</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Cookie Policy &amp; Content Declaration
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl">
            This declaration provides a complete inventory of all cookies, local storage keys, and telemetry identifiers utilized across MarginPilot AI applications.
          </p>

          <p className="text-[11px] text-slate-400">
            Last Updated: {lastUpdated} • Version 2.0 • MarginPilot AI, Inc.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 px-6 max-w-4xl mx-auto w-full flex-1 space-y-10 text-xs sm:text-sm text-slate-700 leading-relaxed">
        {/* Interactive Consent Control Panel */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-50/80 via-white to-indigo-50/50 border border-blue-200 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-blue-100">
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-blue-600" />
                <span>Your Live Cookie Settings</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Current mode: <strong className="text-slate-800 uppercase">{consentStatus}</strong>
              </p>
            </div>
            <button
              type="button"
              onClick={handleOpenBanner}
              className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-xl transition flex items-center gap-1.5 self-start sm:self-auto"
            >
              <Settings className="w-3.5 h-3.5 text-slate-400" />
              <span>Launch Preference Popup</span>
            </button>
          </div>

          <div className="space-y-3">
            {/* Category 1: Essential */}
            <div className="p-3.5 bg-white/90 border border-slate-200 rounded-xl flex items-center justify-between gap-4">
              <div>
                <span className="font-bold text-slate-900 block text-xs">1. Strictly Necessary (Essential)</span>
                <span className="text-[11px] text-slate-500">
                  Required for JWT login, tenant isolation context, and CSRF protection. Cannot be disabled.
                </span>
              </div>
              <span className="px-2.5 py-1 text-[10px] font-bold bg-slate-100 text-slate-500 rounded-md shrink-0">
                Always Active
              </span>
            </div>

            {/* Category 2: Performance */}
            <div className="p-3.5 bg-white/90 border border-slate-200 rounded-xl flex items-center justify-between gap-4">
              <div>
                <span className="font-bold text-slate-900 block text-xs">2. Performance &amp; Latency</span>
                <span className="text-[11px] text-slate-500">
                  Monitors SQL queries, PyTorch inference speed, and Upstash Redis cache hit rates.
                </span>
              </div>
              <button
                type="button"
                onClick={() => setPerformanceEnabled(!performanceEnabled)}
                className={`w-11 h-6 rounded-full transition-colors flex items-center px-1 shrink-0 ${
                  performanceEnabled ? "bg-blue-600 justify-end" : "bg-slate-200 justify-start"
                }`}
              >
                <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
              </button>
            </div>

            {/* Category 3: Analytics */}
            <div className="p-3.5 bg-white/90 border border-slate-200 rounded-xl flex items-center justify-between gap-4">
              <div>
                <span className="font-bold text-slate-900 block text-xs">3. Analytics &amp; Feature Telemetry</span>
                <span className="text-[11px] text-slate-500">
                  Aggregated telemetry to identify most frequently used intelligence widgets and forecasting horizons.
                </span>
              </div>
              <button
                type="button"
                onClick={() => setAnalyticsEnabled(!analyticsEnabled)}
                className={`w-11 h-6 rounded-full transition-colors flex items-center px-1 shrink-0 ${
                  analyticsEnabled ? "bg-blue-600 justify-end" : "bg-slate-200 justify-start"
                }`}
              >
                <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            {savedNotification ? (
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4" />
                <span>Preferences saved successfully!</span>
              </span>
            ) : (
              <span className="text-[11px] text-slate-400">Settings update immediately in your browser</span>
            )}
            <button
              type="button"
              onClick={handleSaveSettings}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm transition"
            >
              Update Preferences
            </button>
          </div>
        </div>

        {/* Section 1: What Are Cookies */}
        <div className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 border-b border-slate-200 pb-2">
            1. What Are Cookies and Local Storage?
          </h2>
          <p>
            Cookies are small text files placed on your computer, tablet, or smartphone when you access web services. MarginPilot AI also utilizes HTML5 LocalStorage keys to maintain your signed-in JWT token session across tabs and preserve the currently active organization context without requiring repetitive logins.
          </p>
          <p>
            We strictly enforce a policy of <strong>zero advertising cookies</strong>, <strong>zero third-party tracking pixels</strong>, and <strong>zero data sharing for third-party commercial advertising</strong>.
          </p>
        </div>

        {/* Section 2: Cookie Inventory Table */}
        <div className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 border-b border-slate-200 pb-2">
            2. Detailed Cookie &amp; Storage Inventory
          </h2>
          <p className="text-xs text-slate-600">
            Below is the verified inventory of all technical identifiers used by the MarginPilot AI application:
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
                <tr>
                  <th className="p-3">Identifier Name</th>
                  <th className="p-3">Classification</th>
                  <th className="p-3">Purpose &amp; Data Stored</th>
                  <th className="p-3">Duration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600">
                <tr className="hover:bg-slate-50/50">
                  <td className="p-3 font-mono font-bold text-blue-700">marginpilot_token</td>
                  <td className="p-3 font-semibold text-slate-900">Strictly Necessary</td>
                  <td className="p-3">Encrypted HS256 JWT bearer token authenticating your user session.</td>
                  <td className="p-3">24 Hours</td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="p-3 font-mono font-bold text-blue-700">marginpilot_active_org_id</td>
                  <td className="p-3 font-semibold text-slate-900">Strictly Necessary</td>
                  <td className="p-3">Routes analytical queries and data grids to your active tenant.</td>
                  <td className="p-3">Persistent</td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="p-3 font-mono font-bold text-blue-700">marginpilot_cookie_consent</td>
                  <td className="p-3 font-semibold text-slate-900">Strictly Necessary</td>
                  <td className="p-3">Stores your accepted cookie consent choices (all / essential / custom).</td>
                  <td className="p-3">1 Year</td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="p-3 font-mono font-bold text-blue-700">_mp_perf_metrics</td>
                  <td className="p-3 font-semibold text-slate-700">Performance</td>
                  <td className="p-3">Measures frontend React render times and API latency.</td>
                  <td className="p-3">Session</td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="p-3 font-mono font-bold text-blue-700">_mp_feature_telemetry</td>
                  <td className="p-3 font-semibold text-slate-700">Analytics</td>
                  <td className="p-3">Anonymous count of module visits (e.g. Sales, Simulator, Copilot).</td>
                  <td className="p-3">30 Days</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 3: Browser Management */}
        <div className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 border-b border-slate-200 pb-2">
            3. How to Clear or Disable Cookies in Your Browser
          </h2>
          <p>
            You can modify your browser settings to decline all cookies or to alert you when a cookie is placed. Note that if you disable strictly necessary cookies, you will not be able to log in or access authenticated organization workspaces.
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600">
            <li>
              <strong>Google Chrome:</strong> Settings → Privacy and Security → Third-party cookies
            </li>
            <li>
              <strong>Mozilla Firefox:</strong> Settings → Privacy &amp; Security → Enhanced Tracking Protection
            </li>
            <li>
              <strong>Apple Safari:</strong> Preferences → Privacy → Manage Website Data
            </li>
            <li>
              <strong>Microsoft Edge:</strong> Settings → Cookies and Site Permissions → Manage and delete cookies
            </li>
          </ul>
        </div>

        {/* Section 4: Privacy Questions */}
        <div className="space-y-2 pt-4 border-t border-slate-200">
          <h2 className="text-base sm:text-lg font-bold text-slate-900">
            4. Questions &amp; Data Protection Officer Contact
          </h2>
          <p className="text-xs text-slate-600">
            For questions about our Cookie Declaration or to exercise your GDPR / CCPA privacy rights:
          </p>
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1 text-slate-700">
            <p className="font-bold text-slate-900">MarginPilot AI — Data Privacy Office</p>
            <p>GIFT City / Gandhinagar, Gujarat 382355, India</p>
            <p>Email: privacy@marginpilot.ai • security@marginpilot.ai</p>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
