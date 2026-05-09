"use client";

import { AppRole, getRoleLandingPath } from "@/lib/auth";
import { createSupabaseBrowserClient } from "@/src/lib/supabase";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type AuthUser = {
  id: string;
  fullName: string;
  email: string;
  role: AppRole;
  schoolId: string;
  schoolName: string;
  isDemo: boolean;
};

type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  loginDemo: (role: AppRole) => void;
  loginWithEmail: (email: string, password: string) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);
const storageKey = "pine-x-demo-user";

type SupabaseUserProfile = {
  id: string;
  school_id: string | null;
  full_name: string | null;
  email: string | null;
  schools?: { name?: string | null } | Array<{ name?: string | null }> | null;
  user_roles?: Array<{ role?: AppRole | null }> | null;
};

const demoUsers: Record<AppRole, AuthUser> = {
  SUPER_ADMIN: demoUser("SUPER_ADMIN", "Platform Admin"),
  SCHOOL_ADMIN: demoUser("SCHOOL_ADMIN", "Ava Petersen"),
  PRINCIPAL: demoUser("PRINCIPAL", "Liam Fourie"),
  TEACHER: demoUser("TEACHER", "Mia Roman"),
  FINANCE: demoUser("FINANCE", "Finance Demo"),
  TRANSPORT_MANAGER: demoUser("TRANSPORT_MANAGER", "Transport Demo"),
  AFTERCARE_STAFF: demoUser("AFTERCARE_STAFF", "Aftercare Demo"),
  PARENT: demoUser("PARENT", "Guardian 1")
};

function demoUser(role: AppRole, fullName: string): AuthUser {
  return {
    id: `demo_${role.toLowerCase()}`,
    fullName,
    email: `${role.toLowerCase()}@demo.pine-x.local`,
    role,
    schoolId: "school_hva",
    schoolName: "Hermanus Valley Academy",
    isDemo: true
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const stored = window.localStorage.getItem(storageKey);
    if (stored) setUser(JSON.parse(stored));
    setLoading(false);
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    loading,
    loginDemo(role) {
      const nextUser = demoUsers[role];
      setUser(nextUser);
      window.localStorage.setItem(storageKey, JSON.stringify(nextUser));
      router.push(getRoleLandingPath(role));
    },
    async loginWithEmail(email, password) {
      const supabase = createSupabaseBrowserClient();
      if (!supabase) return { error: "Supabase is not configured. Use demo login or add environment variables." };
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return { error: error.message };

      const { data: profile } = await supabase
        .from("users")
        .select("id, school_id, full_name, email, schools(name), user_roles(role)")
        .eq("auth_user_id", data.user.id)
        .maybeSingle<SupabaseUserProfile>();
      const schoolRelation = Array.isArray(profile?.schools) ? profile?.schools[0] : profile?.schools;
      const profileRole = profile?.user_roles?.[0]?.role;

      // Frontend role state is a convenience only. Supabase RLS must enforce the same restrictions server-side.
      const authUser: AuthUser = {
        id: profile?.id ?? data.user.id,
        fullName: profile?.full_name ?? data.user.email ?? "Supabase User",
        email: profile?.email ?? data.user.email ?? email,
        role: profileRole ?? (data.user.user_metadata.role as AppRole) ?? "PARENT",
        schoolId: profile?.school_id ?? data.user.user_metadata.school_id ?? "",
        schoolName: schoolRelation?.name ?? data.user.user_metadata.school_name ?? "Selected school",
        isDemo: false
      };
      setUser(authUser);
      window.localStorage.setItem(storageKey, JSON.stringify(authUser));
      router.push(getRoleLandingPath(authUser.role));
      return {};
    },
    async logout() {
      const supabase = createSupabaseBrowserClient();
      if (supabase) await supabase.auth.signOut();
      setUser(null);
      window.localStorage.removeItem(storageKey);
      router.push("/login");
    }
  }), [loading, router, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
