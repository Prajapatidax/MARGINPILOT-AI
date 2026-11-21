"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Check,
  ArrowRight,
  HelpCircle,
  ShieldCheck,
  Zap,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Globe2,
  Lock,
} from "lucide-react";
import MarketingNavbar from "@/components/layout/MarketingNavbar";
import MarketingFooter from "@/components/layout/MarketingFooter";

interface CountryCurrency {
  country: string;
  code: string;
  symbol: string;
  flag: string;
  exchangeRate: number; // USD to local currency parity
  symbolPlacement: "prefix" | "suffix";
  roundTo: number; // Rounding granularity (e.g. 100 for INR/JPY)
}

const COUNTRIES: CountryCurrency[] = [
  { country: "United States", code: "USD", symbol: "$", flag: "🇺🇸", exchangeRate: 1.0, symbolPlacement: "prefix", roundTo: 1 },
  { country: "India", code: "INR", symbol: "₹", flag: "🇮🇳", exchangeRate: 83.5, symbolPlacement: "prefix", roundTo: 100 },
  { country: "European Union", code: "EUR", symbol: "€", flag: "🇪🇺", exchangeRate: 0.92, symbolPlacement: "prefix", roundTo: 1 },
  { country: "United Kingdom", code: "GBP", symbol: "£", flag: "🇬🇧", exchangeRate: 0.79, symbolPlacement: "prefix", roundTo: 1 },
  { country: "Canada", code: "CAD", symbol: "CA$", flag: "🇨🇦", exchangeRate: 1.36, symbolPlacement: "prefix", roundTo: 5 },
  { country: "Australia", code: "AUD", symbol: "A$", flag: "🇦🇺", exchangeRate: 1.52, symbolPlacement: "prefix", roundTo: 5 },
  { country: "Japan", code: "JPY", symbol: "¥", flag: "🇯🇵", exchangeRate: 155.0, symbolPlacement: "prefix", roundTo: 100 },
  { country: "Singapore", code: "SGD", symbol: "S$", flag: "🇸🇬", exchangeRate: 1.34, symbolPlacement: "prefix", roundTo: 5 },
  { country: "United Arab Emirates", code: "AED", symbol: "AED ", flag: "🇦🇪", exchangeRate: 3.67, symbolPlacement: "prefix", roundTo: 5 },
  { country: "Switzerland", code: "CHF", symbol: "CHF ", flag: "🇨🇭", exchangeRate: 0.89, symbolPlacement: "prefix", roundTo: 5 },
  { country: "Brazil", code: "BRL", symbol: "R$ ", flag: "🇧🇷", exchangeRate: 5.50, symbolPlacement: "prefix", roundTo: 5 },
  { country: "South Africa", code: "ZAR", symbol: "R ", flag: "🇿🇦", exchangeRate: 18.20, symbolPlacement: "prefix", roundTo: 10 },
];

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<"annual" | "monthly">("annual");
  const [selectedCurrency, setSelectedCurrency] = useState<CountryCurrency>(COUNTRIES[0]);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const convertPrice = (usdPrice: number) => {
    const raw = usdPrice * selectedCurrency.exchangeRate;
    const rounded = Math.round(raw / selectedCurrency.roundTo) * selectedCurrency.roundTo;
    const formattedNum = rounded.toLocaleString();
    return selectedCurrency.symbolPlacement === "prefix"
      ? `${selectedCurrency.symbol}${formattedNum}`
      : `${formattedNum} ${selectedCurrency.symbol}`;
  };

  const getAnnualTotal = (monthlyUsdPrice: number) => {
    const annualUsd = monthlyUsdPrice * 12;
    const raw = annualUsd * selectedCurrency.exchangeRate;
    const rounded = Math.round(raw / selectedCurrency.roundTo) * selectedCurrency.roundTo;
    return `${selectedCurrency.symbol}${rounded.toLocaleString()}`;
  };

  const plans = [
    {
      name: "Starter",
      badge: "Emerging Business",
      description: "Essential intelligence and profit monitoring for single-entity retailers and wholesale traders.",
      usdMonthly: 199,
      usdAnnual: 159,
      features: [
        "Up to 25,000 monthly order lines",
        "Real-Time Sales & Margin Analytics",
        "Canonical CSV / XLSX Data Ingestion",
        "Customer RFM Churn Scoring",
        "30-day single-horizon demand forecast",
        "3 Team member seats",
        "Community & Email Support (24h SLA)",
      ],
      cta: "Start 14-Day Free Trial",
      href: `/register?plan=starter&currency=${selectedCurrency.code}`,
      highlighted: false,
    },
    {
      name: "Growth",
      badge: "Most Popular",
      description: "Complete AI operating system with PyTorch deep learning, XGBoost, and Gemini AI Copilot.",
      usdMonthly: 499,
      usdAnnual: 399,
      features: [
        "Up to 250,000 monthly order lines",
        "Everything in Starter, plus:",
        "Deep Learning LSTM Demand Forecasting (90-day)",
        "XGBoost Churn with SHAP Explainability",
        "AI Copilot with Verified SQL Grounding",
        "What-If Business Scenario Simulator",
        "Isolation Forest Anomaly & Fraud Detection",
        "Supplier Lead-Time & Reliability Scoring",
        "Upstash Redis Accelerated Caching",
        "15 Team member seats",
        "Priority Support (4h SLA)",
      ],
      cta: "Start 14-Day Free Trial",
      href: `/register?plan=growth&currency=${selectedCurrency.code}`,
      highlighted: true,
    },
    {
      name: "Enterprise",
      badge: "Scale & High Volume",
      description: "Dedicated serverless database branches, custom ML fine-tuning, and dedicated architect support.",
      usdMonthly: 1299,
      usdAnnual: 1099,
      features: [
        "Unlimited monthly order lines",
        "Everything in Growth, plus:",
        "Dedicated Neon PostgreSQL database branch",
        "Custom ERP & Warehouse WMS Connectors",
        "Proprietary deep learning model fine-tuning",
        "Row-Level Security & custom RBAC roles",
        "Unlimited team member seats",
        "99.99% Uptime Service Level Agreement (SLA)",
        "Dedicated Data Architect & Onboarding Engineer",
        "SOC 2 Type II & HIPAA Compliance package",
      ],
      cta: "Contact Enterprise Sales",
      href: `/contact?type=enterprise&currency=${selectedCurrency.code}`,
      highlighted: false,
    },
  ];

  const comparisonRows = [
    { category: "Analytics & Financials", name: "Real-time Gross Profit & Net Margin", starter: true, growth: true, enterprise: true },
    { category: "Analytics & Financials", name: "Dynamic Period Comparisons (PoP, YoY)", starter: true, growth: true, enterprise: true },
    { category: "Analytics & Financials", name: "Category & Warehouse Drilldowns", starter: true, growth: true, enterprise: true },
    { category: "Machine Learning & AI", name: "Customer RFM Churn Scoring", starter: true, growth: true, enterprise: true },
    { category: "Machine Learning & AI", name: "XGBoost + SHAP Explainability", starter: false, growth: true, enterprise: true },
    { category: "Machine Learning & AI", name: "PyTorch LSTM Demand Forecasting", starter: "30 Days", growth: "90 Days", enterprise: "365 Days" },
    { category: "Machine Learning & AI", name: "Operational Anomaly & Fraud Engine", starter: false, growth: true, enterprise: true },
    { category: "Decision Automation", name: "AI Copilot with Verified SQL RAG", starter: false, growth: true, enterprise: true },
    { category: "Decision Automation", name: "What-If Scenario Simulator", starter: false, growth: true, enterprise: true },
    { category: "Decision Automation", name: "Automated Reorder Recommendations", starter: "Basic", growth: "Dynamic EOQ", enterprise: "Multi-Hub" },
    { category: "Data & Infrastructure", name: "Serverless Database", starter: "Neon Shared", growth: "Neon Shared", enterprise: "Dedicated Branch" },
    { category: "Data & Infrastructure", name: "Redis Caching Layer", starter: "Standard", growth: "Upstash TLS", enterprise: "Upstash Cluster" },
    { category: "Data & Infrastructure", name: "Document & Report Storage", starter: "Neon Bucket", growth: "Neon Bucket", enterprise: "Dedicated S3" },
    { category: "Security & Governance", name: "Organization Tenant Isolation", starter: true, growth: true, enterprise: true },
    { category: "Security & Governance", name: "Audit Logging & Rollback", starter: "7 Days", growth: "90 Days", enterprise: "Unlimited" },
    { category: "Security & Governance", name: "99.99% High Availability SLA", starter: false, growth: false, enterprise: true },
  ];

  const faqs = [
    {
      q: "Is pricing the same in every country?",
      a: "Yes. MarginPilot AI implements strict Global Price Parity. Subscription fees in every country and currency are calculated directly from fair market foreign exchange rates with zero geographic penalties or regional markups.",
    },
    {
      q: "Can I try MarginPilot AI before committing?",
      a: "Yes. All Starter and Growth plans include a 14-day fully featured free trial. No credit card is required to sign up and begin uploading your datasets.",
    },
    {
      q: "How does the annual discount work?",
      a: "When you choose Annual billing, you save 20% on the monthly subscription price. The plan is billed as a single annual payment in your selected currency.",
    },
    {
      q: "Is our proprietary company data used to train public AI models?",
      a: "Never. Your datasets are stored strictly inside your organization workspace with Neon PostgreSQL database isolation. Gemini AI is queried solely via zero-retention semantic RAG, and custom machine learning models are trained exclusively on your private organization records.",
    },
    {
      q: "What payment methods are supported internationally?",
      a: "We support Visa, Mastercard, American Express, SEPA Direct Debit (Europe), UPI & NetBanking (India), iDEAL (Netherlands), and wire transfers for Enterprise customers.",
    },
    {
      q: "Can we add team members without paying per seat?",
      a: "Yes! MarginPilot AI does not charge per-seat fees. Each plan includes generous team member allocations (3 for Starter, 15 for Growth, and unlimited for Enterprise) so your entire operations, finance, and management teams can collaborate.",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-600 selection:text-white flex flex-col">
      <MarketingNavbar />

      {/* Hero */}
      <section className="pt-16 pb-10 px-6 max-w-7xl mx-auto text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold">
          <Zap className="w-3.5 h-3.5" />
          Global Pricing &amp; Price Parity
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight max-w-3xl mx-auto leading-tight">
          Invest in <span className="text-blue-600">Predictable Profit</span>
        </h1>
        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Identical economic pricing in every major country. Zero hidden markups. Full access to machine learning models, decision simulation, and verified financial intelligence.
        </p>

        {/* Global Price Parity Notice Banner */}
        <div className="max-w-2xl mx-auto p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-center gap-2.5 text-xs text-slate-600">
          <Globe2 className="w-4 h-4 text-blue-600 shrink-0" />
          <span>
            <strong>Global Price Parity Guarantee:</strong> In every country, pricing is pegged strictly to real-time market exchange rates with equal purchasing terms worldwide.
          </span>
        </div>

        {/* Country & Currency Selector Bar */}
        <div className="pt-2 max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Select Your Country / Currency:
            </span>

            {/* Quick Country Pills */}
            <div className="flex items-center gap-1.5 flex-wrap justify-center">
              {COUNTRIES.slice(0, 6).map((c) => (
                <button
                  key={c.code}
                  onClick={() => setSelectedCurrency(c)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    selectedCurrency.code === c.code
                      ? "bg-blue-600 text-white shadow-sm ring-2 ring-blue-600/30"
                      : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <span>{c.flag}</span>
                  <span>{c.code}</span>
                </button>
              ))}

              {/* Full Dropdown for all 12 major countries */}
              <select
                value={selectedCurrency.code}
                onChange={(e) => {
                  const match = COUNTRIES.find((c) => c.code === e.target.value);
                  if (match) setSelectedCurrency(match);
                }}
                className="px-3 py-1.5 bg-white border border-slate-200 rounded-full text-xs font-semibold text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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

        {/* Annual / Monthly Toggle */}
        <div className="flex items-center justify-center gap-4 pt-4">
          <span
            className={`text-sm font-semibold cursor-pointer ${
              billingCycle === "monthly" ? "text-slate-900" : "text-slate-500"
            }`}
            onClick={() => setBillingCycle("monthly")}
          >
            Monthly Billing
          </span>
          <button
            onClick={() => setBillingCycle(billingCycle === "annual" ? "monthly" : "annual")}
            className="w-14 h-8 bg-slate-200 rounded-full p-1 relative transition-colors focus:outline-none"
            aria-label="Toggle annual billing"
          >
            <div
              className={`w-6 h-6 rounded-full bg-blue-600 shadow-md transition-transform ${
                billingCycle === "annual" ? "translate-x-6" : "translate-x-0"
              }`}
            />
          </button>
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setBillingCycle("annual")}>
            <span
              className={`text-sm font-semibold ${
                billingCycle === "annual" ? "text-slate-900" : "text-slate-500"
              }`}
            >
              Annual Billing
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold border border-emerald-200">
              Save 20%
            </span>
          </div>
        </div>
      </section>

      {/* Pricing Cards with Exact Country Parity */}
      <section className="pb-20 px-6 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan) => {
            const usdVal = billingCycle === "annual" ? plan.usdAnnual : plan.usdMonthly;
            const priceFormatted = convertPrice(usdVal);
            const annualBilledText = getAnnualTotal(plan.usdAnnual);

            return (
              <div
                key={plan.name}
                className={`rounded-3xl p-8 flex flex-col justify-between transition-all ${
                  plan.highlighted
                    ? "bg-white border-2 border-blue-600 shadow-xl relative ring-4 ring-blue-50"
                    : "bg-white border border-slate-200 shadow-sm hover:shadow-md"
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow">
                    Most Popular Choice
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-bold text-slate-900">{plan.name}</h3>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                      {plan.badge}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 min-h-[36px]">{plan.description}</p>

                  <div className="my-6 pb-6 border-b border-slate-100">
                    <div className="flex items-baseline gap-1.5 flex-wrap">
                      <span className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
                        {priceFormatted}
                      </span>
                      <span className="text-slate-500 text-sm font-medium">/ month</span>
                    </div>
                    <span className="text-[11px] text-slate-400 mt-1 block">
                      {billingCycle === "annual"
                        ? `Billed annually (${annualBilledText}/yr)`
                        : "Billed monthly"}
                    </span>
                    <span className="text-[10px] text-blue-600 font-semibold mt-0.5 block">
                      {selectedCurrency.flag} {selectedCurrency.country} ({selectedCurrency.code})
                    </span>
                  </div>

                  <div className="space-y-3 pb-8">
                    <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                      What&apos;s included:
                    </span>
                    <ul className="space-y-2.5 text-xs text-slate-600">
                      {plan.features.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2.5">
                          <Check className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <Link
                  href={plan.href}
                  className={`w-full py-3.5 rounded-xl font-semibold text-xs text-center transition-all flex items-center justify-center gap-2 ${
                    plan.highlighted
                      ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-800"
                  }`}
                >
                  <span>{plan.cta}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* Feature Comparison Matrix */}
      <section className="py-16 px-6 max-w-7xl mx-auto w-full border-t border-slate-200">
        <div className="text-center space-y-3 mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Compare Plans &amp; Capabilities</h2>
          <p className="text-sm text-slate-500 max-w-xl mx-auto">
            Detailed breakdown of algorithms, data infrastructure, and service levels across each tier.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[650px]">
            <thead>
              <tr className="border-b border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-500">
                <th className="py-4 px-4 w-1/2">Capability</th>
                <th className="py-4 px-4 text-center">Starter</th>
                <th className="py-4 px-4 text-center text-blue-600">Growth</th>
                <th className="py-4 px-4 text-center">Enterprise</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {comparisonRows.map((row, rIdx) => (
                <tr key={rIdx} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-4 font-medium text-slate-900">{row.name}</td>
                  <td className="py-3 px-4 text-center">
                    {row.starter === true ? (
                      <Check className="w-4 h-4 text-emerald-600 mx-auto" />
                    ) : row.starter === false ? (
                      <span className="text-slate-300">—</span>
                    ) : (
                      <span className="font-semibold text-slate-700">{row.starter}</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center bg-blue-50/30">
                    {row.growth === true ? (
                      <Check className="w-4 h-4 text-blue-600 mx-auto" />
                    ) : row.growth === false ? (
                      <span className="text-slate-300">—</span>
                    ) : (
                      <span className="font-semibold text-blue-700">{row.growth}</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {row.enterprise === true ? (
                      <Check className="w-4 h-4 text-emerald-600 mx-auto" />
                    ) : row.enterprise === false ? (
                      <span className="text-slate-300">—</span>
                    ) : (
                      <span className="font-semibold text-slate-900">{row.enterprise}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-6 max-w-4xl mx-auto w-full border-t border-slate-200">
        <div className="text-center space-y-2 mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Frequently Asked Questions</h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Have questions about country pricing, global currency parity, or billing cycles?
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="border border-slate-200 rounded-2xl overflow-hidden transition-all bg-white"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-5 text-left flex items-center justify-between text-sm font-bold text-slate-900 hover:text-blue-600 transition-colors"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
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

      {/* Enterprise Custom Banner */}
      <section className="bg-slate-900 text-white py-14 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="space-y-1">
            <h3 className="text-xl font-bold tracking-tight">Need local currency invoicing or corporate purchase orders?</h3>
            <p className="text-slate-400 text-xs">
              We provide localized tax-compliant invoices (GST in India, VAT in Europe &amp; UK) with local bank wire settlement options.
            </p>
          </div>
          <Link
            href={`/contact?type=enterprise&currency=${selectedCurrency.code}`}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow transition-colors flex items-center gap-2 shrink-0"
          >
            <span>Speak with Solutions Team</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
