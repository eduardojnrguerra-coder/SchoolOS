import { createSupabaseBrowserClient } from "@/src/lib/supabase";

export function getSupabaseClient() {
  return createSupabaseBrowserClient();
}
