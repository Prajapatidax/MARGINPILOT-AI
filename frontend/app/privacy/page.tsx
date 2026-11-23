"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, Lock, FileText, CheckCircle2, AlertCircle } from "lucide-react";
import MarketingNavbar from "@/components/layout/MarketingNavbar";
import MarketingFooter from "@/components/layout/MarketingFooter";

export default function PrivacyPolicyPage() {
  const lastUpdated = "November 21, 2026";

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-600 selection:text-white flex flex-col">
      <MarketingNavbar />

      {/* Header */}
      <section className="bg-slate-50 border-b border-slate-200 py-12 px-6">
        <div className="max-w-4xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            Legal &amp; Trust
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Last Updated: {lastUpdated} • Version 2.4 (Enterprise Multi-Tenant Standard)
          </p>
        </div>
      </section>

      {/* Main Legal Content */}
      <section className="py-12 px-6 max-w-4xl mx-auto w-full flex-1">
        <div className="prose prose-slate max-w-none space-y-8 text-xs sm:text-sm text-slate-700 leading-relaxed">
          {/* Key Principle Box */}
          <div className="p-6 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-2">
            <div className="flex items-center gap-2 text-blue-900 font-bold text-sm">
              <Lock className="w-4 h-4 text-blue-600" />
              <span>Core Privacy Commitment: Zero Public Model Training</span>
            </div>
            <p className="text-xs text-blue-950">
              MarginPilot AI does NOT use your proprietary sales orders, margins, invoices, or customer databases to train public or foundational artificial intelligence models. Your data is isolated per-tenant and remains your sole intellectual property.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-2">
              1. Information We Collect
            </h2>
            <p>
              When operating MarginPilot AI, we collect and process information solely to provide our business intelligence, machine learning forecasting, and decision automation services:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600">
              <li>
                <strong>Account Credentials:</strong> Full name, verified email address, organization membership roles, and Argon2-hashed passwords.
              </li>
              <li>
                <strong>Business Ingestion Data:</strong> Sales orders, SKU definitions, inventory balances, supplier lead times, invoices, and point-of-sale transaction logs uploaded via CSV, XLSX, or API.
              </li>
              <li>
                <strong>Machine Learning Artifacts:</strong> Trained model weights (XGBoost trees, PyTorch LSTM parameters, autoencoders), prediction scores, and SHAP explainability matrices.
              </li>
              <li>
                <strong>Audit &amp; System Logs:</strong> Organization session tokens, IP addresses, API access timestamps, and diagnostic error reports.
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-2">
              2. Data Isolation &amp; Architectural Multi-Tenancy
            </h2>
            <p>
              Every organization workspace operates within a strict cryptographic and logical boundary. We enforce:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600">
              <li>
                <strong>PostgreSQL Row-Level Security (RLS):</strong> Neon PostgreSQL database tables enforce strict tenant filtering on every read/write operation.
              </li>
              <li>
                <strong>Encrypted Object Storage:</strong> Raw business spreadsheets and PDF reports uploaded to Neon S3 storage buckets are stored with AES-256 server-side encryption and served exclusively through short-lived presigned URLs.
              </li>
              <li>
                <strong>Encrypted Cache:</strong> Upstash Redis instances communicate strictly over TLS 1.3 (`rediss://`) with automated expiration keys.
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-2">
              3. Artificial Intelligence &amp; LLM Data Processing
            </h2>
            <p>
              When utilizing the <strong>AI Copilot</strong> service:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600">
              <li>
                User prompts and SQL schema metadata are transmitted to Google Gemini API using enterprise API keys configured with <em>zero data retention</em> agreements.
              </li>
              <li>
                Prompts and responses are not retained by Google for service improvement or model training.
              </li>
              <li>
                All numerical metrics returned by the Copilot are mathematically verified against your organization&apos;s live database queries before display.
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-2">
              4. Data Retention &amp; Right to Erasure (GDPR &amp; CCPA)
            </h2>
            <p>
              You maintain total control over your business data:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600">
              <li>
                <strong>Data Export:</strong> Organization Owners can export all canonical transaction tables, predictions, and reports in CSV or JSON at any time.
              </li>
              <li>
                <strong>Workspace Deletion:</strong> Upon organization termination or account deletion request, all database records, trained ML models, and storage bucket files are permanently purged within 30 days.
              </li>
              <li>
                <strong>Compliance:</strong> MarginPilot AI complies with the European Union General Data Protection Regulation (GDPR) and the California Consumer Privacy Act (CCPA).
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-2">
              5. Cookie Management &amp; Related Legal Policies
            </h2>
            <p>
              MarginPilot AI provides a dedicated, interactive Cookie Declaration where you can review all storage identifiers and modify tracking consent at any time:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600">
              <li>
                <Link href="/cookies" className="text-blue-600 hover:text-blue-700 font-semibold underline">
                  Cookie Policy &amp; Declaration
                </Link>{" "}
                — Review cookie types and adjust your analytics preferences.
              </li>
              <li>
                <Link href="/refund" className="text-blue-600 hover:text-blue-700 font-semibold underline">
                  Refund &amp; Cancellation Policy
                </Link>{" "}
                — Review our 30-day money-back guarantee and 15 business days resolution SLA.
              </li>
              <li>
                <Link href="/terms" className="text-blue-600 hover:text-blue-700 font-semibold underline">
                  Terms &amp; Conditions
                </Link>{" "}
                — SaaS service agreement and license terms.
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-2">
              6. Contacting the Privacy &amp; Security Team
            </h2>
            <p>
              If you have any questions regarding this Privacy Policy, your organization data rights, or wish to execute a Data Processing Agreement (DPA), please contact our Data Protection Officer:
            </p>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1 font-mono text-slate-700">
              <p className="font-bold font-sans text-slate-900">MarginPilot AI, Inc. — Privacy &amp; Security Office</p>
              <p>GIFT City / Gandhinagar, Gujarat 382355, India</p>
              <p>Email: privacy@marginpilot.ai • dpo@marginpilot.ai</p>
            </div>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
