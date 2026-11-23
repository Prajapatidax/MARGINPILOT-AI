"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Cookie, X, ShieldCheck, Settings, Check } from "lucide-react";

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);

  // Preference toggles
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true);
  const [performanceEnabled, setPerformanceEnabled] = useState(true);

  useEffect(() => {
    // Check if consent has already been saved
    const consent = localStorage.getItem("marginpilot_cookie_consent");
    if (!consent) {
      // Show banner after brief delay for smooth appearance
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  // Allow re-opening from elsewhere (e.g. Cookie policy page)
  useEffect(() => {
    const handleReopen = () => {
      setIsVisible(true);
      setShowPreferences(true);
    };
    window.addEventListener("marginpilot-reopen-cookie-banner", handleReopen);
    return () => window.removeEventListener("marginpilot-reopen-cookie-banner", handleReopen);
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem("marginpilot_cookie_consent", "all");
    localStorage.setItem("marginpilot_analytics_cookies", "true");
    localStorage.setItem("marginpilot_performance_cookies", "true");
    setIsVisible(false);
  };

  const handleRejectNonEssential = () => {
    localStorage.setItem("marginpilot_cookie_consent", "essential_only");
    localStorage.setItem("marginpilot_analytics_cookies", "false");
    localStorage.setItem("marginpilot_performance_cookies", "false");
    setIsVisible(false);
  };

  const handleSavePreferences = () => {
    localStorage.setItem("marginpilot_cookie_consent", "custom");
    localStorage.setItem("marginpilot_analytics_cookies", analyticsEnabled ? "true" : "false");
    localStorage.setItem("marginpilot_performance_cookies", performanceEnabled ? "true" : "false");
    setIsVisible(false);
    setShowPreferences(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 p-4 sm:p-6 pointer-events-none animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="max-w-4xl mx-auto bg-white/98 backdrop-blur-md border border-slate-200/90 rounded-2xl shadow-2xl p-5 sm:p-6 pointer-events-auto text-slate-800">
        {!showPreferences ? (
          /* Main Simple Banner */
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
            <div className="flex items-start gap-3.5 flex-1">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                <Cookie className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-2">
                  <span>We value your privacy and data security</span>
                  <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full">
                    Zero AI Model Training
                  </span>
                </h3>
                <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed max-w-2xl">
                  MarginPilot AI uses strictly necessary cookies for authentication, security, and tenant isolation. With your permission, we also use telemetry cookies to monitor model latency and improve system speed. Review our{" "}
                  <Link href="/cookies" className="text-blue-600 hover:text-blue-700 font-semibold underline">
                    Cookie Policy
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-blue-600 hover:text-blue-700 font-semibold underline">
                    Privacy Policy
                  </Link>
                  .
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto shrink-0 justify-end pt-2 lg:pt-0">
              <button
                type="button"
                onClick={() => setShowPreferences(true)}
                className="px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 border border-slate-200 hover:bg-slate-50 rounded-xl transition flex items-center gap-1.5"
              >
                <Settings className="w-3.5 h-3.5 text-slate-400" />
                <span>Customize</span>
              </button>

              <button
                type="button"
                onClick={handleRejectNonEssential}
                className="px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 border border-slate-200 hover:bg-slate-50 rounded-xl transition"
              >
                Reject Non-Essential
              </button>

              <button
                type="button"
                onClick={handleAcceptAll}
                className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm transition"
              >
                Accept All Cookies
              </button>
            </div>
          </div>
        ) : (
          /* Granular Preferences Modal View */
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">Cookie &amp; Data Preferences</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowPreferences(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600">
              {/* Category 1: Strictly Necessary */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-900">Strictly Necessary Cookies</p>
                  <p className="text-[11px] text-slate-500">
                    Required for JWT session authentication, tenant routing, and CSRF protection. Cannot be disabled.
                  </p>
                </div>
                <span className="text-[11px] font-bold text-slate-400 bg-slate-200 px-2 py-0.5 rounded">
                  Always Active
                </span>
              </div>

              {/* Category 2: Performance & Latency */}
              <div className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-900">Performance &amp; Model Latency</p>
                  <p className="text-[11px] text-slate-500">
                    Measures query execution times, ML inference response rates, and Redis cache hit ratios.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setPerformanceEnabled(!performanceEnabled)}
                  className={`w-11 h-6 rounded-full transition-colors flex items-center px-1 ${
                    performanceEnabled ? "bg-blue-600 justify-end" : "bg-slate-200 justify-start"
                  }`}
                >
                  <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
                </button>
              </div>

              {/* Category 3: Analytics & Usage */}
              <div className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-900">Analytics &amp; Feature Engagement</p>
                  <p className="text-[11px] text-slate-500">
                    Anonymized usage counts to prioritize upcoming features, integrations, and ML models.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setAnalyticsEnabled(!analyticsEnabled)}
                  className={`w-11 h-6 rounded-full transition-colors flex items-center px-1 ${
                    analyticsEnabled ? "bg-blue-600 justify-end" : "bg-slate-200 justify-start"
                  }`}
                >
                  <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <Link href="/cookies" className="text-xs font-semibold text-blue-600 hover:text-blue-700 underline">
                View Full Cookie Policy
              </Link>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowPreferences(false)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSavePreferences}
                  className="px-4 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm"
                >
                  Save Preferences
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
