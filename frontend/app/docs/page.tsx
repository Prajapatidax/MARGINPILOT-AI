"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Code2,
  Database,
  Cpu,
  ShieldCheck,
  Search,
  ChevronRight,
  Terminal,
  Copy,
  Check,
  ExternalLink,
  Layers,
  Sparkles,
  Bot,
} from "lucide-react";
import MarketingNavbar from "@/components/layout/MarketingNavbar";
import MarketingFooter from "@/components/layout/MarketingFooter";

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState("quickstart");
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedSnippet(id);
    setTimeout(() => setCopiedSnippet(null), 2000);
  };

  const sections = [
    { id: "quickstart", label: "Quickstart Guide", category: "Getting Started" },
    { id: "architecture", label: "System Architecture", category: "Getting Started" },
    { id: "canonical-data", label: "Canonical Data Schema", category: "Data Ingestion" },
    { id: "column-mapping", label: "Column Mapping Engine", category: "Data Ingestion" },
    { id: "ml-churn", label: "Customer Churn (XGBoost)", category: "Machine Learning" },
    { id: "ml-forecast", label: "Demand Forecast (LSTM)", category: "Machine Learning" },
    { id: "ai-copilot", label: "AI Copilot & Semantic RAG", category: "AI & Decision Engine" },
    { id: "simulator", label: "What-If Simulator Math", category: "AI & Decision Engine" },
    { id: "api-reference", label: "REST API Reference", category: "Developer API" },
    { id: "security-rls", label: "Multi-Tenancy & Neon RLS", category: "Security" },
  ];

  const curlExample = `curl -X POST https://api.marginpilot.ai/api/v1/analytics/overview \\
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>" \\
  -H "X-Organization-Id: <ORGANIZATION_ID>" \\
  -H "Content-Type: application/json" \\
  -d '{
    "date_range": "last_30_days",
    "comparison": "previous_period"
  }'`;

  const pythonExample = `import requests

API_URL = "https://api.marginpilot.ai/api/v1/simulator/simulate"
HEADERS = {
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "X-Organization-Id": "org_772183",
    "Content-Type": "application/json"
}

payload = {
    "scenario_type": "price_reduction",
    "percentage": 10.0,
    "product_category": "Electronics"
}

response = requests.post(API_URL, json=payload, headers=HEADERS)
simulation = response.json()

print(f"Projected Profit: {simulation['projected_profit']}")
print(f"Projected Gross Margin: {simulation['projected_gross_margin']}%")
print(f"Stockout Risk Score: {simulation['risk_level']}")`;

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-600 selection:text-white flex flex-col">
      <MarketingNavbar />

      {/* Docs Header */}
      <div className="border-b border-slate-200 bg-slate-50 py-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
              <BookOpen className="w-3.5 h-3.5" />
              Developer &amp; Operator Documentation
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              MarginPilot AI Documentation
            </h1>
            <p className="text-xs sm:text-sm text-slate-600">
              Complete guides, canonical schemas, machine learning formulas, and API references.
            </p>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search documentation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
            />
          </div>
        </div>
      </div>

      {/* Main Docs Layout */}
      <div className="max-w-7xl mx-auto px-6 py-10 w-full flex-1 grid grid-cols-1 md:grid-cols-12 gap-10">
        {/* Sidebar Nav */}
        <aside className="md:col-span-3 space-y-6">
          <div className="sticky top-28 space-y-4">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Documentation Index
            </span>
            <nav className="space-y-1">
              {sections.map((sec) => (
                <button
                  key={sec.id}
                  onClick={() => setActiveSection(sec.id)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-between transition-colors ${
                    activeSection === sec.id
                      ? "bg-blue-600 text-white font-semibold shadow-sm"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <span>{sec.label}</span>
                  {activeSection === sec.id && <ChevronRight className="w-3.5 h-3.5" />}
                </button>
              ))}
            </nav>

            <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100 space-y-2 text-xs">
              <span className="font-bold text-blue-900 block">Interactive API Docs</span>
              <p className="text-slate-600 text-[11px]">
                Explore live Swagger UI &amp; OpenAPI specifications on our backend server.
              </p>
              <a
                href="http://localhost:8000/api/v1/docs"
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 font-semibold hover:underline inline-flex items-center gap-1 text-[11px]"
              >
                <span>Open Swagger UI</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <main className="md:col-span-9 space-y-12">
          {/* Quickstart Section */}
          {activeSection === "quickstart" && (
            <article className="space-y-6">
              <div className="space-y-2 border-b border-slate-200 pb-4">
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                  Getting Started
                </span>
                <h2 className="text-2xl font-extrabold text-slate-900">Platform Quickstart</h2>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Learn how to register your organization, configure your business vertical, and upload your first business dataset in under 5 minutes.
                </p>
              </div>

              <div className="space-y-4 text-xs text-slate-700 leading-relaxed">
                <div className="p-5 rounded-2xl border border-slate-200 bg-white space-y-2">
                  <h4 className="font-bold text-sm text-slate-900">Step 1: Create Organization Workspace</h4>
                  <p>
                    Every business operates within its own cryptographic tenant boundary. When you register, MarginPilot creates an isolated organization schema inside Neon PostgreSQL with Row-Level Security (RLS) constraints.
                  </p>
                </div>

                <div className="p-5 rounded-2xl border border-slate-200 bg-white space-y-2">
                  <h4 className="font-bold text-sm text-slate-900">Step 2: Select Your Industry Vertical</h4>
                  <p>
                    Choose from Retail, Manufacturing, Wholesale, or Distribution. This activates tailored canonical tables (e.g., BOM and defect tracking for Manufacturing, or tiered pricing for Wholesale).
                  </p>
                </div>

                <div className="p-5 rounded-2xl border border-slate-200 bg-white space-y-2">
                  <h4 className="font-bold text-sm text-slate-900">Step 3: Upload Historical Data</h4>
                  <p>
                    Drag-and-drop CSV, XLSX, or JSON sales transactions. The statistical profiling engine suggests mappings to canonical fields (`total_amount`, `cost_price`, `quantity`, `order_date`).
                  </p>
                </div>

                <div className="p-5 rounded-2xl border border-slate-200 bg-white space-y-2">
                  <h4 className="font-bold text-sm text-slate-900">Step 4: Train Machine Learning Models</h4>
                  <p>
                    Once data is committed, navigate to the ML Model Center. Click Train to fit XGBoost Churn and PyTorch LSTM models on your data. View SHAP feature attribution and confidence scores.
                  </p>
                </div>
              </div>
            </article>
          )}

          {/* Architecture Section */}
          {activeSection === "architecture" && (
            <article className="space-y-6">
              <div className="space-y-2 border-b border-slate-200 pb-4">
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                  System Design
                </span>
                <h2 className="text-2xl font-extrabold text-slate-900">Enterprise Cloud Architecture</h2>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  MarginPilot AI is built as a high-performance modular monolith with strict separation of compute, caching, and storage.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-5 rounded-2xl border border-slate-200 bg-white space-y-2">
                  <span className="font-bold text-blue-600 block">Frontend (Vercel)</span>
                  <p className="text-slate-600">
                    Next.js 14 App Router with React, TypeScript, and Tailwind CSS. Responsive Recharts visualization components with sub-second TanStack query caching.
                  </p>
                </div>
                <div className="p-5 rounded-2xl border border-slate-200 bg-white space-y-2">
                  <span className="font-bold text-blue-600 block">Backend (Render / FastAPI)</span>
                  <p className="text-slate-600">
                    Python FastAPI with SQLAlchemy 2.0 and Pydantic v2. Provides asynchronous REST endpoints, JWT verification, and transaction-scoped tenant context.
                  </p>
                </div>
                <div className="p-5 rounded-2xl border border-slate-200 bg-white space-y-2">
                  <span className="font-bold text-blue-600 block">Database (Neon PostgreSQL)</span>
                  <p className="text-slate-600">
                    Serverless Postgres with native connection pooling, SSL encryption (`sslmode=require`), Row-Level Security, and pgvector embeddings.
                  </p>
                </div>
                <div className="p-5 rounded-2xl border border-slate-200 bg-white space-y-2">
                  <span className="font-bold text-blue-600 block">Cache (Upstash Redis)</span>
                  <p className="text-slate-600">
                    Serverless Redis cluster accessible via REST and TLS `rediss://`. Accelerates analytics lookups and coordinates background training jobs.
                  </p>
                </div>
              </div>
            </article>
          )}

          {/* Canonical Data Schema */}
          {activeSection === "canonical-data" && (
            <article className="space-y-6">
              <div className="space-y-2 border-b border-slate-200 pb-4">
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                  Data Ingestion
                </span>
                <h2 className="text-2xl font-extrabold text-slate-900">Canonical Business Schema</h2>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  MarginPilot translates diverse customer accounting exports into standardized relational business entities.
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
                  <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-3">Canonical Field</th>
                      <th className="p-3">Data Type</th>
                      <th className="p-3">Required</th>
                      <th className="p-3">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-600">
                    <tr>
                      <td className="p-3 font-mono font-semibold text-blue-600">order_number</td>
                      <td className="p-3">String(64)</td>
                      <td className="p-3 font-semibold text-emerald-600">Yes</td>
                      <td className="p-3">Unique invoice or transaction identifier</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono font-semibold text-blue-600">order_date</td>
                      <td className="p-3">DateTime / ISO8601</td>
                      <td className="p-3 font-semibold text-emerald-600">Yes</td>
                      <td className="p-3">Timestamp when transaction was finalized</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono font-semibold text-blue-600">total_amount</td>
                      <td className="p-3">Float / Decimal</td>
                      <td className="p-3 font-semibold text-emerald-600">Yes</td>
                      <td className="p-3">Net sales price inclusive of discounts</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono font-semibold text-blue-600">cost_amount</td>
                      <td className="p-3">Float / Decimal</td>
                      <td className="p-3 font-semibold text-amber-600">Recommended</td>
                      <td className="p-3">Cost of goods sold (COGS) for gross margin calculation</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono font-semibold text-blue-600">customer_code</td>
                      <td className="p-3">String(64)</td>
                      <td className="p-3 font-semibold text-amber-600">Recommended</td>
                      <td className="p-3">Unique customer identifier for churn prediction</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono font-semibold text-blue-600">quantity</td>
                      <td className="p-3">Integer</td>
                      <td className="p-3 font-semibold text-emerald-600">Yes</td>
                      <td className="p-3">Number of units purchased (used for demand forecast)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </article>
          )}

          {/* Machine Learning Churn */}
          {activeSection === "ml-churn" && (
            <article className="space-y-6">
              <div className="space-y-2 border-b border-slate-200 pb-4">
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                  Machine Learning
                </span>
                <h2 className="text-2xl font-extrabold text-slate-900">
                  Customer Churn &amp; SHAP Explainability
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  We use Gradient Boosted Decision Trees (XGBoost / LightGBM) calibrated with TreeSHAP to provide transparent, auditable churn predictions.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
                <span className="font-bold text-slate-900 block">Feature Engineering Pipeline:</span>
                <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
                  <li><strong>Recency:</strong> Days elapsed since customer&apos;s latest transaction.</li>
                  <li><strong>Frequency:</strong> Total completed transactions over 30, 90, and 365 days.</li>
                  <li><strong>Monetary:</strong> Cumulative spend and gross margin contribution.</li>
                  <li><strong>Cadence Drift:</strong> Ratio of latest purchase interval to historical mean interval.</li>
                  <li><strong>Return Velocity:</strong> Percentage of orders with refund requests.</li>
                </ul>
              </div>
            </article>
          )}

          {/* AI Copilot Section */}
          {activeSection === "ai-copilot" && (
            <article className="space-y-6">
              <div className="space-y-2 border-b border-slate-200 pb-4">
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                  Conversational AI
                </span>
                <h2 className="text-2xl font-extrabold text-slate-900">
                  AI Copilot with Verified SQL Grounding
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  MarginPilot AI implements a zero-hallucination semantic RAG pipeline powered by Google Gemini 2.5 Flash and pgvector.
                </p>
              </div>

              <div className="p-5 rounded-2xl border border-blue-100 bg-blue-50/50 space-y-3 text-xs text-slate-700">
                <span className="font-bold text-blue-900 block">Guardrails &amp; Safety:</span>
                <p>
                  The Copilot uses Gemini tool calling to query the organization&apos;s isolated Neon database. Queries are restricted strictly to read-only `SELECT` statements scoped with `WHERE organization_id = :tenant_id`.
                </p>
                <p>
                  Every numerical answer in the chat is accompanied by the underlying database metrics, timestamp, and SQL verification badge.
                </p>
              </div>
            </article>
          )}

          {/* REST API Reference */}
          {activeSection === "api-reference" && (
            <article className="space-y-6">
              <div className="space-y-2 border-b border-slate-200 pb-4">
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                  Developer API
                </span>
                <h2 className="text-2xl font-extrabold text-slate-900">REST API &amp; Code Samples</h2>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Seamlessly trigger simulations and fetch real-time intelligence using standard HTTP requests.
                </p>
              </div>

              {/* cURL Example */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-blue-600" />
                    cURL Request (Analytics Overview)
                  </span>
                  <button
                    onClick={() => handleCopy(curlExample, "curl")}
                    className="text-xs font-semibold text-slate-500 hover:text-blue-600 flex items-center gap-1"
                  >
                    {copiedSnippet === "curl" ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span>{copiedSnippet === "curl" ? "Copied" : "Copy"}</span>
                  </button>
                </div>
                <pre className="p-4 rounded-2xl bg-slate-900 text-slate-100 text-xs font-mono overflow-x-auto leading-relaxed">
                  {curlExample}
                </pre>
              </div>

              {/* Python Example */}
              <div className="space-y-2 pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Code2 className="w-3.5 h-3.5 text-blue-600" />
                    Python Client (What-If Simulator)
                  </span>
                  <button
                    onClick={() => handleCopy(pythonExample, "python")}
                    className="text-xs font-semibold text-slate-500 hover:text-blue-600 flex items-center gap-1"
                  >
                    {copiedSnippet === "python" ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span>{copiedSnippet === "python" ? "Copied" : "Copy"}</span>
                  </button>
                </div>
                <pre className="p-4 rounded-2xl bg-slate-900 text-slate-100 text-xs font-mono overflow-x-auto leading-relaxed">
                  {pythonExample}
                </pre>
              </div>
            </article>
          )}

          {/* Security & RLS */}
          {(activeSection === "security-rls" || activeSection === "column-mapping" || activeSection === "ml-forecast" || activeSection === "simulator") && (
            <article className="space-y-6">
              <div className="space-y-2 border-b border-slate-200 pb-4">
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                  Security &amp; Architecture
                </span>
                <h2 className="text-2xl font-extrabold text-slate-900">
                  Multi-Tenancy &amp; Data Isolation
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Every SQL query, background job, and ML training run enforces organization-level data boundaries.
                </p>
              </div>

              <div className="space-y-4 text-xs text-slate-700 leading-relaxed">
                <div className="p-5 rounded-2xl border border-slate-200 bg-white space-y-2">
                  <div className="flex items-center gap-2 text-slate-900 font-bold">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Neon PostgreSQL Row-Level Security (RLS)</span>
                  </div>
                  <p>
                    All tables contain an indexed `organization_id` foreign key. Database queries are wrapped in session-scoped tenant filters, eliminating cross-tenant data leakage risks.
                  </p>
                </div>

                <div className="p-5 rounded-2xl border border-slate-200 bg-white space-y-2">
                  <div className="flex items-center gap-2 text-slate-900 font-bold">
                    <Database className="w-4 h-4 text-blue-600" />
                    <span>Neon S3 Document Storage</span>
                  </div>
                  <p>
                    Uploaded CSV/XLSX spreadsheets and generated PDF export reports are stored in private Neon Object Storage buckets with AWS SigV4 signed presigned URLs expiring in 1 hour.
                  </p>
                </div>
              </div>
            </article>
          )}
        </main>
      </div>

      <MarketingFooter />
    </div>
  );
}
