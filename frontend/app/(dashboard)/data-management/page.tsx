"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  UploadCloud,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  FileText,
  Clock,
  Layers,
  Sparkles,
  RefreshCw,
  Eye,
} from "lucide-react";
import { apiClient } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

interface ImportJob {
  id: string;
  filename: string;
  file_format: string;
  target_entity: string;
  status: string;
  total_rows: number;
  valid_rows: number;
  invalid_rows: number;
  created_at: string;
}

interface ColumnProfile {
  column_name: string;
  inferred_type: string;
  null_count: number;
  null_percentage: number;
  sample_values: string[];
}

export default function DataManagementPage() {
  const router = useRouter();
  const { activeOrg } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Flow State: 1 = Upload, 2 = Mapping, 3 = Validation & Commit, 4 = Success
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  const [targetEntity, setTargetEntity] = useState<string>("sales");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Mapping & Profile State
  const [jobId, setJobId] = useState<string | null>(null);
  const [columnsProfile, setColumnsProfile] = useState<ColumnProfile[]>([]);
  const [suggestedMappings, setSuggestedMappings] = useState<Record<string, string | null>>({});
  const [confidenceScores, setConfidenceScores] = useState<Record<string, number>>({});
  const [canonicalFields, setCanonicalFields] = useState<Record<string, any>>({});
  const [userMappings, setUserMappings] = useState<Record<string, string | null>>({});

  // Validation State
  const [isValidating, setIsValidating] = useState(false);
  const [validationReport, setValidationReport] = useState<any>(null);
  const [isCommitting, setIsCommitting] = useState(false);

  // Recent imports list
  const [recentJobs, setRecentJobs] = useState<ImportJob[]>([]);
  const [isLoadingJobs, setIsLoadingJobs] = useState(true);

  const fetchJobs = async () => {
    try {
      setIsLoadingJobs(true);
      const jobs = await apiClient<ImportJob[]>("/data-imports/");
      setRecentJobs(jobs);
    } catch (err) {
      console.error("Failed to load import jobs:", err);
    } finally {
      setIsLoadingJobs(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [activeOrg]);

  // Step 1: Upload and profile file
  const handleFileUpload = async (file: File) => {
    setSelectedFile(file);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("target_entity", targetEntity);

      const token = localStorage.getItem("marginpilot_token");
      const activeOrgId = localStorage.getItem("marginpilot_active_org_id");

      const response = await fetch("http://localhost:8000/api/v1/data-imports/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          ...(activeOrgId ? { "X-Organization-ID": activeOrgId } : {}),
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: "Upload failed" }));
        throw new Error(errorData.detail || "Upload failed");
      }

      const data = await response.json();
      setJobId(data.job_id);
      setColumnsProfile(data.columns_profile);
      setSuggestedMappings(data.suggested_mappings);
      setConfidenceScores(data.confidence_scores);
      setCanonicalFields(data.canonical_fields);
      setUserMappings(data.suggested_mappings);
      setStep(2);
    } catch (err: any) {
      alert(err.message || "Failed to upload file");
    } finally {
      setIsUploading(false);
    }
  };

  // Step 2: Validate confirmed mapping
  const handleValidateMapping = async () => {
    if (!jobId) return;
    setIsValidating(true);

    try {
      const report = await apiClient<any>(`/data-imports/${jobId}/validate`, {
        method: "POST",
        body: JSON.stringify({ mappings: userMappings }),
      });
      setValidationReport(report);
      setStep(3);
    } catch (err: any) {
      alert(err.message || "Failed to validate column mapping");
    } finally {
      setIsValidating(false);
    }
  };

  // Step 3: Commit dataset to database
  const handleCommitImport = async () => {
    if (!jobId) return;
    setIsCommitting(true);

    try {
      await apiClient<any>(`/data-imports/${jobId}/commit`, {
        method: "POST",
      });
      setStep(4);
      fetchJobs();
    } catch (err: any) {
      alert(err.message || "Failed to commit import");
    } finally {
      setIsCommitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Data Import</h1>
          <p className="text-sm text-slate-500">Upload and prepare your business data for intelligent analysis</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg">
            Tenant: {activeOrg?.name || "Active Workspace"}
          </span>
        </div>
      </div>

      {/* Main Flow Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
        {/* Progress Stepper */}
        <div className="grid grid-cols-4 gap-2 border-b border-slate-100 pb-5">
          <div className={`flex items-center gap-2 text-xs font-semibold ${step >= 1 ? "text-blue-600" : "text-slate-400"}`}>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step >= 1 ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-400"}`}>
              1
            </div>
            <span>Upload File</span>
          </div>

          <div className={`flex items-center gap-2 text-xs font-semibold ${step >= 2 ? "text-blue-600" : "text-slate-400"}`}>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step >= 2 ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-400"}`}>
              2
            </div>
            <span>Map Columns</span>
          </div>

          <div className={`flex items-center gap-2 text-xs font-semibold ${step >= 3 ? "text-blue-600" : "text-slate-400"}`}>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step >= 3 ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-400"}`}>
              3
            </div>
            <span>Validation</span>
          </div>

          <div className={`flex items-center gap-2 text-xs font-semibold ${step === 4 ? "text-emerald-600" : "text-slate-400"}`}>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step === 4 ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-400"}`}>
              4
            </div>
            <span>Completed</span>
          </div>
        </div>

        {/* STEP 1: Upload */}
        {step === 1 && (
          <div className="space-y-6">
            {/* Entity Selector */}
            <div className="max-w-md">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Target Business Entity</label>
              <select
                value={targetEntity}
                onChange={(e) => setTargetEntity(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="sales">Sales &amp; Orders (Transactions, Revenue, Quantity)</option>
                <option value="products">Product Catalog (SKU, Prices, Lead Times, Safety Stock)</option>
                <option value="customers">Customers (Codes, Contacts, Segments)</option>
                <option value="inventory">Inventory Movements (Stock Adjustments, Receipts)</option>
              </select>
            </div>

            {/* Drag & Drop Zone */}
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                if (e.dataTransfer.files?.[0]) {
                  handleFileUpload(e.dataTransfer.files[0]);
                }
              }}
              className="border-2 border-dashed border-slate-200 hover:border-blue-400 bg-slate-50/50 hover:bg-blue-50/20 rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer transition-all group"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.xlsx,.xls,.json"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    handleFileUpload(e.target.files[0]);
                  }
                }}
              />

              <div className="w-14 h-14 rounded-2xl bg-blue-50 group-hover:bg-blue-100 text-blue-600 flex items-center justify-center mb-4 transition-colors shadow-sm">
                {isUploading ? (
                  <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
                ) : (
                  <UploadCloud className="w-7 h-7" />
                )}
              </div>

              <p className="text-sm font-semibold text-slate-800">
                {isUploading ? "Profiling & analyzing dataset..." : "Drag & drop files here or click to upload"}
              </p>
              <p className="text-xs text-slate-400 mt-1">Supports CSV, XLSX, JSON (Up to 50MB)</p>
            </div>
          </div>
        )}

        {/* STEP 2: Intelligent Column Mapping */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Intelligent Column Mapping</h3>
                <p className="text-xs text-slate-500">
                  We automatically matched your uploaded columns to canonical fields. Review or adjust mappings below.
                </p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 bg-purple-50 text-purple-700 border border-purple-200 rounded-lg flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Schema Assist</span>
              </span>
            </div>

            <div className="space-y-3">
              {Object.entries(canonicalFields).map(([canonField, fieldDef]) => {
                const currentMapped = userMappings[canonField] || "";
                const confidence = confidenceScores[canonField] || 0;
                return (
                  <div
                    key={canonField}
                    className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="min-w-[200px]">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-900 font-mono">{canonField}</span>
                        {fieldDef.required && (
                          <span className="text-[10px] text-red-600 bg-red-50 border border-red-100 px-1.5 py-0.2 rounded font-semibold">
                            Required
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
                        Type: {fieldDef.type}
                      </span>
                    </div>

                    <div className="flex-1 max-w-sm flex items-center gap-3">
                      <select
                        value={currentMapped}
                        onChange={(e) => {
                          const val = e.target.value || null;
                          setUserMappings((prev) => ({ ...prev, [canonField]: val }));
                        }}
                        className={`w-full px-3 py-1.5 text-xs border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          currentMapped ? "bg-white border-slate-300 font-medium text-slate-800" : "bg-red-50/40 border-red-200 text-slate-400"
                        }`}
                      >
                        <option value="">-- Do Not Map --</option>
                        {columnsProfile.map((col) => (
                          <option key={col.column_name} value={col.column_name}>
                            {col.column_name} ({col.inferred_type})
                          </option>
                        ))}
                      </select>

                      {confidence > 0 && (
                        <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 whitespace-nowrap">
                          {Math.round(confidence * 100)}% match
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2 border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold rounded-lg flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={handleValidateMapping}
                disabled={isValidating}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow flex items-center gap-1.5 disabled:opacity-50"
              >
                {isValidating ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <>
                    <span>Validate Dataset</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Validation Report & Commit */}
        {step === 3 && validationReport && (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="text-xs text-slate-500 font-medium">Total Rows</span>
                <p className="text-xl font-bold text-slate-900 mt-1">{validationReport.total_rows}</p>
              </div>

              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                <span className="text-xs text-emerald-700 font-medium">Valid Rows</span>
                <p className="text-xl font-bold text-emerald-700 mt-1">{validationReport.valid_rows}</p>
              </div>

              <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                <span className="text-xs text-red-700 font-medium">Invalid Rows</span>
                <p className="text-xl font-bold text-red-700 mt-1">{validationReport.invalid_rows}</p>
              </div>
            </div>

            {/* Errors or Warnings List */}
            {validationReport.errors?.length > 0 && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-red-800 font-bold text-xs">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>Validation Issues Detected ({validationReport.errors.length})</span>
                </div>
                <div className="max-h-40 overflow-y-auto space-y-1 text-xs text-red-700">
                  {validationReport.errors.map((err: any, i: number) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="font-mono text-[11px] bg-red-100 px-1 rounded">Row {err.row}</span>
                      <span>{err.message}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Preview of Valid Records */}
            {validationReport.preview_records?.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">Validated Records Preview</h4>
                <div className="overflow-x-auto border border-slate-200 rounded-xl">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                      <tr>
                        {Object.keys(validationReport.preview_records[0]).map((k) => (
                          <th key={k} className="px-3 py-2 font-mono">
                            {k}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-800">
                      {validationReport.preview_records.map((rec: any, idx: number) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          {Object.values(rec).map((val: any, j: number) => (
                            <td key={j} className="px-3 py-2 truncate max-w-[150px]">
                              {String(val ?? "-")}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-4 py-2 border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold rounded-lg flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Adjust Mappings</span>
              </button>

              <button
                type="button"
                onClick={handleCommitImport}
                disabled={isCommitting || validationReport.valid_rows === 0}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow flex items-center gap-1.5 disabled:opacity-50"
              >
                {isCommitting ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Commit &amp; Ingest Records ({validationReport.valid_rows})</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Success Message */}
        {step === 4 && (
          <div className="py-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Dataset Imported Successfully!</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Your business records have been safely validated and persisted to the canonical data platform. Your analytics, forecasts, and AI copilot now reflect this live data.
            </p>
            <div className="flex items-center justify-center gap-3 pt-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2 border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold rounded-lg"
              >
                Import Another File
              </button>
              <button
                type="button"
                onClick={() => router.push("/dashboard")}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow flex items-center gap-1.5"
              >
                <span>View Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Recent Imports Section matching UX Mockup */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-blue-600" />
            <h2 className="text-base font-bold text-slate-900">Recent Imports</h2>
          </div>
          <button
            onClick={fetchJobs}
            className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Refresh</span>
          </button>
        </div>

        {recentJobs.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400">
            No datasets imported yet for this organization. Upload your first CSV or XLSX file above.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {recentJobs.map((job) => (
              <div key={job.id} className="py-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4 text-slate-500" />
                  </div>
                  <div className="truncate">
                    <p className="text-xs font-semibold text-slate-800 truncate">{job.filename}</p>
                    <p className="text-[11px] text-slate-400">
                      {job.status} · {job.valid_rows} rows · {job.target_entity}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      job.status === "COMPLETED"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                        : job.status === "FAILED"
                        ? "bg-red-50 text-red-700 border border-red-100"
                        : "bg-blue-50 text-blue-700 border border-blue-100"
                    }`}
                  >
                    {job.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
