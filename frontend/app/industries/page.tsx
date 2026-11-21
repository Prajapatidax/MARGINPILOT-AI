"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Store,
  Factory,
  Building,
  Truck,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  BarChart3,
  Layers,
  Sparkles,
  Clock,
  ShieldAlert,
} from "lucide-react";
import MarketingNavbar from "@/components/layout/MarketingNavbar";
import MarketingFooter from "@/components/layout/MarketingFooter";

export default function IndustriesPage() {
  const [selectedIndustry, setSelectedIndustry] = useState<"retail" | "manufacturing" | "wholesale" | "distribution">("retail");

  const industries = {
    retail: {
      title: "Retail & Multi-Store Commerce",
      badge: "Retail Intelligence",
      tagline: "Turn POS data into higher store margins and zero stockouts",
      icon: Store,
      color: "text-blue-600 bg-blue-50 border-blue-200",
      description:
        "Modern retail requires balancing online and offline channels, dynamic price promotions, and rapid inventory turns. MarginPilot AI integrates with your point-of-sale and eCommerce transaction logs to pinpoint unprofitable SKUs and retain high-value shoppers.",
      keyCapabilities: [
        {
          title: "POS & Channel Reconciliation",
          desc: "Compare gross profit, average transaction value, and basket size across brick-and-mortar stores and digital storefronts.",
        },
        {
          title: "Markdown & Promotion Elasticity",
          desc: "Measure the true incremental margin of discounts. Eliminate promotions that cannibalize full-price sales.",
        },
        {
          title: "Shopper RFM Segmentation",
          desc: "Segment customers into VIPs, regulars, and lapsing buyers. Trigger automated retention offers before churn.",
        },
        {
          title: "Return & Shrinkage Analytics",
          desc: "Isolate high-return categories, supplier defect batches, and register-level cash register discrepancies.",
        },
      ],
      caseStudy: {
        metric: "+24.8%",
        label: "Gross Profit Margin Improvement",
        quote:
          "MarginPilot AI identified three promotional discounts that were eating 14% of our margin. Adjusting the pricing tiers generated $42,000 in additional net profit in our first quarter.",
        author: "Sarah Lin",
        role: "VP of Merchandising, Apex Fashion Retail",
      },
    },
    manufacturing: {
      title: "Discrete & Process Manufacturing",
      badge: "Manufacturing Intelligence",
      tagline: "Unify Bill of Materials (BOM), batch scheduling, and defect minimization",
      icon: Factory,
      color: "text-indigo-600 bg-indigo-50 border-indigo-200",
      description:
        "Manufacturing profitability depends on tight synchronization between raw material procurement, assembly line capacity, and scrap reduction. MarginPilot AI models multi-level BOMs and predicts raw material lead-time spikes before production stalls.",
      keyCapabilities: [
        {
          title: "Multi-Level BOM Cost Rollups",
          desc: "Instantly calculate the true production cost of finished goods when component vendor prices fluctuate.",
        },
        {
          title: "Batch Yield & Scrap Tracking",
          desc: "Identify machine lines and shifts producing out-of-spec batches with automated anomaly detection.",
        },
        {
          title: "Predictive Raw Material Procurement",
          desc: "Forecast component demand 60-90 days out, taking vendor lead times and transit volatility into account.",
        },
        {
          title: "Machine Sensor & Telemetry Anomaly",
          desc: "Spot subtle temperature and vibration drifts that precede equipment downtime or precision errors.",
        },
      ],
      caseStudy: {
        metric: "-31.5%",
        label: "Scrap & Defect Cost Reduction",
        quote:
          "The autoencoder anomaly detector spotted calibration drift in stamping machine 4 two weeks before catastrophic failure. Saved us hundreds of thousands in warranty claims.",
        author: "Marcus Vance",
        role: "Director of Operations, Precision Engineered Parts",
      },
    },
    wholesale: {
      title: "Wholesale & B2B Trading",
      badge: "Wholesale Intelligence",
      tagline: "Maximize margin on high-volume contract orders and protect credit limits",
      icon: Building,
      color: "text-purple-600 bg-purple-50 border-purple-200",
      description:
        "Wholesalers operate on razor-thin margins where a 1% price miscalculation on bulk volume erodes annual profit. MarginPilot AI equips B2B sales teams with real-time margin simulators to negotiate profitable contracts without losing deals.",
      keyCapabilities: [
        {
          title: "Bulk Tier Pricing Simulator",
          desc: "Model quantity break discounts against freight surcharges and supplier rebate tiers before sending quotes.",
        },
        {
          title: "Customer Credit & Default Risk",
          desc: "Continually evaluate account payment cadence. Detect slowing accounts receivable before credit limits are breached.",
        },
        {
          title: "Rebate & Surcharge Protection",
          desc: "Track vendor milestone rebates and ensure customer contract minimums are satisfied prior to quarter close.",
        },
        {
          title: "Order Fill Rate Optimization",
          desc: "Prioritize inventory allocations to high-margin recurring accounts when supply constraints occur.",
        },
      ],
      caseStudy: {
        metric: "+$180K",
        label: "Annual Margin Recovered",
        quote:
          "Before MarginPilot AI, our account reps were giving standard 12% discounts without realizing logistics costs wiped out the profit. The What-If Simulator changed our entire sales playbook.",
        author: "David Morales",
        role: "Chief Commercial Officer, Global Wholesale Supplies",
      },
    },
    distribution: {
      title: "Distribution & Multi-Warehouse Logistics",
      badge: "Logistics Intelligence",
      tagline: "Streamline warehouse transfers, route deliveries, and carrier SLAs",
      icon: Truck,
      color: "text-emerald-600 bg-emerald-50 border-emerald-200",
      description:
        "Managing multi-hub distribution centers demands precise inventory balancing and carrier oversight. MarginPilot AI predicts regional demand shifts and recommends proactive inter-warehouse transfers to cut expensive split-shipments.",
      keyCapabilities: [
        {
          title: "Inter-Warehouse Stock Balancing",
          desc: "Identify localized stockouts before they occur and calculate lowest-cost transfer routes between fulfillment hubs.",
        },
        {
          title: "Carrier Lead-Time Drift",
          desc: "Detect when freight carriers begin missing delivery SLAs and dynamically reroute high-priority freight.",
        },
        {
          title: "Deadstock & Holding Cost Audit",
          desc: "Flag slow-moving pallets occupying premium pick-bin square footage with automated liquidation recommendations.",
        },
        {
          title: "Safety Stock Auto-Calibration",
          desc: "Automatically increase safety buffers ahead of port congestions and regional weather events.",
        },
      ],
      caseStudy: {
        metric: "-22.4%",
        label: "Carrying Cost Reduction",
        quote:
          "We cut split-shipments across our 4 regional distribution hubs by over 40% in two months. Our inventory turnover increased from 4.1x to 6.3x.",
        author: "Elena Rostova",
        role: "VP of Supply Chain, TransContinental Logistics",
      },
    },
  };

  const active = industries[selectedIndustry];
  const ActiveIcon = active.icon;

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-600 selection:text-white flex flex-col">
      <MarketingNavbar />

      {/* Hero */}
      <section className="pt-16 pb-12 px-6 max-w-7xl mx-auto text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold">
          <Layers className="w-3.5 h-3.5" />
          Industry Solutions
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight max-w-4xl mx-auto leading-tight">
          Configured for Your <span className="text-blue-600">Business Model</span>
        </h1>
        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          One unified data intelligence platform with industry-specific modules. Select your business type to explore tailored capabilities.
        </p>

        {/* Industry Switcher Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-4xl mx-auto pt-6">
          {(
            [
              { id: "retail", label: "Retail", icon: Store },
              { id: "manufacturing", label: "Manufacturing", icon: Factory },
              { id: "wholesale", label: "Wholesale", icon: Building },
              { id: "distribution", label: "Distribution", icon: Truck },
            ] as const
          ).map((item) => {
            const Icon = item.icon;
            const isSelected = selectedIndustry === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setSelectedIndustry(item.id)}
                className={`p-4 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                  isSelected
                    ? "border-blue-600 bg-blue-50/70 shadow-sm ring-1 ring-blue-600"
                    : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    isSelected ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <span
                    className={`text-sm font-bold block ${
                      isSelected ? "text-blue-900" : "text-slate-800"
                    }`}
                  >
                    {item.label}
                  </span>
                  <span className="text-[11px] text-slate-500 block">Configure module</span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Selected Industry Detail Section */}
      <section className="py-12 px-6 max-w-7xl mx-auto w-full">
        <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 sm:p-12 space-y-12">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-slate-200">
            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white text-slate-800 border border-slate-200 inline-block">
                {active.badge}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {active.title}
              </h2>
              <p className="text-sm font-medium text-blue-600">{active.tagline}</p>
              <p className="text-sm text-slate-600 max-w-2xl leading-relaxed pt-1">
                {active.description}
              </p>
            </div>
            <Link
              href="/register"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow transition-all flex items-center gap-2 self-start md:self-auto shrink-0"
            >
              <span>Deploy {active.badge}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Capabilities Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {active.keyCapabilities.map((cap, cIdx) => (
              <div
                key={cIdx}
                className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-2"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <h4 className="text-base font-bold text-slate-900">{cap.title}</h4>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed pl-6">{cap.desc}</p>
              </div>
            ))}
          </div>

          {/* Real Customer Case Study Quote */}
          <div className="bg-white p-8 rounded-2xl border border-blue-100 shadow-sm flex flex-col md:flex-row items-center gap-8">
            <div className="p-6 bg-blue-50/70 border border-blue-100 rounded-2xl text-center md:text-left shrink-0 min-w-[200px]">
              <span className="text-3xl sm:text-4xl font-extrabold text-blue-600 block">
                {active.caseStudy.metric}
              </span>
              <span className="text-xs font-semibold text-slate-700 mt-1 block">
                {active.caseStudy.label}
              </span>
            </div>
            <div className="space-y-3">
              <p className="text-sm text-slate-700 italic leading-relaxed">
                &ldquo;{active.caseStudy.quote}&rdquo;
              </p>
              <div>
                <span className="text-xs font-bold text-slate-900 block">
                  {active.caseStudy.author}
                </span>
                <span className="text-xs text-slate-500 block">{active.caseStudy.role}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cross-Industry Ingestion Banner */}
      <section className="pb-20 px-6 max-w-7xl mx-auto w-full">
        <div className="p-8 sm:p-12 rounded-3xl bg-slate-900 text-white flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl text-center md:text-left">
            <h3 className="text-2xl font-bold tracking-tight">Need a custom enterprise configuration?</h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              MarginPilot AI easily adapts to hybrid operations (e.g. manufacturers running wholesale distribution or direct-to-consumer retail). Configure custom column schemas and machine telemetry in minutes.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/contact"
              className="px-6 py-3 border border-slate-700 hover:bg-slate-800 text-slate-200 text-xs font-semibold rounded-xl transition-colors"
            >
              Talk with an Architect
            </Link>
            <Link
              href="/demo"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow transition-colors"
            >
              Watch Video Demo
            </Link>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
