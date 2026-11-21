"use client";

import React from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Lock,
  Database,
  KeyRound,
  FileCheck2,
  Server,
  Cpu,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import MarketingNavbar from "@/components/layout/MarketingNavbar";
import MarketingFooter from "@/components/layout/MarketingFooter";

export default function SecurityPage() {
  const securityPillars = [
    {
      title: "Neon PostgreSQL Row-Level Security (RLS)",
      icon: Database,
      desc: "Every database query executes within an authenticated transaction that binds the session to the tenant's cryptographic organization_id. No data can leak across tenant boundaries.",
    },
    {
      title: "Zero Model Training on Customer Data",
      icon: Cpu,
      desc: "We enforce strict zero-retention enterprise agreements with Google AI. Your operational records, margins, and customer data are never retained or used to train public LLMs.",
    },
    {
      title: "End-to-End TLS 1.3 & AES-256 Storage",
      icon: Lock,
      desc: "All network traffic in transit is secured with TLS 1.3. Business spreadsheets and PDF reports uploaded to Neon S3 buckets are encrypted with AES-256 and served via expiring presigned URLs.",
    },
    {
      title: "Argon2id Password Hashing & JWT RBAC",
      icon: KeyRound,
      desc: "User credentials are encrypted using memory-hard Argon2id algorithms. Fine-grained Role-Based Access Control governs exactly what Managers, Analysts, and Staff can view or mutate.",
    },
    {
      title: "Upstash Serverless Redis Encryption",
      icon: Server,
      desc: "Analytical caches and background job states are transmitted over secure TLS (rediss://) with automated TTL expiration, eliminating orphaned session data.",
    },
    {
      title: "Auditable Governance & Immutability",
      icon: FileCheck2,
      desc: "All data imports, model training triggers, user role modifications, and simulation runs are permanently recorded in append-only audit event logs with actor attribution.",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-600 selection:text-white flex flex-col">
      <MarketingNavbar />

      {/* Hero */}
      <section className="pt-16 pb-12 px-6 max-w-5xl mx-auto text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" />
          Enterprise Trust &amp; Security
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Enterprise-Grade Security by Design
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
          MarginPilot AI is built for mission-critical enterprise environments. We protect your most sensitive financial numbers, supplier contracts, and pricing secrets with institutional rigor.
        </p>
      </section>

      {/* Security Pillars */}
      <section className="py-12 px-6 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {securityPillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="bg-white p-7 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow space-y-3"
              >
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900">{pillar.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{pillar.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Compliance & Audit Section */}
      <section className="py-14 px-6 max-w-5xl mx-auto w-full border-t border-slate-200">
        <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 sm:p-12 space-y-8">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-slate-900">Compliance &amp; Certifications</h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Our multi-tenant architecture and security operations are aligned with top industry standards.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2">
              <span className="font-bold text-slate-900 text-sm block">SOC 2 Type II Aligned</span>
              <p className="text-slate-600">
                Independent assessment of Security, Availability, and Confidentiality controls.
              </p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2">
              <span className="font-bold text-slate-900 text-sm block">GDPR &amp; CCPA Compliant</span>
              <p className="text-slate-600">
                Full data residency compliance, automated data export, and 30-day right to erasure.
              </p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2">
              <span className="font-bold text-slate-900 text-sm block">HIPAA Readiness</span>
              <p className="text-slate-600">
                Dedicated Neon PostgreSQL branches with Business Associate Agreements (BAAs) available.
              </p>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200">
            <p className="text-xs text-slate-500">
              Need a copy of our security whitepaper or vendor compliance packet?
            </p>
            <Link
              href="/contact?type=security"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow transition-colors flex items-center gap-1.5"
            >
              <span>Request Security Packet</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
