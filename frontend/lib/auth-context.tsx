"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { apiClient } from "./api";

export interface Organization {
  id: string;
  name: string;
  slug: string;
  business_type: "RETAIL" | "MANUFACTURING" | "WHOLESALE" | "DISTRIBUTION";
  currency: string;
  timezone: string;
  country: string;
  subscription_plan: string;
  trial_ends_at?: string;
  subscription_status?: string;
  is_active: boolean;
  user_role?: string;
}

export interface User {
  id: string;
  email: string;
  full_name: string;
  is_active: boolean;
  is_superadmin: boolean;
  is_verified?: boolean;
  organizations: Organization[];
  active_organization_id?: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  fullName: string;
  organizationName?: string;
  businessType?: string;
  country?: string;
  currency?: string;
  timezone?: string;
  subscriptionPlan?: string;
}

interface AuthContextType {
  user: User | null;
  activeOrg: Organization | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string, orgId?: string) => Promise<void>;
  register: (payloadOrEmail: RegisterPayload | string, password?: string, fullName?: string, orgName?: string, bizType?: string) => Promise<{ requiresVerification?: boolean }>;
  verifyEmail: (email: string, code: string) => Promise<{ status: string; message: string }>;
  resendVerification: (email: string) => Promise<{ status: string; message: string }>;
  switchOrg: (orgId: string) => Promise<void>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const activeOrg = user?.organizations?.find((o) => o.id === user.active_organization_id) || user?.organizations?.[0] || null;

  const refreshProfile = async () => {
    try {
      const profile = await apiClient<User>("/auth/me");
      setUser(profile);
      if (profile.active_organization_id) {
        localStorage.setItem("marginpilot_active_org_id", profile.active_organization_id);
      }
    } catch (err) {
      console.error("Failed to fetch user profile:", err);
      logout();
    }
  };

  useEffect(() => {
    const savedToken = localStorage.getItem("marginpilot_token");
    if (savedToken) {
      setToken(savedToken);
      refreshProfile().finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string, orgId?: string) => {
    const res = await apiClient<{ access_token: string; active_organization_id: string; role: string }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password, organization_id: orgId }),
    });
    localStorage.setItem("marginpilot_token", res.access_token);
    if (res.active_organization_id) {
      localStorage.setItem("marginpilot_active_org_id", res.active_organization_id);
    }
    setToken(res.access_token);
    await refreshProfile();
  };

  const register = async (
    payloadOrEmail: RegisterPayload | string,
    password?: string,
    fullName?: string,
    orgName?: string,
    bizType?: string
  ): Promise<{ requiresVerification?: boolean }> => {
    let requestBody: any = {};
    if (typeof payloadOrEmail === "object") {
      requestBody = {
        email: payloadOrEmail.email,
        password: payloadOrEmail.password,
        full_name: payloadOrEmail.fullName,
        organization_name: payloadOrEmail.organizationName,
        business_type: payloadOrEmail.businessType || "RETAIL",
        country: payloadOrEmail.country || "United States",
        currency: payloadOrEmail.currency || "USD",
        timezone: payloadOrEmail.timezone || "UTC",
        subscription_plan: payloadOrEmail.subscriptionPlan || "GROWTH",
      };
    } else {
      requestBody = {
        email: payloadOrEmail,
        password,
        full_name: fullName,
        organization_name: orgName,
        business_type: bizType || "RETAIL",
      };
    }

    const res = await apiClient<{
      access_token: string;
      active_organization_id: string;
      role: string;
      requires_verification?: boolean;
    }>("/auth/register", {
      method: "POST",
      body: JSON.stringify(requestBody),
    });

    localStorage.setItem("marginpilot_token", res.access_token);
    if (res.active_organization_id) {
      localStorage.setItem("marginpilot_active_org_id", res.active_organization_id);
    }
    setToken(res.access_token);
    await refreshProfile();
    return { requiresVerification: res.requires_verification ?? true };
  };

  const verifyEmail = async (email: string, code: string) => {
    const res = await apiClient<{ status: string; message: string }>("/auth/verify-email", {
      method: "POST",
      body: JSON.stringify({ email, code }),
    });
    await refreshProfile();
    return res;
  };

  const resendVerification = async (email: string) => {
    const res = await apiClient<{ status: string; message: string }>("/auth/resend-verification", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
    return res;
  };

  const switchOrg = async (orgId: string) => {
    const res = await apiClient<{ access_token: string; active_organization_id: string; role: string }>("/auth/switch-org", {
      method: "POST",
      body: JSON.stringify({ organization_id: orgId }),
    });
    localStorage.setItem("marginpilot_token", res.access_token);
    localStorage.setItem("marginpilot_active_org_id", res.active_organization_id);
    setToken(res.access_token);
    await refreshProfile();
  };

  const logout = () => {
    localStorage.removeItem("marginpilot_token");
    localStorage.removeItem("marginpilot_active_org_id");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        activeOrg,
        token,
        isLoading,
        login,
        register,
        verifyEmail,
        resendVerification,
        switchOrg,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
