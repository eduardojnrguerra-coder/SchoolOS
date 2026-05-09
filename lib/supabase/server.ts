import { createSupabaseServerClient, createSupabaseServiceRoleClient } from "@/src/lib/supabase";

export async function getServerSessionPlaceholder() {
  return null;
}

export const supabaseServer = createSupabaseServerClient;
export const supabaseServiceRole = createSupabaseServiceRoleClient;
