"use client";

import React from "react";
import Link from "next/link";
import { Scale, FileCheck, CheckCircle2, AlertCircle } from "lucide-react";
import MarketingNavbar from "@/components/layout/MarketingNavbar";
import MarketingFooter from "@/components/layout/MarketingFooter";

export default function TermsAndConditionsPage() {
  const lastUpdated = "November 21, 2026";

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-600 selection:text-white flex flex-col">
      <MarketingNavbar />

      {/* Header */}
      <section className="bg-slate-50 border-b border-slate-200 py-12 px-6">
        <div className="max-w-4xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
            <Scale className="w-3.5 h-3.5" />
            Terms of Service
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Terms &amp; Conditions
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Last Updated: {lastUpdated} • Version 2.1 (Enterprise SaaS Terms)
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 px-6 max-w-4xl mx-auto w-full flex-1">
        <div className="prose prose-slate max-w-none space-y-8 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="font-bold text-slate-900 block text-sm">Agreement Summary</span>
            <p className="text-xs text-slate-600">
              By accessing or using the MarginPilot AI platform, services, or APIs, you agree on behalf of your organization to be bound by these Terms and Conditions. Please review these provisions carefully.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-2">
              1. Organization Accounts &amp; Tenant Governance
            </h2>
            <p>
              To access MarginPilot AI, you must register an organization workspace. The registering user is designated as the initial <strong>Organization Owner</strong> and holds ultimate administrative authority, including the ability to invite members, assign role-based permissions (Admin, Manager, Analyst, Staff), and authorize data ingestion.
            </p>
            <p>
              You are responsible for maintaining the confidentiality of access credentials and ensuring that all users associated with your tenant comply with these Terms.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-2">
              2. Permitted Use &amp; Platform Restrictions
            </h2>
            <p>
              MarginPilot AI grants your organization a non-exclusive, non-transferable, worldwide license to utilize our business intelligence dashboard, machine learning inference endpoints, and decision simulators. You agree not to:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600">
              <li>Attempt to bypass, defeat, or tamper with organization Row-Level Security (RLS) or multi-tenant database isolation.</li>
              <li>Reverse engineer, decompile, or reconstruct the underlying algorithmic weights or source code.</li>
              <li>Upload malicious code, corrupted payloads, or intentionally fraudulent data intended to disrupt service infrastructure.</li>
              <li>Resell, sublicense, or operate MarginPilot AI as a white-labeled service without explicit Enterprise authorization.</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-2">
              3. Service Level Agreement (SLA) &amp; Uptime Commitment
            </h2>
            <p>
              MarginPilot AI commits to providing <strong>99.9% monthly uptime</strong> across all production API and database services, excluding scheduled maintenance communicated at least 48 hours in advance. Enterprise Tier clients receive a <strong>99.99% high-availability SLA</strong> backed by dedicated Neon PostgreSQL database branches and redundant multi-region Upstash caching.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-2">
              4. Machine Learning Predictions &amp; Decision Simulations
            </h2>
            <p>
              MarginPilot AI utilizes statistical machine learning (including XGBoost, LightGBM, and PyTorch LSTM) to provide demand forecasts, churn likelihoods, and scenario simulations. You acknowledge that:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600">
              <li>
                Predictions are probabilistic decision-support estimates derived from historical data and market assumptions.
              </li>
              <li>
                Margin simulations do not guarantee specific financial results or profitability.
              </li>
              <li>
                Final operational decisions regarding pricing, discounts, and inventory orders remain the sole responsibility of your management.
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-2">
              5. Intellectual Property &amp; Customer Data Ownership
            </h2>
            <p>
              <strong>Your Data:</strong> As between you and MarginPilot AI, you retain 100% of all right, title, and interest in your uploaded datasets, proprietary pricing models, customer records, and financial figures.
            </p>
            <p>
              <strong>Our Platform:</strong> MarginPilot AI, Inc. retains all intellectual property rights in the software, algorithms, UI components, documentation, and trademarks.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-2">
              6. Subscription Billing, Upgrades &amp; Cancellation
            </h2>
            <p>
              Subscriptions are billed in advance on a recurring monthly or annual basis depending on your selected plan. You may cancel your subscription at any time through the Organization Settings dashboard. Upon cancellation, your workspace remains fully accessible through the conclusion of the active billing period.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-2">
              7. 30-Day Refund Policy &amp; 15 Business Days Resolution SLA
            </h2>
            <p>
              We provide a transparent, risk-free subscription experience:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600">
              <li>
                <strong>30-Day Money-Back Guarantee:</strong> Customers may request a 100% full refund within thirty (30) calendar days of their initial subscription charge or renewal date.
              </li>
              <li>
                <strong>15 Business Days Resolution Commitment:</strong> All submitted refund inquiries and payout solutions will be fully investigated and processed within fifteen (15) business days.
              </li>
              <li>
                For complete terms and instructions on requesting a refund, please review our official{" "}
                <Link href="/refund" className="text-blue-600 hover:text-blue-700 font-semibold underline">
                  Refund &amp; Cancellation Policy
                </Link>
                .
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-2">
              8. Privacy, Telemetry &amp; Cookie Compliance
            </h2>
            <p>
              By utilizing MarginPilot AI, you agree to our data handling practices described in our{" "}
              <Link href="/privacy" className="text-blue-600 hover:text-blue-700 font-semibold underline">
                Privacy Policy
              </Link>{" "}
              and{" "}
              <Link href="/cookies" className="text-blue-600 hover:text-blue-700 font-semibold underline">
                Cookie Declaration
              </Link>
              . We never sell your data or use it to train public artificial intelligence models.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-2">
              9. Regional Corporate Office &amp; Inquiries
            </h2>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1 font-mono text-slate-700">
              <p className="font-bold font-sans text-slate-900">MarginPilot AI, Inc. — Legal &amp; Compliance</p>
              <p>GIFT City / Gandhinagar, Gujarat 382355, India</p>
              <p>Inquiries: legal@marginpilot.ai • billing@marginpilot.ai</p>
            </div>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
