import { createClient, SupabaseClient } from "@supabase/supabase-js";

let browserClient: SupabaseClient | null = null;

function readPublicSupabaseEnv() {
  return {
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL?.trim(),
    supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()
  };
}

export function hasSupabaseBrowserConfig() {
  const { supabaseUrl, supabaseAnonKey } = readPublicSupabaseEnv();
  return Boolean(supabaseUrl && supabaseAnonKey);
}

export function createSupabaseBrowserClient(): SupabaseClient | null {
  const { supabaseUrl, supabaseAnonKey } = readPublicSupabaseEnv();
  if (!supabaseUrl || !supabaseAnonKey) return null;
  if (typeof window === "undefined") {
    return createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    });
  }
  if (!browserClient) {
    browserClient = createClient(supabaseUrl, supabaseAnonKey);
  }
  return browserClient;
}

export function createSupabaseServerClient(): SupabaseClient | null {
  const { supabaseUrl, supabaseAnonKey } = readPublicSupabaseEnv();
  if (!supabaseUrl || !supabaseAnonKey) return null;
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });
}

export function createSupabaseServiceRoleClient(): SupabaseClient | null {
  if (typeof window !== "undefined") {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY must never be used in client-side code.");
  }
  const { supabaseUrl } = readPublicSupabaseEnv();
  // Production setup: use this only from server actions, route handlers, or trusted background jobs.
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!supabaseUrl || !supabaseServiceRoleKey) return null;
  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });
}
