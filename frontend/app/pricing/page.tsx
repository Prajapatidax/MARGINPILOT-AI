"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Check,
  ArrowRight,
  ShieldCheck,
  Zap,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Globe2,
  Lock,
  BadgeCheck,
  Clock,
  CreditCard,
  Layers,
  Bot,
  BarChart3,
  Database,
  Building2,
  CheckCircle2,
  Minus,
  Info,
  PhoneCall,
  RefreshCw,
  Award,
  Users,
} from "lucide-react";
import MarketingNavbar from "@/components/layout/MarketingNavbar";
import MarketingFooter from "@/components/layout/MarketingFooter";
import { COUNTRIES, CountryCurrency, formatPlanPrice } from "@/lib/currencies";

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<"annual" | "monthly">("annual");
  const [selectedCurrency, setSelectedCurrency] = useState<CountryCurrency>(COUNTRIES[0]);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const getPrice = (usdMonthly: number, usdAnnual: number) => {
    const usd = billingCycle === "annual" ? usdAnnual : usdMonthly;
    return formatPlanPrice(usd, selectedCurrency.code);
  };

  const getAnnualBilledSummary = (usdAnnual: number) => {
    const annualUsdTotal = usdAnnual * 12;
    return formatPlanPrice(annualUsdTotal, selectedCurrency.code);
  };

  const plans = [
    {
      id: "starter",
      name: "Starter",
      badge: "Emerging Businesses",
      tagline: "Essential profit intelligence and demand monitoring for single-store retailers and distributors.",
      usdMonthly: 199,
      usdAnnual: 159,
      seats: "Includes 3 Team Seats",
      volume: "Up to 25,000 monthly transactions",
      features: [
        "Real-Time Gross & Net Margin Analytics",
        "Canonical CSV / XLSX & REST Data Ingestion",
        "30-Day Single-Horizon Demand Forecast",
        "Customer RFM Churn Risk Segmentation",
        "Inventory Reorder Point Alerts",
        "Standard Export (PDF, Excel, CSV)",
        "3 User Seats Included (No per-seat fee)",
        "Community & Email Support (24h SLA)",
      ],
      notIncluded: [
        "PyTorch Deep Learning (LSTM)",
        "Gemini AI Business Copilot",
        "What-If Scenario Simulator",
        "XGBoost + SHAP Explainability",
        "Dedicated Database Branch",
      ],
      cta: "Start 14-Day Free Trial",
      href: `/register?plan=starter&currency=${selectedCurrency.code}`,
      highlighted: false,
      tierBadgeColor: "bg-slate-100 text-slate-800 border-slate-200",
    },
    {
      id: "growth",
      name: "Growth",
      badge: "Most Popular",
      tagline: "Complete AI operating system with PyTorch deep learning, Gemini AI copilot, and profit simulation.",
      usdMonthly: 499,
      usdAnnual: 399,
      seats: "Includes 15 Team Seats",
      volume: "Up to 250,000 monthly transactions",
      features: [
        "Everything in Starter, plus:",
        "PyTorch Deep Learning LSTM Demand Forecasting (90-day)",
        "Gemini AI Business Copilot with Verified SQL Grounding",
        "What-If Business Scenario Simulator (Price & Cost Elasticity)",
        "XGBoost Customer Churn with SHAP Attribution",
        "Isolation Forest Anomaly & Margin Leak Detection",
        "Dynamic Economic Order Quantity (EOQ) Optimization",
        "Supplier Lead-Time & Risk Reliability Scoring",
        "Upstash Redis Accelerated Caching Layer",
        "15 User Seats Included",
        "Priority Support (4h Response SLA)",
      ],
      notIncluded: [
        "Dedicated Database Branch",
        "Custom ERP Connectors (SAP / NetSuite)",
        "99.99% Custom Enterprise SLA",
      ],
      cta: "Start 14-Day Free Trial",
      href: `/register?plan=growth&currency=${selectedCurrency.code}`,
      highlighted: true,
      tierBadgeColor: "bg-blue-600 text-white border-blue-600",
    },
    {
      id: "enterprise",
      name: "Enterprise",
      badge: "High-Volume & Scale",
      tagline: "Dedicated serverless database branches, tailored ML model fine-tuning, and dedicated solutions engineering.",
      usdMonthly: 1299,
      usdAnnual: 1099,
      seats: "Unlimited Team Seats",
      volume: "Unlimited monthly transactions",
      features: [
        "Everything in Growth, plus:",
        "Dedicated Neon PostgreSQL Serverless Database Branch",
        "Custom ERP & WMS Integrations (SAP, NetSuite, Oracle, Microsoft Dynamics)",
        "Custom Machine Learning Model Fine-Tuning on your proprietary datasets",
        "365-Day Long-Range Demand & Capacity Planning",
        "Granular Row-Level Security (RLS) & Custom RBAC Roles",
        "Multi-Hub Inventory Reallocation Optimizer",
        "Real-Time Webhook & Streaming Data Pipelines",
        "Unlimited User Seats & Enterprise Directory Sync (SSO / SAML)",
        "99.99% Uptime Guarantee Service Level Agreement",
        "Dedicated Solutions Architect & Onboarding Engineer",
        "SOC 2 Type II, ISO 27001 & Custom DPA Package",
      ],
      notIncluded: [],
      cta: "Contact Enterprise Sales",
      href: `/contact?type=enterprise&currency=${selectedCurrency.code}`,
      highlighted: false,
      tierBadgeColor: "bg-slate-900 text-white border-slate-900",
    },
  ];

  const comparisonCategories = [
    {
      category: "Core Financial & Sales Analytics",
      icon: BarChart3,
      rows: [
        { name: "Real-time Gross Profit & Net Margin Tracking", starter: true, growth: true, enterprise: true, note: "Real-time computation per SKU" },
        { name: "Dynamic Period Comparison (PoP, MoM, YoY)", starter: true, growth: true, enterprise: true, note: "Adaptive calendar normalization" },
        { name: "Multi-Store & Warehouse Locations", starter: "Up to 2", growth: "Up to 10", enterprise: "Unlimited", note: "Centralized inventory view" },
        { name: "Customer Cohort & Profitability Analysis", starter: true, growth: true, enterprise: true, note: "Gross margin by customer segment" },
        { name: "Automated Financial & Margin Reports", starter: "Manual Export", growth: "Scheduled (Email)", enterprise: "Automated + Webhooks", note: "PDF / CSV / XLSX delivery" },
      ],
    },
    {
      category: "Machine Learning & Predictive Intelligence",
      icon: Layers,
      rows: [
        { name: "Customer RFM Churn Classification", starter: true, growth: true, enterprise: true, note: "Recency, Frequency, Monetary scoring" },
        { name: "PyTorch Deep Learning LSTM Demand Forecasting", starter: "30-Day Basic", growth: "90-Day Multi-Layer", enterprise: "365-Day Ensemble", note: "Trained on historical demand signals" },
        { name: "XGBoost Machine Learning Churn Predictor", starter: false, growth: true, enterprise: true, note: "Gradient-boosted decision trees" },
        { name: "SHAP Explainability Insights", starter: false, growth: true, enterprise: true, note: "Interpret why customers are at risk" },
        { name: "Isolation Forest Anomaly & Fraud Engine", starter: false, growth: true, enterprise: true, note: "Automatic detection of abnormal orders" },
        { name: "Supplier Lead-Time & Reliability Scoring", starter: "Basic", growth: "Dynamic Risk", enterprise: "Multi-Tier Predictive", note: "Supplier delivery variance tracking" },
      ],
    },
    {
      category: "Decision Automation & AI Copilot",
      icon: Bot,
      rows: [
        { name: "Gemini AI Business Copilot (SQL Grounding)", starter: false, growth: true, enterprise: true, note: "Ask complex queries in natural English" },
        { name: "What-If Scenario Simulator", starter: false, growth: true, enterprise: true, note: "Simulate price changes, supplier hikes & discounts" },
        { name: "Dynamic EOQ Reorder Optimization", starter: "Static Alert", growth: "Dynamic EOQ", enterprise: "Multi-Hub Allocation", note: "Minimize carrying costs while preventing stockouts" },
        { name: "Executive AI Strategy Briefs", starter: false, growth: "Weekly", enterprise: "Real-Time / Daily", note: "Autonomous executive summaries" },
      ],
    },
    {
      category: "Data Infrastructure & Scalability",
      icon: Database,
      rows: [
        { name: "Monthly Transaction Capacity", starter: "25,000 lines", growth: "250,000 lines", enterprise: "Unlimited", note: "High-throughput ingestion" },
        { name: "Database Architecture", starter: "Neon Serverless Shared", growth: "Neon Serverless Shared", enterprise: "Dedicated Database Branch", note: "Isolated PostgreSQL database" },
        { name: "High-Speed Redis Caching", starter: "Standard", growth: "Upstash TLS Redis", enterprise: "Multi-Region Cluster", note: "Sub-10ms dashboard queries" },
        { name: "ERP & POS Connectors", starter: "CSV / XLSX / REST", growth: "Shopify / WooCommerce / Stripe", enterprise: "SAP / NetSuite / Custom WMS", note: "Bidirectional automated sync" },
        { name: "API Rate Limits", starter: "120 req / min", growth: "1,200 req / min", enterprise: "Custom Dedicated", note: "REST API developer access" },
      ],
    },
    {
      category: "Governance, Security & Support",
      icon: ShieldCheck,
      rows: [
        { name: "Team Seats Included", starter: "3 Seats", growth: "15 Seats", enterprise: "Unlimited", note: "Zero per-seat penalty" },
        { name: "Audit Trail & Historic Activity Logs", starter: "30 Days", growth: "1 Year", enterprise: "Unlimited Immutable", note: "Full administrative compliance" },
        { name: "Role-Based Access Control (RBAC)", starter: "Standard (Admin/User)", growth: "Custom Roles", enterprise: "Granular Row-Level Security", note: "Restrict sensitive margin views" },
        { name: "Data Privacy & Zero AI Model Training", starter: true, growth: true, enterprise: true, note: "Your data is NEVER shared or used to train public AI" },
        { name: "Service Level Agreement (SLA)", starter: "99.5% Uptime", growth: "99.9% Uptime", enterprise: "99.99% Uptime Guaranteed", note: "Backed by financial credits" },
        { name: "Customer Support Channels", starter: "Email & Docs (24h)", growth: "Priority Email & Chat (4h)", enterprise: "Dedicated Slack & Phone (1h)", note: "Rapid technical escalation" },
        { name: "Dedicated Solutions Architect", starter: false, growth: false, enterprise: true, note: "Direct access to AI engineering team" },
      ],
    },
  ];

  const faqs = [
    {
      q: "How does MarginPilot AI's Global Price Parity work?",
      a: "We believe business intelligence should be globally accessible and equitable. Our pricing in all 12 supported currencies (including USD, INR, EUR, GBP, CAD, AUD, JPY, and AED) is derived directly from real-time fair market exchange rates. We never impose geographic markups, regional penalties, or hidden currency conversion fees.",
    },
    {
      q: "What is your 30-Day Money-Back Guarantee policy?",
      a: "Every new subscription is backed by our unconditional 30-Day Money-Back Guarantee. If MarginPilot AI does not deliver actionable margin expansion or operational inventory clarity for your business, simply contact billing@marginpilot.ai within 30 days of initial purchase. Your complete refund is reviewed and processed within 15 business days guaranteed, in accordance with our transparent Refund Policy.",
    },
    {
      q: "Can I try MarginPilot AI before committing to a paid plan?",
      a: "Yes! Both Starter and Growth plans feature a fully functional 14-day free trial. You can connect your store, upload real CSV/Excel sales data, generate deep learning forecasts, and query our Gemini AI Copilot immediately with zero initial commitment.",
    },
    {
      q: "How does the Annual billing discount work?",
      a: "When you select Annual Billing, you receive an immediate 20% discount on the equivalent monthly subscription price (equivalent to getting 2.5 months completely free each year). The payment is charged once annually in your chosen local currency.",
    },
    {
      q: "Is our proprietary financial and sales data safe with MarginPilot AI?",
      a: "Absolutely. We enforce strict enterprise isolation. Your datasets are stored securely within isolated Neon PostgreSQL tenant containers with AES-256 encryption at rest and TLS 1.3 in transit. We guarantee that your private transaction records are NEVER used to train public AI models or shared across customer organizations.",
    },
    {
      q: "Do you charge extra fees for each team member seat?",
      a: "No! Unlike legacy enterprise platforms that penalize growing companies with per-seat licensing, MarginPilot AI includes generous seat allocations: Starter includes 3 seats, Growth includes 15 seats, and Enterprise includes unlimited seats. You can invite your analysts, warehouse managers, and finance officers without surprise bills.",
    },
    {
      q: "What international payment methods do you accept?",
      a: "We support Visa, Mastercard, American Express, Apple Pay, Google Pay, SEPA Direct Debit (Europe), UPI & NetBanking (India), iDEAL (Netherlands), and direct corporate bank wire transfers for Enterprise contracts. All invoices are fully tax-compliant with local GST / VAT itemization.",
    },
    {
      q: "Can I upgrade, downgrade, or cancel my subscription at any time?",
      a: "Yes. You have full self-service control inside your Workspace Settings. You can upgrade instantly to access deeper predictive algorithms or adjust your billing cycle. If you decide to cancel, your access continues smoothly through the end of your prepaid period with no cancellation penalties.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 font-sans selection:bg-blue-600 selection:text-white flex flex-col">
      <MarketingNavbar />

      {/* Hero Section */}
      <section className="relative pt-16 pb-12 px-6 max-w-7xl mx-auto w-full text-center space-y-6">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-72 bg-gradient-to-b from-blue-100/60 via-indigo-50/30 to-transparent blur-3xl pointer-events-none -z-10" />

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-semibold shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
          <span>Transparent Global Pricing • Zero Per-Seat Markups</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight max-w-4xl mx-auto leading-[1.12]">
          Predictable Pricing.{" "}
          <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 bg-clip-text text-transparent">
            Exponential Profit.
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Empower your retail, wholesale, or manufacturing enterprise with deep learning demand forecasts,
          automated profit simulators, and verified AI copilot at fair global pricing.
        </p>

        {/* Currency & Exchange Rate Bar */}
        <div className="pt-2 max-w-3xl mx-auto">
          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
              <Globe2 className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Currency &amp; Country:</span>
            </div>

            {/* Quick Country Flag Chips */}
            <div className="flex items-center gap-1.5 flex-wrap justify-center">
              {COUNTRIES.slice(0, 6).map((c) => (
                <button
                  key={c.code}
                  onClick={() => setSelectedCurrency(c)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    selectedCurrency.code === c.code
                      ? "bg-blue-600 text-white shadow-sm ring-2 ring-blue-600/20"
                      : "bg-slate-100/80 border border-slate-200 text-slate-700 hover:bg-slate-200/60"
                  }`}
                >
                  <span>{c.flag}</span>
                  <span>{c.code}</span>
                </button>
              ))}

              {/* Full Dropdown for all 12 countries */}
              <div className="relative">
                <select
                  value={selectedCurrency.code}
                  onChange={(e) => {
                    const match = COUNTRIES.find((c) => c.code === e.target.value);
                    if (match) setSelectedCurrency(match);
                  }}
                  className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-full text-xs font-semibold text-slate-800 shadow-xs focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  {COUNTRIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.flag} {c.country} ({c.code} - {c.symbol.trim()})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Parity Transparency Caption */}
          <div className="mt-2.5 flex items-center justify-center gap-2 text-[11px] text-slate-500">
            <BadgeCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>
              <strong>Global Price Parity:</strong> 1 USD = {selectedCurrency.exchangeRate.toFixed(2)} {selectedCurrency.code} • Fair purchasing terms pegged to real-time market exchange rates.
            </span>
          </div>
        </div>

        {/* Billing Cycle Switcher */}
        <div className="pt-4 flex items-center justify-center">
          <div className="bg-white border border-slate-200 p-1 rounded-full shadow-xs inline-flex items-center gap-1">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${
                billingCycle === "monthly"
                  ? "bg-slate-900 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingCycle("annual")}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${
                billingCycle === "annual"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <span>Annual Billing</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-extrabold uppercase tracking-wide">
                Save 20%
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Pricing Cards Grid */}
      <section className="pb-20 px-6 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan) => {
            const priceFormatted = getPrice(plan.usdMonthly, plan.usdAnnual);
            const annualBilled = getAnnualBilledSummary(plan.usdAnnual);

            return (
              <div
                key={plan.id}
                className={`rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 relative ${
                  plan.highlighted
                    ? "bg-white border-2 border-blue-600 shadow-2xl ring-4 ring-blue-500/10 lg:-translate-y-2 z-10"
                    : "bg-white border border-slate-200/90 shadow-md hover:shadow-xl hover:-translate-y-1"
                }`}
              >
                {/* Popular Badge */}
                {plan.highlighted && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider shadow-md flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-amber-300" />
                    <span>Most Popular &amp; Best Value</span>
                  </div>
                )}

                <div>
                  {/* Card Header */}
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">{plan.name}</h3>
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${plan.tierBadgeColor}`}>
                      {plan.badge}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 min-h-[44px] leading-relaxed">
                    {plan.tagline}
                  </p>

                  {/* Price Box */}
                  <div className="my-6 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="flex items-baseline gap-1.5 flex-wrap">
                      <span className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
                        {priceFormatted}
                      </span>
                      <span className="text-slate-500 text-xs font-semibold">/ month</span>
                    </div>

                    <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                      <span className="text-slate-500 font-medium">
                        {billingCycle === "annual" ? `Billed annually (${annualBilled}/yr)` : "Billed monthly"}
                      </span>
                      <span className="font-bold text-blue-600">
                        {selectedCurrency.flag} {selectedCurrency.code}
                      </span>
                    </div>

                    {/* Generous Entitlements Strip */}
                    <div className="mt-3 pt-2.5 border-t border-slate-200/60 grid grid-cols-2 gap-2 text-[11px]">
                      <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
                        <Users className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span>{plan.seats}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
                        <Zap className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span>{plan.volume}</span>
                      </div>
                    </div>
                  </div>

                  {/* Features List */}
                  <div className="space-y-3.5 pb-8">
                    <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                      Core Capabilities Included:
                    </span>
                    <ul className="space-y-2.5 text-xs text-slate-700">
                      {plan.features.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span className={feat.startsWith("Everything in") ? "font-bold text-blue-700" : ""}>
                            {feat}
                          </span>
                        </li>
                      ))}
                    </ul>

                    {plan.notIncluded.length > 0 && (
                      <div className="pt-3 border-t border-slate-100">
                        <ul className="space-y-2 text-xs text-slate-400">
                          {plan.notIncluded.map((feat, idx) => (
                            <li key={idx} className="flex items-start gap-2.5 line-through">
                              <Minus className="w-3.5 h-3.5 text-slate-300 shrink-0 mt-0.5" />
                              <span>{feat}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card CTA */}
                <div className="pt-4 border-t border-slate-100">
                  <Link
                    href={plan.href}
                    className={`w-full py-3.5 rounded-xl font-bold text-xs text-center transition-all flex items-center justify-center gap-2 group ${
                      plan.highlighted
                        ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30"
                        : plan.id === "enterprise"
                        ? "bg-slate-900 hover:bg-black text-white shadow-md"
                        : "bg-slate-100 hover:bg-slate-200 text-slate-900"
                    }`}
                  >
                    <span>{plan.cta}</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>

                  <div className="mt-2.5 text-center text-[11px] text-slate-500">
                    {plan.id === "enterprise" ? "Custom SLA & Volume Pricing" : "14-day free trial • No credit card required"}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Trust & Guarantee Banner */}
      <section className="pb-16 px-6 max-w-7xl mx-auto w-full">
        <div className="bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 rounded-3xl p-8 sm:p-10 text-white shadow-xl relative overflow-hidden">
          {/* Subtle decorative circles */}
          <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-blue-500/10 blur-2xl pointer-events-none" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {/* Guarantee 1: 30-Day Money Back */}
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                <span>30-Day Money-Back Guarantee</span>
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Test MarginPilot AI risk-free. If you don&apos;t experience immediate margin lift, request a full refund within 30 days — processed in 15 business days.
              </p>
              <Link href="/refund" className="inline-flex items-center gap-1 text-[11px] text-emerald-400 hover:text-emerald-300 font-semibold underline underline-offset-2">
                <span>Read Refund Policy</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {/* Guarantee 2: Zero AI Training */}
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-400">
                <Lock className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-white">Zero Public AI Training</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Your financial books, supplier contracts, and transaction records are isolated inside dedicated database containers and are never used to train public LLMs.
              </p>
              <span className="text-[11px] text-blue-300 font-semibold">Strict Tenant Isolation</span>
            </div>

            {/* Guarantee 3: 99.99% Uptime SLA */}
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-400">
                <Zap className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-white">99.99% Uptime SLA</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Engineered with high-availability Neon PostgreSQL serverless clusters and Upstash Redis redundancy for sub-second business insights.
              </p>
              <Link href="/status" className="inline-flex items-center gap-1 text-[11px] text-indigo-300 hover:text-indigo-200 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Check Live Status</span>
              </Link>
            </div>

            {/* Guarantee 4: Instant Parity */}
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-400">
                <Globe2 className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-white">Fair Global FX Parity</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Transparent localized pricing across 12 economies with real-time fair market exchange rates. Zero international markup.
              </p>
              <span className="text-[11px] text-amber-300 font-semibold">12 Currencies Supported</span>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Social Proof / ROI Quote */}
      <section className="pb-16 px-6 max-w-5xl mx-auto w-full">
        <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-10 shadow-sm flex flex-col md:flex-row items-center gap-8">
          <div className="shrink-0 text-center md:text-left">
            <div className="w-20 h-20 rounded-2xl overflow-hidden mx-auto md:mx-0 border-2 border-blue-600/20 shadow-md">
              <img
                src="/images/rajesh-mehta.jpg"
                alt="Rajesh Mehta"
                className="w-full h-full object-cover"
              />
            </div>
            <h5 className="font-bold text-slate-900 text-sm mt-3">Rajesh Mehta</h5>
            <p className="text-xs text-slate-500">CEO, ABC Manufacturing</p>
            <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold">
              Annual Growth Plan Customer
            </span>
          </div>

          <div className="space-y-3 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-1 text-amber-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <Award key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <p className="text-base sm:text-lg font-medium text-slate-800 italic leading-relaxed">
              &ldquo;MarginPilot AI identified ₹14.2 Lakhs in unbilled wholesale freight and negative-margin SKU bundles within our first 3 weeks. The platform paid for its entire annual subscription before our first month ended.&rdquo;
            </p>
            <div className="flex items-center justify-center md:justify-start gap-6 pt-2 text-xs font-bold text-slate-600">
              <span className="text-emerald-600">✓ +30% Net Profitability</span>
              <span className="text-blue-600">✓ -40% Stock Waste</span>
              <span className="text-indigo-600">✓ 18-Day Full ROI Payback</span>
            </div>
          </div>
        </div>
      </section>

      {/* Comprehensive Feature Comparison Matrix */}
      <section className="py-16 px-6 max-w-7xl mx-auto w-full border-t border-slate-200">
        <div className="text-center space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-semibold">
            <Layers className="w-3.5 h-3.5 text-blue-600" />
            <span>Side-by-Side Deep Dive</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Compare All Features &amp; Technical Capabilities
          </h2>
          <p className="text-sm text-slate-600 max-w-2xl mx-auto">
            Detailed breakdown of algorithms, data infrastructure, compliance levels, and customer support across each tier.
          </p>
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto bg-white border border-slate-200 rounded-3xl shadow-sm">
          <table className="w-full text-left border-collapse min-w-[760px]">
            {/* Sticky Table Header */}
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/90 text-xs font-bold uppercase tracking-wider text-slate-600">
                <th className="py-5 px-6 w-2/5">Capability / Specification</th>
                <th className="py-5 px-6 text-center w-1/5">
                  <div className="font-extrabold text-slate-900 text-sm">Starter</div>
                  <div className="text-[11px] text-slate-500 font-normal">{getPrice(199, 159)}/mo</div>
                </th>
                <th className="py-5 px-6 text-center w-1/5 bg-blue-50/60 border-x border-blue-100">
                  <div className="font-extrabold text-blue-700 text-sm flex items-center justify-center gap-1">
                    <span>Growth</span>
                    <Sparkles className="w-3 h-3 text-amber-500" />
                  </div>
                  <div className="text-[11px] text-blue-600 font-normal">{getPrice(499, 399)}/mo</div>
                </th>
                <th className="py-5 px-6 text-center w-1/5">
                  <div className="font-extrabold text-slate-900 text-sm">Enterprise</div>
                  <div className="text-[11px] text-slate-500 font-normal">{getPrice(1299, 1099)}/mo</div>
                </th>
              </tr>
            </thead>

            {/* Grouped Rows by Category */}
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {comparisonCategories.map((group, gIdx) => (
                <React.Fragment key={gIdx}>
                  {/* Category Section Header */}
                  <tr className="bg-slate-100/70 border-y border-slate-200/80">
                    <td colSpan={4} className="py-3 px-6 font-black text-slate-900 uppercase tracking-wider text-[11px]">
                      <div className="flex items-center gap-2">
                        <group.icon className="w-4 h-4 text-blue-600" />
                        <span>{group.category}</span>
                      </div>
                    </td>
                  </tr>

                  {/* Category Rows */}
                  {group.rows.map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-6">
                        <div className="font-bold text-slate-900 text-xs">{row.name}</div>
                        {row.note && <div className="text-[11px] text-slate-500 mt-0.5">{row.note}</div>}
                      </td>

                      {/* Starter Column */}
                      <td className="py-3.5 px-6 text-center">
                        {row.starter === true ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" />
                        ) : row.starter === false ? (
                          <span className="text-slate-300 font-bold">—</span>
                        ) : (
                          <span className="font-bold text-slate-700">{row.starter}</span>
                        )}
                      </td>

                      {/* Growth Column (Highlighted) */}
                      <td className="py-3.5 px-6 text-center bg-blue-50/30 border-x border-blue-100">
                        {row.growth === true ? (
                          <CheckCircle2 className="w-4 h-4 text-blue-600 mx-auto" />
                        ) : row.growth === false ? (
                          <span className="text-slate-300 font-bold">—</span>
                        ) : (
                          <span className="font-bold text-blue-700">{row.growth}</span>
                        )}
                      </td>

                      {/* Enterprise Column */}
                      <td className="py-3.5 px-6 text-center">
                        {row.enterprise === true ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" />
                        ) : row.enterprise === false ? (
                          <span className="text-slate-300 font-bold">—</span>
                        ) : (
                          <span className="font-bold text-slate-900">{row.enterprise}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>

            {/* Table Footer with CTAs */}
            <tfoot>
              <tr className="border-t border-slate-200 bg-slate-50/50">
                <td className="py-5 px-6 text-xs text-slate-500">
                  Need a custom contract or tailored data connector?
                </td>
                <td className="py-5 px-6 text-center">
                  <Link
                    href={`/register?plan=starter&currency=${selectedCurrency.code}`}
                    className="px-4 py-2 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-900 text-xs font-bold inline-block transition-colors"
                  >
                    Select Starter
                  </Link>
                </td>
                <td className="py-5 px-6 text-center bg-blue-50/60 border-x border-blue-100">
                  <Link
                    href={`/register?plan=growth&currency=${selectedCurrency.code}`}
                    className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold inline-block shadow-sm transition-colors"
                  >
                    Select Growth
                  </Link>
                </td>
                <td className="py-5 px-6 text-center">
                  <Link
                    href={`/contact?type=enterprise&currency=${selectedCurrency.code}`}
                    className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-black text-white text-xs font-bold inline-block transition-colors"
                  >
                    Contact Enterprise
                  </Link>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </section>

      {/* Interactive FAQ Section */}
      <section className="py-16 px-6 max-w-4xl mx-auto w-full border-t border-slate-200">
        <div className="text-center space-y-3 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">
            <Info className="w-3.5 h-3.5" />
            <span>Got Questions? We Have Answers</span>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Everything you need to know about global currency parity, our 30-day guarantee, and team access.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="border border-slate-200 rounded-2xl overflow-hidden transition-all bg-white shadow-xs"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-5 text-left flex items-center justify-between text-sm font-bold text-slate-900 hover:text-blue-600 transition-colors gap-4"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-blue-600 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Pre-Footer Enterprise Strip */}
      <section className="bg-slate-900 text-white py-16 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-semibold">
              <Building2 className="w-3.5 h-3.5 text-blue-400" />
              <span>Tailored Enterprise Solutions</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Need custom ERP pipelines or multi-currency corporate invoicing?
            </h3>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              We provide localized tax-compliant corporate invoicing (GST in India, VAT in Europe &amp; UK, Sales Tax in US) with dedicated solution architects and custom SLA agreements.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <Link
              href={`/contact?type=enterprise&currency=${selectedCurrency.code}`}
              className="w-full sm:w-auto px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2"
            >
              <span>Speak with Solutions Architect</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href={`/register?plan=growth&currency=${selectedCurrency.code}`}
              className="w-full sm:w-auto px-6 py-3.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl transition-colors text-center"
            >
              Start 14-Day Free Trial
            </Link>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
