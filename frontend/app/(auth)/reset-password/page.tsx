"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, Eye, EyeOff, AlertCircle, CheckCircle2, ArrowRight, ArrowLeft, Loader2, KeyRound } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { apiClient } from "@/lib/api";

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { resetPassword } = useAuth();

  const token = searchParams.get("token") || "";
  const email = searchParams.get("email") || "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isValidating, setIsValidating] = useState(true);
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);
  const [recipientName, setRecipientName] = useState<string>("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // Validate the reset token on page mount
  useEffect(() => {
    async function verifyToken() {
      if (!token || !email) {
        setTokenValid(false);
        setError("Invalid password reset link. Missing security token or email parameter.");
        setIsValidating(false);
        return;
      }

      try {
        const res = await apiClient<{ status: string; email: string; full_name?: string }>(
          `/auth/verify-reset-token?token=${encodeURIComponent(token)}&email=${encodeURIComponent(email)}`
        );
        setTokenValid(true);
        if (res.full_name) {
          setRecipientName(res.full_name);
        }
      } catch (err: any) {
        setTokenValid(false);
        setError(err.message || "This password reset link is invalid or has expired.");
      } finally {
        setIsValidating(false);
      }
    }

    verifyToken();
  }, [token, email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match. Please verify your entry.");
      return;
    }

    setIsSubmitting(true);

    try {
      await resetPassword({
        email,
        token,
        new_password: newPassword,
      });
      setIsSuccess(true);
    } catch (err: any) {
      setError(err.message || "Failed to reset password. The link may have expired.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 selection:bg-blue-600 selection:text-white">
      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-sm p-8 space-y-6">
        {/* Brand Logo & Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
              M
            </div>
            <div className="flex items-center">
              <span className="font-extrabold text-xl text-slate-900 tracking-tight">MarginPilot</span>
              <span className="text-blue-600 font-bold text-xs ml-1.5 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                AI
              </span>
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            {isSuccess ? "Password Reset Complete" : "Choose New Password"}
          </h1>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            {isSuccess
              ? "Your password has been successfully updated. You may now sign in."
              : recipientName
              ? `Hello ${recipientName}, enter your new secure password below.`
              : "Set a strong new password for your MarginPilot AI account."}
          </p>
        </div>

        {/* Loading Spinner during Token Validation */}
        {isValidating && (
          <div className="py-12 flex flex-col items-center justify-center space-y-3 text-slate-500">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            <p className="text-xs font-medium">Verifying reset token security...</p>
          </div>
        )}

        {/* Invalid Token Screen */}
        {!isValidating && tokenValid === false && (
          <div className="space-y-5">
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 space-y-2">
              <div className="flex items-center gap-2 font-bold text-rose-900">
                <AlertCircle className="w-4 h-4 text-rose-600" />
                <span>Link Expired or Invalid</span>
              </div>
              <p>
                {error || "This password reset link is invalid or has already been used. Password reset links are strictly single-use and expire after 30 minutes."}
              </p>
            </div>

            <Link
              href="/forgot-password"
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-sm transition flex items-center justify-center gap-2"
            >
              <span>Request a New Reset Link</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <div className="text-center pt-2">
              <Link href="/login" className="text-xs text-slate-500 hover:text-slate-800 transition">
                Return to Sign In
              </Link>
            </div>
          </div>
        )}

        {/* Success Screen */}
        {!isValidating && isSuccess && (
          <div className="space-y-5">
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <h2 className="text-sm font-bold text-emerald-900">Your Password Has Been Updated</h2>
              <p className="text-xs text-emerald-700">
                You can now log in to your MarginPilot AI workspace using your new password.
              </p>
            </div>

            <Link
              href="/login"
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold shadow-sm transition flex items-center justify-center gap-2"
            >
              <span>Proceed to Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        {/* Password Reset Form */}
        {!isValidating && tokenValid && !isSuccess && (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">New Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="At least 8 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full pl-9 pr-10 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Confirm New Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  placeholder="Re-type your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-9 pr-10 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Password Validation Hints */}
            <div className="text-[11px] space-y-1 pt-1 text-slate-500">
              <div className="flex items-center gap-1.5">
                <span className={newPassword.length >= 8 ? "text-emerald-600 font-bold" : "text-slate-400"}>
                  {newPassword.length >= 8 ? "✓" : "•"}
                </span>
                <span>Minimum 8 characters</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span
                  className={
                    confirmPassword && newPassword === confirmPassword
                      ? "text-emerald-600 font-bold"
                      : "text-slate-400"
                  }
                >
                  {confirmPassword && newPassword === confirmPassword ? "✓" : "•"}
                </span>
                <span>Passwords match</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || newPassword.length < 8 || newPassword !== confirmPassword}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Updating password...</span>
                </>
              ) : (
                <>
                  <KeyRound className="w-4 h-4" />
                  <span>Reset Password</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* Back Link */}
        <div className="pt-2 text-center border-t border-slate-100">
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 font-medium transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Sign In</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
            <span>Loading...</span>
          </div>
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
