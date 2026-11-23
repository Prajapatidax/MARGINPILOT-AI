"use client";

import React from "react";
import Link from "next/link";
import {
  RotateCcw,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Mail,
  AlertCircle,
  CreditCard,
  Building2,
  Calendar,
  ArrowRight,
} from "lucide-react";
import MarketingNavbar from "@/components/layout/MarketingNavbar";
import MarketingFooter from "@/components/layout/MarketingFooter";

export default function RefundPolicyPage() {
  const lastUpdated = "November 23, 2026";

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-600 selection:text-white flex flex-col">
      <MarketingNavbar />

      {/* Header Banner */}
      <section className="bg-slate-50 border-b border-slate-200 py-14 px-6">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Customer Trust &amp; Billing Transparency</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Refund &amp; Cancellation Policy
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl">
            We stand behind the intelligence and accuracy of MarginPilot AI. Review our guaranteed 30-day refund window and our 15 business days resolution commitment.
          </p>

          <p className="text-[11px] text-slate-400">
            Last Updated: {lastUpdated} • Version 2.2 • MarginPilot AI, Inc.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 px-6 max-w-4xl mx-auto w-full flex-1">
        <div className="space-y-10 text-xs sm:text-sm text-slate-700 leading-relaxed">
          {/* Core Guarantee Highlights Callout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Box 1: 30-Day Refund */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50/50 border border-blue-200 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                <RotateCcw className="w-5 h-5" />
              </div>
              <h2 className="text-sm sm:text-base font-bold text-blue-950 pt-1">
                30-Day Money-Back Guarantee
              </h2>
              <p className="text-xs text-blue-900/80 leading-relaxed">
                If you are not completely satisfied with your MarginPilot AI subscription, you are entitled to request a <strong>100% full refund within 30 days</strong> of your initial billing charge or subscription renewal date.
              </p>
            </div>

            {/* Box 2: 15 Business Days Resolution */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50/50 border border-emerald-200 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                <Clock className="w-5 h-5" />
              </div>
              <h2 className="text-sm sm:text-base font-bold text-emerald-950 pt-1">
                15 Business Days Resolution SLA
              </h2>
              <p className="text-xs text-emerald-900/80 leading-relaxed">
                Every refund request or dispute resolution inquiry will be formally reviewed, determined, and <strong>processed within 15 business days</strong> of receipt, ensuring swift payouts directly to your original payment method.
              </p>
            </div>
          </div>

          {/* Section 1: Eligibility Window */}
          <div className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 border-b border-slate-200 pb-2">
              1. Refund Scope &amp; Eligibility
            </h2>
            <p>
              This Refund Policy applies to all self-serve recurring subscription tiers offered on MarginPilot AI, including the <strong>Starter</strong>, <strong>Growth</strong>, and standard <strong>Enterprise</strong> plans.
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600">
              <li>
                <strong>30-Calendar-Day Horizon:</strong> Refund requests must be initiated within thirty (30) calendar days from the date of the disputed transaction or invoice generation.
              </li>
              <li>
                <strong>First-Time Subscriptions:</strong> New customers subscribing after the 14-day free trial are eligible for a complete, no-questions-asked refund within the first 30 days of their paid term.
              </li>
              <li>
                <strong>Annual Plan Protections:</strong> For customers billed on an annual cadence, refund requests submitted within the first 30 days of the annual renewal are refunded in full. Requests after 30 days are subject to prorated evaluation at company discretion.
              </li>
            </ul>
          </div>

          {/* Section 2: 15 Business Days Workflow */}
          <div className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 border-b border-slate-200 pb-2">
              2. 15 Business Days Processing &amp; Solution Protocol
            </h2>
            <p>
              We pride ourselves on transparent, prompt financial operations. When you submit a refund or cancellation ticket, our billing operations follow this strict timeline:
            </p>

            <div className="space-y-3 pt-1">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  1
                </span>
                <div>
                  <h3 className="font-bold text-slate-900 text-xs">Submission &amp; Case Opening (Day 1)</h3>
                  <p className="text-[11px] text-slate-600">
                    Your request is assigned an official ticket ID within 24 hours of emailing billing support.
                  </p>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  2
                </span>
                <div>
                  <h3 className="font-bold text-slate-900 text-xs">Technical &amp; Billing Review (Days 2–7)</h3>
                  <p className="text-[11px] text-slate-600">
                    Our team reviews account activity, confirms transaction details, and explores whether a technical resolution, data re-sync, or immediate payout is required.
                  </p>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  3
                </span>
                <div>
                  <h3 className="font-bold text-slate-900 text-xs">Resolution Payout &amp; Confirmation (Days 8–15)</h3>
                  <p className="text-[11px] text-slate-600">
                    The refund is approved and executed through our payment gateways (Stripe, Razorpay, or wire). Funds typically reflect on credit cards within 5–10 banking days depending on your issuing financial institution.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: How to Submit a Request */}
          <div className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 border-b border-slate-200 pb-2">
              3. How to Request a Refund
            </h2>
            <p>
              To ensure prompt verification within the 15 business days window, please email our billing department from your registered Organization Owner email address:
            </p>

            <div className="p-5 bg-blue-50/60 border border-blue-200 rounded-2xl space-y-3 text-xs">
              <div className="flex items-center gap-2 font-bold text-blue-900">
                <Mail className="w-4 h-4 text-blue-600" />
                <span>Contact Email: billing@marginpilot.ai</span>
              </div>
              <p className="text-slate-700">Please provide the following details in your email:</p>
              <ul className="list-disc pl-5 space-y-1 text-slate-600">
                <li>Your Organization Name and Organization ID (found in Settings → General)</li>
                <li>The invoice or charge receipt number</li>
                <li>The date of transaction and amount charged</li>
                <li>A brief description of why MarginPilot AI did not meet your operational expectations</li>
              </ul>
            </div>
          </div>

          {/* Section 4: Subscription Cancellation */}
          <div className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 border-b border-slate-200 pb-2">
              4. Subscription Cancellation
            </h2>
            <p>
              You may cancel your recurring subscription at any time directly through your dashboard under <strong>Settings → Subscription → Cancel Plan</strong>. Upon cancellation:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600">
              <li>
                You retain access to your business intelligence data, forecasts, and reports until the end of your paid billing cycle.
              </li>
              <li>
                No further automatic charges will occur after the expiration of the current cycle.
              </li>
              <li>
                You can export all canonical transactional datasets, forecast JSONs, and PDF executive reports before your workspace expires.
              </li>
            </ul>
          </div>

          {/* Section 5: Office Location & Legal Notice */}
          <div className="space-y-3 pt-4 border-t border-slate-200">
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              5. Regional Office &amp; Jurisdiction
            </h2>
            <p className="text-xs text-slate-600">
              MarginPilot AI financial operations and compliance are managed from our corporate headquarters:
            </p>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1 text-slate-700">
              <p className="font-bold text-slate-900">MarginPilot AI, Inc. — Billing Operations</p>
              <p>GIFT City / Gandhinagar, Gujarat 382355, India</p>
              <p>Email: legal@marginpilot.ai • billing@marginpilot.ai</p>
            </div>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
