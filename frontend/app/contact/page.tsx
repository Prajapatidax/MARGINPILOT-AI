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
  Sparkles,
  Users,
  Target,
  Globe2,
  Award,
  Zap,
  ArrowRight,
  Lock,
  BadgeCheck,
  Building2,
  Check,
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
    orderVolume: "25k-100k",
    topic: "sales",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const values = [
    {
      title: "Mathematical Integrity",
      desc: "Every metric, margin calculation, and cohort forecast is 100% verified against real database SQL. Zero hallucination, zero statistical fudging.",
      icon: Target,
      color: "text-blue-600 bg-blue-50 border-blue-200",
    },
    {
      title: "Zero Public AI Model Training",
      desc: "Your confidential sales records, supplier contracts, and wholesale discounts remain sovereign in isolated database containers. Never used to train public LLMs.",
      icon: Lock,
      color: "text-purple-600 bg-purple-50 border-purple-200",
    },
    {
      title: "Fair Global Price Parity",
      desc: "We reject geographical penalties and arbitrary regional markups. Subscriptions in all 12 currencies are strictly pegged to fair foreign exchange parity.",
      icon: Globe2,
      color: "text-emerald-600 bg-emerald-50 border-emerald-200",
    },
    {
      title: "Engineering Without Compromise",
      desc: "Sub-20ms dashboard queries, high-throughput Polars ingestion workers, and 99.99% high availability backed by contractual financial SLA credits.",
      icon: Zap,
      color: "text-amber-600 bg-amber-50 border-amber-200",
    },
  ];

  const leaders = [
    {
      name: "Aarav Singhania",
      role: "Co-Founder & Chief Executive Officer",
      bio: "Former McKinsey & Company engagement manager leading enterprise supply chain transformations across North America and India.",
      image: "/images/founder-ceo.jpg",
    },
    {
      name: "Dr. Emily Watson",
      role: "Co-Founder & Chief AI Scientist",
      bio: "Ph.D. in Recurrent Neural Networks & Time-Series Forecasting. Former DeepMind research fellow specializing in LSTM architectures.",
      image: "/images/chief-ai.jpg",
    },
    {
      name: "Rajesh Mehta",
      role: "Executive Advisory Member & Manufacturing Partner",
      bio: "CEO of ABC Manufacturing and early design partner who helped shape MarginPilot AI's BOM cost rollup and machine anomaly models.",
      image: "/images/rajesh-mehta.jpg",
    },
    {
      name: "Elena Rostova",
      role: "VP of Enterprise Solutions Architecture",
      bio: "18+ years leading multi-hub distribution technology and WMS/ERP integrations across Europe, North America, and Asia.",
      image: "/images/elena-rostova.jpg",
    },
  ];

  const offices = [
    {
      flag: "🇮🇳",
      city: "Gandhinagar, Gujarat, India",
      label: "Global AI Engineering & Product HQ",
      address: "Tower 1, Level 14, Brigade International Financial Centre, GIFT City, Gandhinagar, Gujarat 382355, India",
      phone: "+91 (79) 4920-8000",
    },
    {
      flag: "🇺🇸",
      city: "San Francisco, California, USA",
      label: "Americas Solutions & Commercial Center",
      address: "100 Montgomery St, Suite 1400, San Francisco, CA 94104, United States",
      phone: "+1 (415) 890-4210",
    },
    {
      flag: "🇬🇧",
      city: "London, United Kingdom",
      label: "EMEA Operations & Financial Center",
      address: "25 Bank St, Canary Wharf, London E14 5JP, United Kingdom",
      phone: "+44 (20) 7946-0921",
    },
    {
      flag: "🇸🇬",
      city: "Singapore",
      label: "Asia-Pacific Supply Chain Hub",
      address: "1 Marina Boulevard, #28-00, Singapore 018989",
      phone: "+65 6812-4000",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 font-sans selection:bg-blue-600 selection:text-white flex flex-col">
      <MarketingNavbar />

      {/* Hero Header */}
      <section className="relative pt-16 pb-14 px-6 max-w-7xl mx-auto w-full text-center space-y-6">
        {/* Subtle Ambient Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-80 bg-gradient-to-b from-blue-100/70 via-indigo-50/40 to-transparent blur-3xl pointer-events-none -z-10" />

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-semibold shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
          <span>About MarginPilot AI &amp; Enterprise Inquiries</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight max-w-4xl mx-auto leading-[1.15]">
          Engineering Financial Truth.{" "}
          <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 bg-clip-text text-transparent">
            Empowering Growth.
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          MarginPilot AI bridges messy multi-channel transactional data with deep neural forecasting, verified SQL RAG,
          and automated profit optimization. Learn about our founding story or connect directly with our engineering architects.
        </p>

        {/* Quick Jump Pills */}
        <div className="pt-2 flex items-center justify-center gap-2 flex-wrap text-xs font-bold">
          <a
            href="#mission"
            className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition shadow-xs"
          >
            Our Mission &amp; Impact
          </a>
          <a
            href="#leadership"
            className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition shadow-xs"
          >
            Leadership Team
          </a>
          <a
            href="#offices"
            className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition shadow-xs"
          >
            Global Headquarters
          </a>
          <a
            href="#contact-form"
            className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition shadow-xs flex items-center gap-1.5"
          >
            <span>Inquiry Form</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* OUR MISSION & FOUNDING STORY */}
      {/* ========================================================================= */}
      <section id="mission" className="py-16 px-6 max-w-7xl mx-auto w-full border-t border-slate-200/80">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider">
              <Target className="w-3.5 h-3.5" />
              <span>Our Foundational Mission</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              Why We Built MarginPilot AI
            </h2>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Every day, growing retailers, manufacturers, and wholesale distributors lose between 2% and 6% of their revenue
              to silent margin leakage: unbilled logistics freight, promotion cannibalization, inaccurate demand forecasts,
              and expensive deadstock carrying costs.
            </p>

            <p className="text-sm text-slate-600 leading-relaxed">
              Traditional ERP systems are rigid accounting records, while generic generative AI chatbots hallucinate numbers
              and lack access to mathematical truth. We created MarginPilot AI to combine verified SQL database execution
              with deep learning neural networks — giving CFOs and operations leaders instant clarity and guaranteed ROI.
            </p>

            {/* Impact Metric Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs">
                <span className="text-2xl font-black text-blue-600 block">$18M+</span>
                <span className="text-[11px] font-bold text-slate-700 block mt-0.5">Margin Leakage Prevented</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs">
                <span className="text-2xl font-black text-emerald-600 block">12</span>
                <span className="text-[11px] font-bold text-slate-700 block mt-0.5">Global Currencies Supported</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs">
                <span className="text-2xl font-black text-indigo-600 block">100%</span>
                <span className="text-[11px] font-bold text-slate-700 block mt-0.5">SQL Grounded Verification</span>
              </div>
            </div>
          </div>

          {/* Right Image Feature */}
          <div className="lg:col-span-6 relative">
            <div className="rounded-3xl overflow-hidden border border-slate-200 shadow-xl bg-slate-900 relative">
              <img
                src="/images/office-gift-city.jpg"
                alt="MarginPilot AI Engineering Center at GIFT City"
                className="w-full h-80 sm:h-96 object-cover opacity-60"
              />

              {/* Glassmorphic Overlay Badge */}
              <div className="absolute inset-4 sm:inset-6 flex flex-col justify-end bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent rounded-2xl p-6 text-white space-y-2">
                <span className="px-2.5 py-1 rounded-full bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wider self-start">
                  Global Engineering Hub
                </span>
                <h3 className="text-xl font-bold text-white">GIFT City Financial Tech Center</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Engineered in India&apos;s premier international financial tech hub with high-availability multi-region cloud clusters worldwide.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* OUR CORE VALUES */}
      {/* ========================================================================= */}
      <section className="py-16 px-6 max-w-7xl mx-auto w-full border-t border-slate-200/80">
        <div className="text-center space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-semibold">
            <Award className="w-3.5 h-3.5 text-blue-600" />
            <span>Guiding Principles</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            The Principles Behind Our Technology
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto">
            We hold ourselves to rigorous engineering standards so your leadership team can trust every insight with absolute confidence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((val, idx) => {
            const Icon = val.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all space-y-3"
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${val.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900 tracking-tight">{val.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{val.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* LEADERSHIP & SCIENTIFIC TEAM */}
      {/* ========================================================================= */}
      <section id="leadership" className="py-16 px-6 max-w-7xl mx-auto w-full border-t border-slate-200/80">
        <div className="text-center space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">
            <Users className="w-3.5 h-3.5" />
            <span>Leadership &amp; Applied Science</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Meet Our Leadership Team
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto">
            Experienced researchers, enterprise software architects, and operations veterans united to make margin optimization autonomous.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {leaders.map((leader, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs text-center space-y-4 hover:shadow-md transition-all"
            >
              <div className="w-24 h-24 rounded-2xl overflow-hidden mx-auto border-2 border-blue-600/20 shadow-md">
                <img
                  src={leader.image}
                  alt={leader.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-1">
                <h4 className="text-base font-bold text-slate-900">{leader.name}</h4>
                <p className="text-[11px] font-bold text-blue-600 leading-snug">{leader.role}</p>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed text-left pt-2 border-t border-slate-100">
                {leader.bio}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* GLOBAL HEADQUARTERS & HUBS */}
      {/* ========================================================================= */}
      <section id="offices" className="py-16 px-6 max-w-7xl mx-auto w-full border-t border-slate-200/80">
        <div className="text-center space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-semibold">
            <Building2 className="w-3.5 h-3.5 text-blue-600" />
            <span>Worldwide Presence</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Our Global Office Locations
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto">
            Local development, customer engineering, and compliance offices serving clients across 4 continents.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {offices.map((office, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{office.flag}</span>
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                    {office.label.split(" ")[0]} Hub
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900">{office.city}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{office.address}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 text-xs font-semibold text-slate-700 flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>{office.phone}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* CONTACT FORM & DIRECT CHANNELS */}
      {/* ========================================================================= */}
      <section id="contact-form" className="py-16 px-6 max-w-7xl mx-auto w-full border-t border-slate-200/80">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left: Contact Form */}
          <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div className="space-y-1 pb-2 border-b border-slate-100">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold mb-2">
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Enterprise Solutions Inquiries</span>
              </div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Connect with Our Architects</h2>
              <p className="text-xs text-slate-500 leading-relaxed">
                Have questions about custom ERP integrations (SAP, Oracle, NetSuite), high-volume machine learning pipelines,
                or Enterprise SLAs? We respond within 2 hours.
              </p>
            </div>

            {submitted ? (
              <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-3 text-center">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h3 className="text-lg font-bold">Inquiry Received Successfully</h3>
                <p className="text-xs text-emerald-700 max-w-md mx-auto leading-relaxed">
                  Thank you for reaching out. We have assigned a Principal Data Architect to your inquiry and will follow up at <strong>{formData.email}</strong> with technical documentation and scheduling options.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => setSubmitted(false)}
                    className="px-5 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition"
                  >
                    Send Another Message
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-700">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="Jane Doe"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-slate-50/50"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-700">Work Email *</label>
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
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-700">Company Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="Acme Global Corporation"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-slate-50/50"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-700">Business Model *</label>
                    <select
                      value={formData.businessType}
                      onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                      className="w-full p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-slate-50/50"
                    >
                      <option value="retail">Retail &amp; POS Commerce</option>
                      <option value="manufacturing">Discrete or Process Manufacturing</option>
                      <option value="wholesale">Wholesale &amp; B2B Distribution</option>
                      <option value="distribution">Multi-Warehouse Logistics</option>
                      <option value="hybrid">Hybrid / Multi-Entity Group</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-700">Monthly Order Lines Volume *</label>
                    <select
                      value={formData.orderVolume}
                      onChange={(e) => setFormData({ ...formData, orderVolume: e.target.value })}
                      className="w-full p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-slate-50/50"
                    >
                      <option value="under-25k">Under 25,000 order lines / mo</option>
                      <option value="25k-100k">25,000 - 100,000 order lines / mo</option>
                      <option value="100k-500k">100,000 - 500,000 order lines / mo</option>
                      <option value="500k-plus">500,000+ order lines (Enterprise Tier)</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-700">Topic of Interest *</label>
                    <select
                      value={formData.topic}
                      onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                      className="w-full p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-slate-50/50"
                    >
                      <option value="sales">Enterprise Plan &amp; Volume Licensing</option>
                      <option value="erp">Custom ERP / WMS Data Connectors</option>
                      <option value="ml">Custom ML Model Training &amp; Forecasting</option>
                      <option value="security">SOC 2 / HIPAA Security Review</option>
                      <option value="partnership">System Integrator / Reseller Partnership</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">How can we assist you? *</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tell us about your current transactional volume, ERP/WMS stack, or specific ML demand forecasting objectives..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-slate-50/50"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 group"
                >
                  <span>Submit Inquiry to Principal Architect</span>
                  <Send className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                </button>

                <p className="text-[11px] text-slate-400 text-center">
                  Protected by 256-bit encryption. Strict NDA guaranteed under our Privacy Policy.
                </p>
              </form>
            )}
          </div>

          {/* Right: Direct Channels & SLA Escalations */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Building className="w-4 h-4 text-blue-600" />
                <span>Direct Executive Channels</span>
              </h3>
              <ul className="space-y-3 text-xs text-slate-700">
                <li className="flex items-start gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                  <Mail className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 block">Enterprise Sales &amp; Quotes</span>
                    <a href="mailto:sales@marginpilot.ai" className="text-blue-600 font-semibold hover:underline">
                      sales@marginpilot.ai
                    </a>
                    <span className="text-[11px] text-slate-400 block mt-0.5">Average response &lt; 2 hours</span>
                  </div>
                </li>

                <li className="flex items-start gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                  <Clock className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 block">Technical Support (24/7/365)</span>
                    <a href="mailto:support@marginpilot.ai" className="text-blue-600 font-semibold hover:underline">
                      support@marginpilot.ai
                    </a>
                    <span className="text-[11px] text-slate-400 block mt-0.5">P1 Critical Incident SLA &lt; 1 hour</span>
                  </div>
                </li>

                <li className="flex items-start gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                  <ShieldCheck className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 block">Security, DPA &amp; Compliance</span>
                    <a href="mailto:security@marginpilot.ai" className="text-blue-600 font-semibold hover:underline">
                      security@marginpilot.ai
                    </a>
                    <span className="text-[11px] text-slate-400 block mt-0.5">SOC 2 Type II audit report requests</span>
                  </div>
                </li>

                <li className="flex items-start gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                  <Globe2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 block">Media &amp; Academic Partnerships</span>
                    <a href="mailto:press@marginpilot.ai" className="text-blue-600 font-semibold hover:underline">
                      press@marginpilot.ai
                    </a>
                  </div>
                </li>
              </ul>
            </div>

            {/* Trust Badges */}
            <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl space-y-4 shadow-md">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <BadgeCheck className="w-4 h-4 text-emerald-400" />
                <span>Enterprise Assurances &amp; Guarantees</span>
              </h4>
              <div className="space-y-2.5 text-xs text-slate-300">
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>30-Day Money-Back Guarantee:</strong> 100% refund processed within 15 business days if ROI is not verified.</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Zero AI Training:</strong> Your private financial ledger is never used to train public LLM models.</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>99.99% Uptime SLA:</strong> Monitored live across 8 global edge points of presence.</span>
                </div>
              </div>
              <div className="pt-2">
                <Link
                  href="/refund"
                  className="text-xs text-blue-400 hover:text-blue-300 font-bold underline underline-offset-2 flex items-center gap-1"
                >
                  <span>Review Transparent Refund Policy</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
