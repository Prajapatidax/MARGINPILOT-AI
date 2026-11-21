"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Mail,
  Lock,
  User as UserIcon,
  Building2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Globe2,
  Clock,
  Sparkles,
  ShieldCheck,
  Check,
  Zap,
  KeyRound,
  RefreshCw,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import {
  COUNTRIES,
  CountryCurrency,
  findCountryCurrency,
  formatPlanPrice,
} from "@/lib/currencies";

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { register, verifyEmail, resendVerification } = useAuth();

  // Multi-step registration state: 1 = Account, 2 = Organization, 3 = Subscription Plan, 4 = Email Verification
  const [step, setStep] = useState<number>(1);

  // Form State
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Organization Settings (Task 2)
  const initialCurrency = searchParams.get("currency") || "USD";
  const initialCountry =
    COUNTRIES.find((c) => c.code.toUpperCase() === initialCurrency.toUpperCase()) || COUNTRIES[0];

  const [organizationName, setOrganizationName] = useState("");
  const [businessType, setBusinessType] = useState<string>("RETAIL");
  const [selectedCountry, setSelectedCountry] = useState<CountryCurrency>(initialCountry);
  const [currency, setCurrency] = useState<string>(initialCountry.code);
  const [timezone, setTimezone] = useState<string>(initialCountry.timezone);
  const [fiscalYearStart, setFiscalYearStart] = useState<string>(
    initialCountry.countryCode === "IN" || initialCountry.countryCode === "GB" ? "April" : "January"
  );

  // Subscription Plan (Task 4)
  const initialPlan = searchParams.get("plan")?.toUpperCase() || "GROWTH";
  const [subscriptionPlan, setSubscriptionPlan] = useState<string>(
    ["STARTER", "GROWTH", "ENTERPRISE"].includes(initialPlan) ? initialPlan : "GROWTH"
  );

  // Email Verification State (Task 7)
  const [verificationCode, setVerificationCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resendNotice, setResendNotice] = useState<string | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCountryChange = (countryName: string) => {
    const found = COUNTRIES.find((c) => c.country === countryName) || COUNTRIES[0];
    setSelectedCountry(found);
    setCurrency(found.code);
    setTimezone(found.timezone);
    if (found.countryCode === "IN" || found.countryCode === "GB") {
      setFiscalYearStart("April");
    } else {
      setFiscalYearStart("January");
    }
  };

  const handleCurrencyChange = (newCurrencyCode: string) => {
    setCurrency(newCurrencyCode);
    const matching = COUNTRIES.find((c) => c.code === newCurrencyCode);
    if (matching) {
      setSelectedCountry(matching);
      setTimezone(matching.timezone);
      if (matching.countryCode === "IN" || matching.countryCode === "GB") {
        setFiscalYearStart("April");
      }
    }
  };

  const handleCreateAccount = async () => {
    setError(null);
    setIsSubmitting(true);

    try {
      await register({
        email,
        password,
        fullName,
        organizationName,
        businessType,
        country: selectedCountry.country,
        currency,
        timezone,
        subscriptionPlan,
      });

      // Move to Google SMTP verification step
      setStep(4);
      setResendCooldown(45);
    } catch (err: any) {
      setError(err.message || "Failed to create workspace. Please check your inputs.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verificationCode || verificationCode.length < 6) {
      setError("Please enter the 6-digit code sent to your email.");
      return;
    }
    setError(null);
    setIsVerifying(true);

    try {
      await verifyEmail(email, verificationCode);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Invalid or expired code. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    try {
      await resendVerification(email);
      setResendNotice("A fresh 6-digit code has been sent via Google SMTP.");
      setResendCooldown(60);
      setTimeout(() => setResendNotice(null), 5000);
    } catch (err: any) {
      setError(err.message || "Failed to resend code.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6 selection:bg-blue-600 selection:text-white">
      <div className="w-full max-w-2xl bg-white rounded-3xl border border-slate-200 shadow-xl p-8 sm:p-10 space-y-8">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-extrabold text-xl shadow-md transition-transform group-hover:scale-105">
              M
            </div>
            <div className="flex items-center">
              <span className="font-extrabold text-2xl text-slate-900 tracking-tight">MarginPilot</span>
              <span className="text-blue-600 font-bold text-xs ml-1.5 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                AI
              </span>
            </div>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {step === 4 ? "Verify Your Email" : "Create Your Enterprise Workspace"}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            {step === 4
              ? "We sent a 6-digit verification code to your email address"
              : "Set up your organization, customize regional settings, and start your 14-day free trial"}
          </p>
        </div>

        {/* Step Progress Bar (Steps 1 to 3) */}
        {step < 4 && (
          <div className="flex items-center justify-between relative px-2">
            <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-0.5 bg-slate-100 -z-0" />
            {[
              { num: 1, label: "Your Profile" },
              { num: 2, label: "Organization" },
              { num: 3, label: "Subscription Plan" },
            ].map((s) => (
              <div key={s.num} className="flex flex-col items-center gap-1.5 z-10 bg-white px-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    step === s.num
                      ? "bg-blue-600 text-white shadow-md ring-4 ring-blue-100"
                      : step > s.num
                      ? "bg-emerald-500 text-white"
                      : "bg-slate-100 text-slate-400"
                  }`}
                >
                  {step > s.num ? <Check className="w-4 h-4" /> : s.num}
                </div>
                <span className={`text-[11px] font-semibold ${step >= s.num ? "text-slate-900" : "text-slate-400"}`}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="p-3.5 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-xs flex items-center gap-3">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span className="flex-1">{error}</span>
          </div>
        )}

        {/* Step 1: User Profile */}
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">Full Name *</label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Jane Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">Work Email *</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="e.g. jane@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                />
              </div>
              <p className="text-[11px] text-slate-400">A 6-digit Google SMTP verification code will be sent here.</p>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">Password *</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="At least 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                if (!fullName || !email || !password) {
                  setError("Please fill in all profile fields before continuing.");
                  return;
                }
                if (password.length < 8) {
                  setError("Password must be at least 8 characters.");
                  return;
                }
                setError(null);
                setStep(2);
              }}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow transition flex items-center justify-center gap-2 mt-4"
            >
              <span>Continue to Organization Setup</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Step 2: Organization Settings (Task 2) */}
        {step === 2 && (
          <div className="space-y-4 animate-in fade-in">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">Company / Organization Name *</label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Acme Global Logistics Ltd."
                  value={organizationName}
                  onChange={(e) => setOrganizationName(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">Business Industry Vertical *</label>
                <select
                  value={businessType}
                  onChange={(e) => setBusinessType(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                >
                  <option value="RETAIL">Retail (POS, Stores, Promotions)</option>
                  <option value="MANUFACTURING">Manufacturing (Batches, BOM, Machine Sensors)</option>
                  <option value="WHOLESALE">Wholesale (Bulk Orders, Tiered Pricing)</option>
                  <option value="DISTRIBUTION">Distribution (Warehouses, Route Logistics)</option>
                </select>
              </div>

              {/* Country Selection showing all available countries with flags */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">Country / Operating Region *</label>
                <select
                  value={selectedCountry.country}
                  onChange={(e) => handleCountryChange(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                >
                  {COUNTRIES.map((c) => (
                    <option key={c.countryCode} value={c.country}>
                      {c.flag} {c.country} ({c.countryCode})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">Reporting Currency *</label>
                <select
                  value={currency}
                  onChange={(e) => handleCurrencyChange(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                >
                  {COUNTRIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.code} ({c.symbol.trim()}) — {c.country}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700">Timezone *</label>
                <input
                  type="text"
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-5 py-3 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!organizationName) {
                    setError("Please provide a name for your organization.");
                    return;
                  }
                  setError(null);
                  setStep(3);
                }}
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow transition flex items-center justify-center gap-2"
              >
                <span>Continue to Subscription Plan</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Subscription Plan Selection (Task 4) */}
        {step === 3 && (
          <div className="space-y-5 animate-in fade-in">
            <div className="text-center space-y-1 pb-1">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                <Zap className="w-3.5 h-3.5" />
                <span>14-Day Free Trial • {formatPlanPrice(0, currency, selectedCountry.country)} Due Today</span>
              </div>
              <p className="text-xs text-slate-500 pt-1">
                Prices shown in {currency} ({findCountryCurrency(currency, selectedCountry.country).symbol.trim()}) for {selectedCountry.country}. 14-day free trial starts today.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              {/* Starter */}
              <div
                onClick={() => setSubscriptionPlan("STARTER")}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  subscriptionPlan === "STARTER"
                    ? "border-blue-600 bg-blue-50/40 shadow-sm"
                    : "border-slate-200 hover:border-slate-300 bg-white"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">Starter</span>
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      subscriptionPlan === "STARTER" ? "border-blue-600 bg-blue-600 text-white" : "border-slate-300"
                    }`}
                  >
                    {subscriptionPlan === "STARTER" && <Check className="w-2.5 h-2.5" />}
                  </div>
                </div>
                <div className="mt-2">
                  <span className="text-lg font-black text-slate-900">
                    {formatPlanPrice(159, currency, selectedCountry.country)}
                  </span>
                  <span className="text-[10px] text-slate-400"> /mo</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-2">
                  Essential analytics &amp; margin monitoring for single-entity retailers.
                </p>
              </div>

              {/* Growth - Recommended */}
              <div
                onClick={() => setSubscriptionPlan("GROWTH")}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all relative ${
                  subscriptionPlan === "GROWTH"
                    ? "border-blue-600 bg-blue-50/50 shadow-md ring-2 ring-blue-500/20"
                    : "border-slate-200 hover:border-slate-300 bg-white"
                }`}
              >
                <span className="absolute -top-2.5 right-3 bg-blue-600 text-white text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Most Popular
                </span>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">Growth</span>
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      subscriptionPlan === "GROWTH" ? "border-blue-600 bg-blue-600 text-white" : "border-slate-300"
                    }`}
                  >
                    {subscriptionPlan === "GROWTH" && <Check className="w-2.5 h-2.5" />}
                  </div>
                </div>
                <div className="mt-2">
                  <span className="text-lg font-black text-slate-900">
                    {formatPlanPrice(399, currency, selectedCountry.country)}
                  </span>
                  <span className="text-[10px] text-slate-400"> /mo</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-2">
                  PyTorch deep learning, XGBoost customer churn &amp; Gemini AI Copilot.
                </p>
              </div>

              {/* Enterprise */}
              <div
                onClick={() => setSubscriptionPlan("ENTERPRISE")}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  subscriptionPlan === "ENTERPRISE"
                    ? "border-blue-600 bg-blue-50/40 shadow-sm"
                    : "border-slate-200 hover:border-slate-300 bg-white"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">Enterprise</span>
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      subscriptionPlan === "ENTERPRISE" ? "border-blue-600 bg-blue-600 text-white" : "border-slate-300"
                    }`}
                  >
                    {subscriptionPlan === "ENTERPRISE" && <Check className="w-2.5 h-2.5" />}
                  </div>
                </div>
                <div className="mt-2">
                  <span className="text-lg font-black text-slate-900">
                    {formatPlanPrice(1049, currency, selectedCountry.country)}
                  </span>
                  <span className="text-[10px] text-slate-400"> /mo</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-2">
                  Multi-entity ERP integrations, custom models &amp; 99.9% uptime SLA.
                </p>
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center gap-2.5 text-xs text-slate-600">
              <Clock className="w-4 h-4 text-blue-600 shrink-0" />
              <span>
                Free 14-day trial begins immediately. When the trial expires, you can confirm your subscription payment or adjust plans.
              </span>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-5 py-3 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleCreateAccount}
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Zap className="w-4 h-4 fill-current" />
                    <span>Start 14-Day Free Trial &amp; Send Verification Code</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Google SMTP 6-Digit Email Verification (Task 7) */}
        {step === 4 && (
          <form onSubmit={handleVerifyCode} className="space-y-6 animate-in fade-in">
            <div className="p-4 bg-blue-50/70 border border-blue-200/80 rounded-2xl space-y-1.5 text-center">
              <KeyRound className="w-7 h-7 text-blue-600 mx-auto" />
              <p className="text-xs font-bold text-slate-900">Verification Code Sent via Google SMTP</p>
              <p className="text-xs text-slate-600">
                Please enter the 6-digit code sent to <strong className="text-slate-900">{email}</strong>.
              </p>
            </div>

            {resendNotice && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{resendNotice}</span>
              </div>
            )}

            <div className="space-y-2">
              <label className="block text-center text-xs font-bold text-slate-700 uppercase tracking-wider">
                6-Digit Security Code
              </label>
              <input
                type="text"
                maxLength={6}
                required
                autoFocus
                placeholder="123456"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ""))}
                className="w-full text-center text-3xl font-black tracking-[10px] py-3 bg-slate-50 border border-slate-300 rounded-2xl text-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:bg-white focus:border-blue-600 transition"
              />
              <p className="text-center text-[11px] text-slate-400">Code is valid for 15 minutes.</p>
            </div>

            <button
              type="submit"
              disabled={isVerifying || verificationCode.length < 6}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isVerifying ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Verify Email &amp; Launch Dashboard</span>
                </>
              )}
            </button>

            <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => router.push("/dashboard")}
                className="text-slate-500 hover:text-slate-800 font-medium"
              >
                Skip for now &amp; verify later →
              </button>

              <button
                type="button"
                onClick={handleResend}
                disabled={resendCooldown > 0}
                className="text-blue-600 hover:underline font-semibold disabled:text-slate-400 disabled:no-underline flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" />
                <span>{resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : "Resend code"}</span>
              </button>
            </div>
          </form>
        )}

        {/* Footer Login Link */}
        <p className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-600 hover:text-blue-700 font-bold">
            Sign in to your account
          </Link>
        </p>
      </div>
    </div>
  );
}
