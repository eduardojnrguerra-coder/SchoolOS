import { demoData } from "@/demo-data/seed";
import { DemoDataBundle } from "@/types/domain";
import { hasSupabaseBrowserConfig } from "@/src/lib/supabase";

export type DataMode = "demo" | "supabase";

export function getDataMode(options: { forceDemo?: boolean } = {}): DataMode {
  const forcedDemo = options.forceDemo === true;
  const hasSupabase = hasSupabaseBrowserConfig();
  if (forcedDemo || !hasSupabase) return "demo";
  return "supabase";
}

export function getDemoData(): DemoDataBundle {
  return demoData;
}

export function isDemoModeEnabled(): boolean {
  return getDataMode() === "demo";
}
