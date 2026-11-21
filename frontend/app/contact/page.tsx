"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  Building,
  ShieldCheck,
  MessageSquare,
} from "lucide-react";
import MarketingNavbar from "@/components/layout/MarketingNavbar";
import MarketingFooter from "@/components/layout/MarketingFooter";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    company: "",
    businessType: "retail",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-600 selection:text-white flex flex-col">
      <MarketingNavbar />

      {/* Header */}
      <section className="bg-slate-50 border-b border-slate-200 py-12 px-6">
        <div className="max-w-4xl mx-auto space-y-3 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
            <MessageSquare className="w-3.5 h-3.5" />
            Get in Touch
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Connect with Our Solutions Architects
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
            Have questions about custom ERP integrations, machine learning model capacity, or Enterprise SLAs? We respond within 2 hours.
          </p>
        </div>
      </section>

      {/* Content Grid */}
      <section className="py-12 px-6 max-w-6xl mx-auto w-full flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left: Contact Form */}
          <div className="lg:col-span-7 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-slate-900">Send Us an Inquiry</h2>
              <p className="text-xs text-slate-500">
                Fill out the details below and an Enterprise Account Executive will follow up.
              </p>
            </div>

            {submitted ? (
              <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-3 text-center">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h3 className="text-base font-bold">Inquiry Received Successfully</h3>
                <p className="text-xs text-emerald-700 max-w-sm mx-auto">
                  Thank you for reaching out. We have assigned a Principal Data Architect to your inquiry and will contact you at <strong>{formData.email}</strong> shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="Jane Doe"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-slate-50/50"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">Work Email *</label>
                    <input
                      type="email"
                      required
                      placeholder="jane@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-slate-50/50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">Company Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="Acme Global Corporation"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-slate-50/50"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">Business Model *</label>
                    <select
                      value={formData.businessType}
                      onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                      className="w-full p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-slate-50/50"
                    >
                      <option value="retail">Retail &amp; POS Commerce</option>
                      <option value="manufacturing">Discrete or Process Manufacturing</option>
                      <option value="wholesale">Wholesale &amp; B2B Distribution</option>
                      <option value="distribution">Multi-Warehouse Logistics</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">How can we assist you? *</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tell us about your transaction volume, existing ERP/WMS stack, or specific ML forecasting goals..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-slate-50/50"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow transition-colors flex items-center justify-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Inquiry</span>
                </button>
              </form>
            )}
          </div>

          {/* Right: Direct Channels */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Direct Contact Channels
              </h3>
              <ul className="space-y-3 text-xs text-slate-700">
                <li className="flex items-start gap-3 p-3 bg-white rounded-xl border border-slate-200">
                  <Mail className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 block">Enterprise Sales</span>
                    <a href="mailto:sales@marginpilot.ai" className="text-blue-600 hover:underline">
                      sales@marginpilot.ai
                    </a>
                  </div>
                </li>

                <li className="flex items-start gap-3 p-3 bg-white rounded-xl border border-slate-200">
                  <Clock className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 block">Technical Support (24/7)</span>
                    <a href="mailto:support@marginpilot.ai" className="text-blue-600 hover:underline">
                      support@marginpilot.ai
                    </a>
                    <span className="text-[11px] text-slate-400 block">P1 Incident SLA &lt; 1 hour</span>
                  </div>
                </li>

                <li className="flex items-start gap-3 p-3 bg-white rounded-xl border border-slate-200">
                  <ShieldCheck className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 block">Security &amp; Compliance</span>
                    <a href="mailto:security@marginpilot.ai" className="text-blue-600 hover:underline">
                      security@marginpilot.ai
                    </a>
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-3 text-xs text-slate-600">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-600" />
                <span>Global Office Locations</span>
              </h4>
              <p>
                MarginPilot AI operates out of North America, Europe, and Asia-Pacific with high-availability Neon database replicas and low-latency Upstash edge clusters.
              </p>
              <div className="pt-2 text-xs text-slate-700 space-y-2.5">
                <div className="p-2.5 bg-white rounded-xl border border-slate-200 flex items-start gap-2">
                  <span className="text-base shrink-0">🇮🇳</span>
                  <div>
                    <span className="font-bold text-slate-900 block">Gandhinagar, Gujarat</span>
                    <span className="text-[11px] text-slate-500">GIFT City, Brigade International Financial Centre, Tower 1, Level 14, Gandhinagar, Gujarat 382355, India</span>
                  </div>
                </div>

                <div className="p-2.5 bg-white rounded-xl border border-slate-200 flex items-start gap-2">
                  <span className="text-base shrink-0">🇺🇸</span>
                  <div>
                    <span className="font-bold text-slate-900 block">San Francisco, United States</span>
                    <span className="text-[11px] text-slate-500">100 Montgomery St, Suite 1400, San Francisco, CA 94104</span>
                  </div>
                </div>

                <div className="p-2.5 bg-white rounded-xl border border-slate-200 flex items-start gap-2">
                  <span className="text-base shrink-0">🇬🇧</span>
                  <div>
                    <span className="font-bold text-slate-900 block">London, United Kingdom</span>
                    <span className="text-[11px] text-slate-500">25 Bank St, Canary Wharf, London E14 5JP</span>
                  </div>
                </div>

                <div className="p-2.5 bg-white rounded-xl border border-slate-200 flex items-start gap-2">
                  <span className="text-base shrink-0">🇸🇬</span>
                  <div>
                    <span className="font-bold text-slate-900 block">Singapore</span>
                    <span className="text-[11px] text-slate-500">1 Marina Boulevard, #28-00, Singapore 018989</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
