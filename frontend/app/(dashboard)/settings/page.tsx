"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  Settings,
  User,
  Building2,
  CreditCard,
  Grid,
  Shield,
  Bell,
  CheckCircle2,
  Save,
  Clock,
  Sparkles,
  Zap,
  Lock,
  Mail,
  Copy,
  ExternalLink,
  Check,
  AlertTriangle,
  RefreshCw,
  Sliders,
  DollarSign,
  Download,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { COUNTRIES, formatPlanPrice } from "@/lib/currencies";

export default function SettingsPage() {
  const searchParams = useSearchParams();
  const { user, activeOrg } = useAuth();

  const tabParam = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState<string>(tabParam || "Organization");

  useEffect(() => {
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  // Organization Settings Form State
  const [companyName, setCompanyName] = useState<string>(activeOrg?.name || "Acme Corporation");
  const [businessType, setBusinessType] = useState<string>(activeOrg?.business_type || "RETAIL");
  const [country, setCountry] = useState<string>(activeOrg?.country || "United States");
  const [currency, setCurrency] = useState<string>(activeOrg?.currency || "USD");
  const [timezone, setTimezone] = useState<string>(activeOrg?.timezone || "UTC");
  const [fiscalYear, setFiscalYear] = useState<string>("January");
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<boolean>(false);

  // Profile Form State
  const [profileName, setProfileName] = useState<string>(user?.full_name || "Jane Doe");
  const [profileEmail] = useState<string>(user?.email || "jane@company.com");
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");

  // Subscription Form State (Task 4)
  const [billingCycle, setBillingCycle] = useState<"annual" | "monthly">("annual");
  const [selectedPlanTier, setSelectedPlanTier] = useState<string>(activeOrg?.subscription_plan || "GROWTH");
  const [showCheckoutModal, setShowCheckoutModal] = useState<boolean>(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState<boolean>(false);

  // Notifications State
  const [emailAlerts, setEmailAlerts] = useState({
    trialExpiry: true,
    anomalyDrops: true,
    weeklyReport: true,
    inventoryStockout: true,
  });
  const [slackWebhook, setSlackWebhook] = useState("");

  // Sync state if activeOrg changes
  useEffect(() => {
    if (activeOrg) {
      setCompanyName(activeOrg.name);
      setBusinessType(activeOrg.business_type);
      setCountry(activeOrg.country);
      setCurrency(activeOrg.currency);
      setTimezone(activeOrg.timezone);
      setSelectedPlanTier(activeOrg.subscription_plan || "GROWTH");
    }
    if (user) {
      setProfileName(user.full_name);
    }
  }, [activeOrg, user]);

  const tabs = [
    { name: "Organization", icon: Building2 },
    { name: "Subscription", icon: CreditCard, highlight: true },
    { name: "Profile", icon: User },
    { name: "Integrations", icon: Grid },
    { name: "Security", icon: Shield },
    { name: "Notifications", icon: Bell },
  ];

  // Free Trial Countdown Calculations (Task 4)
  const calculateTrialTime = () => {
    if (!activeOrg?.trial_ends_at) {
      return { days: 14, hours: 0, minutes: 0, isExpired: false, percent: 100 };
    }
    const end = new Date(activeOrg.trial_ends_at).getTime();
    const now = Date.now();
    const diff = end - now;
    if (diff <= 0) {
      return { days: 0, hours: 0, minutes: 0, isExpired: true, percent: 0 };
    }
    const totalDuration = 14 * 24 * 60 * 60 * 1000;
    const percent = Math.min(100, Math.max(0, Math.round((diff / totalDuration) * 100)));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return { days, hours, minutes, isExpired: false, percent };
  };

  const trialInfo = calculateTrialTime();

  const handleSaveOrganization = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleCopyOrgId = () => {
    if (activeOrg?.id) {
      navigator.clipboard.writeText(activeOrg.id);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <Settings className="w-7 h-7 text-blue-600" />
            <span>Workspace Settings</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage your account preferences, localization, subscription plan, and security integrations.
          </p>
        </div>

        {/* 14-Day Free Trial Status Pill in Header */}
        <div
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold border ${
            trialInfo.isExpired
              ? "bg-red-50 text-red-700 border-red-200"
              : "bg-blue-50 text-blue-700 border-blue-200"
          }`}
        >
          <span className={`w-2 h-2 rounded-full ${trialInfo.isExpired ? "bg-red-500" : "bg-blue-600 animate-pulse"}`} />
          <span>{trialInfo.isExpired ? "Trial Expired" : `${trialInfo.days}d ${trialInfo.hours}h Free Trial Remaining`}</span>
        </div>
      </div>

      {/* Main Grid: Tabs on left, Content Panel on right */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
        {/* Left Navigation Tabs */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-2 shadow-2xs space-y-1">
          {tabs.map((t) => {
            const Icon = t.icon;
            const isActive = activeTab === t.name;
            return (
              <button
                key={t.name}
                onClick={() => setActiveTab(t.name)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                  isActive
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400"}`} />
                  <span>{t.name}</span>
                </div>
                {t.highlight && (
                  <span
                    className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-full ${
                      isActive ? "bg-blue-500 text-white" : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    Trial
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Right Content Panel */}
        <div className="md:col-span-3 bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
          {/* TAB 1: ORGANIZATION SETTINGS */}
          {activeTab === "Organization" && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-lg font-bold text-slate-900">Organization &amp; Regional Localization</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Configure primary company information, operating country, currency, and timezone.
                </p>
              </div>

              <form onSubmit={handleSaveOrganization} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">Company Name</label>
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700">Business Industry Vertical</label>
                    <select
                      value={businessType}
                      onChange={(e) => setBusinessType(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="RETAIL">Retail (POS, Stores, Promotions)</option>
                      <option value="MANUFACTURING">Manufacturing (Batches, BOM, Machine Sensors)</option>
                      <option value="WHOLESALE">Wholesale (Bulk Orders, Tiered Pricing)</option>
                      <option value="DISTRIBUTION">Distribution (Warehouses, Route Logistics)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700">Operating Country</label>
                    <select
                      value={country}
                      onChange={(e) => {
                        setCountry(e.target.value);
                        const match = COUNTRIES.find((c) => c.country === e.target.value);
                        if (match) {
                          setCurrency(match.code);
                          setTimezone(match.timezone);
                        }
                      }}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {COUNTRIES.map((c) => (
                        <option key={c.countryCode} value={c.country}>
                          {c.flag} {c.country} ({c.code})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700">Reporting Currency</label>
                    <select
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="USD">USD ($)</option>
                      <option value="INR">INR (₹)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                      <option value="CAD">CAD (CA$)</option>
                      <option value="AUD">AUD (A$)</option>
                      <option value="JPY">JPY (¥)</option>
                      <option value="SGD">SGD (S$)</option>
                      <option value="AED">AED (AED)</option>
                      <option value="CHF">CHF (CHF)</option>
                      <option value="BRL">BRL (R$)</option>
                      <option value="ZAR">ZAR (R)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700">Primary Timezone</label>
                    <input
                      type="text"
                      value={timezone}
                      onChange={(e) => setTimezone(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Organization ID */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-700">Organization Tenant Identifier (UUID)</span>
                    <button
                      type="button"
                      onClick={handleCopyOrgId}
                      className="text-blue-600 hover:text-blue-700 font-bold flex items-center gap-1"
                    >
                      {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedId ? "Copied" : "Copy UUID"}</span>
                    </button>
                  </div>
                  <code className="text-[11px] text-slate-500 font-mono block truncate">
                    {activeOrg?.id || "e5f70261-25d6-481d-b743-dc797d5fa487"}
                  </code>
                </div>

                {saveSuccess && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Organization settings updated successfully.</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow transition flex items-center gap-2"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Organization Changes</span>
                </button>
              </form>
            </div>
          )}

          {/* TAB 2: SUBSCRIPTION & BILLING (Task 4) */}
          {activeTab === "Subscription" && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-lg font-bold text-slate-900">Subscription &amp; Free Trial Management</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Track your 14-day free trial countdown, manage billing cycles, and activate subscription payments.
                </p>
              </div>

              {/* 14-Day Free Trial Countdown Widget */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-blue-900 to-slate-900 text-white space-y-4 shadow-lg">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-blue-300 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      Active 14-Day Free Trial
                    </span>
                    <h3 className="text-xl font-black tracking-tight">
                      {selectedPlanTier} Plan Free Trial
                    </h3>
                  </div>

                  <button
                    onClick={() => setShowCheckoutModal(true)}
                    className="px-5 py-2.5 bg-blue-500 hover:bg-blue-400 text-white rounded-xl text-xs font-bold shadow transition shrink-0"
                  >
                    Activate Paid Subscription
                  </button>
                </div>

                {/* Countdown Time Boxes */}
                <div className="grid grid-cols-3 gap-3 max-w-sm pt-2">
                  <div className="bg-white/10 rounded-2xl p-3 text-center border border-white/15">
                    <span className="text-2xl font-black block tracking-tight">{trialInfo.days}</span>
                    <span className="text-[10px] text-slate-300 font-semibold uppercase">Days</span>
                  </div>
                  <div className="bg-white/10 rounded-2xl p-3 text-center border border-white/15">
                    <span className="text-2xl font-black block tracking-tight">{trialInfo.hours}</span>
                    <span className="text-[10px] text-slate-300 font-semibold uppercase">Hours</span>
                  </div>
                  <div className="bg-white/10 rounded-2xl p-3 text-center border border-white/15">
                    <span className="text-2xl font-black block tracking-tight">{trialInfo.minutes}</span>
                    <span className="text-[10px] text-slate-300 font-semibold uppercase">Minutes</span>
                  </div>
                </div>

                {/* Trial Progress Bar */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between text-[11px] text-slate-300">
                    <span>Trial Progress</span>
                    <span>{trialInfo.isExpired ? "Expired" : `${trialInfo.percent}% remaining`}</span>
                  </div>
                  <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-400 rounded-full transition-all duration-500"
                      style={{ width: `${trialInfo.percent}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Plan Tier Selection */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Available Subscription Tiers</h4>
                  <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
                    <button
                      onClick={() => setBillingCycle("annual")}
                      className={`px-3 py-1 rounded-lg transition ${
                        billingCycle === "annual" ? "bg-white text-blue-700 shadow-2xs font-bold" : "text-slate-600"
                      }`}
                    >
                      Annual (Save 20%)
                    </button>
                    <button
                      onClick={() => setBillingCycle("monthly")}
                      className={`px-3 py-1 rounded-lg transition ${
                        billingCycle === "monthly" ? "bg-white text-blue-700 shadow-2xs font-bold" : "text-slate-600"
                      }`}
                    >
                      Monthly
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    {
                      name: "Starter",
                      tier: "STARTER",
                      annual: formatPlanPrice(159, currency, country),
                      monthly: formatPlanPrice(199, currency, country),
                      features: ["25k monthly order lines", "POS & sales analytics", "Email support (24h SLA)"],
                    },
                    {
                      name: "Growth",
                      tier: "GROWTH",
                      annual: formatPlanPrice(399, currency, country),
                      monthly: formatPlanPrice(499, currency, country),
                      popular: true,
                      features: ["250k monthly order lines", "XGBoost customer churn", "PyTorch deep learning & Copilot"],
                    },
                    {
                      name: "Enterprise",
                      tier: "ENTERPRISE",
                      annual: formatPlanPrice(1049, currency, country),
                      monthly: formatPlanPrice(1299, currency, country),
                      features: ["Unlimited records", "Multi-warehouse BOM", "Dedicated support & 99.9% SLA"],
                    },
                  ].map((plan) => (
                    <div
                      key={plan.tier}
                      onClick={() => setSelectedPlanTier(plan.tier)}
                      className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                        selectedPlanTier === plan.tier
                          ? "border-blue-600 bg-blue-50/40 shadow-md ring-2 ring-blue-500/10"
                          : "border-slate-200 hover:border-slate-300 bg-white"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-slate-900">{plan.name}</span>
                        {plan.popular && (
                          <span className="bg-blue-600 text-white text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase">
                            Recommended
                          </span>
                        )}
                      </div>
                      <div className="mt-3">
                        <span className="text-2xl font-black text-slate-900">
                          {billingCycle === "annual" ? plan.annual : plan.monthly}
                        </span>
                        <span className="text-xs text-slate-400"> / month</span>
                      </div>
                      <ul className="mt-4 space-y-1.5 text-[11px] text-slate-600 border-t border-slate-100 pt-3">
                        {plan.features.map((f, i) => (
                          <li key={i} className="flex items-center gap-1.5">
                            <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Methods & Invoices */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                <div className="p-5 rounded-2xl border border-slate-200 space-y-2">
                  <h4 className="text-xs font-bold text-slate-900">Payment Settlement Methods</h4>
                  <p className="text-[11px] text-slate-500">
                    We accept Visa, Mastercard, American Express, UPI (India), SEPA (EU), and Corporate Bank Wire.
                  </p>
                  <button
                    onClick={() => setShowCheckoutModal(true)}
                    className="mt-2 px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-800 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                  >
                    <CreditCard className="w-3.5 h-3.5 text-blue-600" />
                    <span>Manage Payment Cards</span>
                  </button>
                </div>

                <div className="p-5 rounded-2xl border border-slate-200 space-y-2">
                  <h4 className="text-xs font-bold text-slate-900">Tax Invoices &amp; Receipts</h4>
                  <p className="text-[11px] text-slate-500">
                    Tax-compliant invoices (GST in India, VAT in Europe &amp; UK) generated on every billing cycle.
                  </p>
                  <span className="inline-block text-[11px] text-emerald-600 font-semibold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100 mt-2">
                    Zero unpaid invoices
                  </span>
                </div>
              </div>

              {/* Checkout / Pay Subscription Amount Modal */}
              {showCheckoutModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
                  <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-in fade-in zoom-in-95">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <div>
                        <h3 className="text-base font-bold text-slate-900">Confirm Subscription Activation</h3>
                        <p className="text-xs text-slate-500 mt-0.5">{selectedPlanTier} Plan ({billingCycle})</p>
                      </div>
                      <button
                        onClick={() => setShowCheckoutModal(false)}
                        className="text-slate-400 hover:text-slate-600 text-lg font-bold"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="p-4 bg-blue-50 rounded-2xl border border-blue-200 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-700">Plan Amount</span>
                        <span className="font-black text-slate-900">
                          {formatPlanPrice(
                            selectedPlanTier === "STARTER"
                              ? billingCycle === "annual" ? 159 : 199
                              : selectedPlanTier === "GROWTH"
                              ? billingCycle === "annual" ? 399 : 499
                              : billingCycle === "annual" ? 1049 : 1299,
                            currency,
                            country
                          )}
                          /mo
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-700">Billing Schedule</span>
                        <span className="font-bold text-slate-700 capitalize">{billingCycle}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs pt-2 border-t border-blue-200">
                        <span className="font-bold text-blue-900">Due Today</span>
                        <span className="font-black text-blue-900 text-base">
                          {formatPlanPrice(0, currency, country)} (14-Day Free Trial)
                        </span>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Your 14-day free trial will continue uninterrupted. Payment will only be processed once your 14-day countdown concludes. You may cancel anytime before expiration with zero penalty.
                    </p>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setShowCheckoutModal(false)}
                        className="w-1/2 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          setCheckoutSuccess(true);
                          setTimeout(() => {
                            setCheckoutSuccess(false);
                            setShowCheckoutModal(false);
                          }, 2000);
                        }}
                        className="w-1/2 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow transition flex items-center justify-center gap-1.5"
                      >
                        {checkoutSuccess ? (
                          <>
                            <Check className="w-4 h-4 text-emerald-400" />
                            <span>Activated!</span>
                          </>
                        ) : (
                          <>
                            <Zap className="w-3.5 h-3.5 fill-current" />
                            <span>Confirm Plan</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: USER PROFILE */}
          {activeTab === "Profile" && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-lg font-bold text-slate-900">Your User Profile</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Update your contact details, security credentials, and view email verification status.
                </p>
              </div>

              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white font-extrabold text-xl flex items-center justify-center shadow-sm">
                  {profileName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{profileName}</h4>
                  <p className="text-xs text-slate-500">{profileEmail}</p>
                  <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 mt-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    Google SMTP Verified
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">Full Name</label>
                  <input
                    type="text"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">Email Address (Login Identifier)</label>
                  <input
                    type="email"
                    disabled
                    value={profileEmail}
                    className="w-full px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-500 cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Password Change Card */}
              <div className="p-5 rounded-2xl border border-slate-200 space-y-4 pt-4">
                <h4 className="text-xs font-bold text-slate-900">Change Account Password</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-semibold text-slate-600">Current Password</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-semibold text-slate-600">New Password</label>
                    <input
                      type="password"
                      placeholder="Minimum 8 characters"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: INTEGRATIONS */}
          {activeTab === "Integrations" && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-lg font-bold text-slate-900">Database &amp; Platform Integrations</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Connected enterprise databases, memory caches, and cloud object storage services.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">Neon PostgreSQL</span>
                    <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                      Connected
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Primary relational database with automatic connection pooling and Row-Level Security.
                  </p>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">Upstash Redis</span>
                    <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                      Connected
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    TLS-encrypted in-memory cache and background job coordination broker.
                  </p>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">Neon S3 Document Storage</span>
                    <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                      Connected
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    S3-compatible bucket storage with AES-256 server-side encryption for datasets and reports.
                  </p>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">Google Gemini 2.5 Flash</span>
                    <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                      Connected
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Generative AI Decision Copilot grounded directly in database queries and SQL tools.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: SECURITY & COMPLIANCE */}
          {activeTab === "Security" && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-lg font-bold text-slate-900">Enterprise Security &amp; Compliance</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Multi-tenant isolation policies, encryption standards, and authentication parameters.
                </p>
              </div>

              <div className="divide-y divide-slate-100 space-y-4">
                <div className="flex items-center justify-between pt-2">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">PostgreSQL Row-Level Security (RLS)</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Strict organization-level data segregation enforced at the database kernel level.
                    </p>
                  </div>
                  <span className="text-xs text-emerald-600 font-bold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                    Active &amp; Enforced
                  </span>
                </div>

                <div className="flex items-center justify-between pt-4">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Password Encryption Standard</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Argon2id state-of-the-art memory-hard cryptographic password hashing.
                    </p>
                  </div>
                  <span className="text-xs text-slate-700 font-semibold bg-slate-100 px-3 py-1 rounded-full">
                    Argon2id Active
                  </span>
                </div>

                <div className="flex items-center justify-between pt-4">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Session Inactivity Timeout</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Automatically revoke session tokens after prolonged inactivity.
                    </p>
                  </div>
                  <select className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700">
                    <option value="24h">24 Hours (Default)</option>
                    <option value="8h">8 Hours</option>
                    <option value="1h">1 Hour</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: NOTIFICATIONS */}
          {activeTab === "Notifications" && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-lg font-bold text-slate-900">Alerts &amp; Notification Rules</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Configure automated email dispatch and webhook triggers for operational signals.
                </p>
              </div>

              <div className="space-y-3">
                {[
                  {
                    key: "trialExpiry",
                    title: "Free Trial Expiration Notice",
                    desc: "Receive alert 3 days and 24 hours prior to 14-day free trial completion.",
                  },
                  {
                    key: "anomalyDrops",
                    title: "Profit Margin Anomaly Detection",
                    desc: "Instant email alert when product line margins drop below threshold.",
                  },
                  {
                    key: "inventoryStockout",
                    title: "Stockout Risk Warnings",
                    desc: "Proactive alert when high-velocity SKUs hit reorder point.",
                  },
                  {
                    key: "weeklyReport",
                    title: "Weekly Profit & Loss Digest",
                    desc: "Executive summary delivered every Monday at 9:00 AM.",
                  },
                ].map((item) => (
                  <div
                    key={item.key}
                    className="p-4 rounded-2xl border border-slate-200 flex items-center justify-between"
                  >
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{item.title}</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">{item.desc}</p>
                    </div>
                    <input
                      type="checkbox"
                      defaultChecked
                      className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                    />
                  </div>
                ))}
              </div>

              {/* Slack Webhook Input */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 pt-3">
                <h4 className="text-xs font-bold text-slate-900">Slack Incoming Webhook URL</h4>
                <p className="text-[11px] text-slate-500">
                  Broadcast anomaly alerts directly into your private Slack #business-alerts channel.
                </p>
                <input
                  type="url"
                  placeholder="https://hooks.slack.com/services/T00/B00/XXXX"
                  value={slackWebhook}
                  onChange={(e) => setSlackWebhook(e.target.value)}
                  className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
