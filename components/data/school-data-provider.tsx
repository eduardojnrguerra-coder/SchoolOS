"use client";

import { useAuth } from "@/components/auth/auth-provider";
import { EmptyState } from "@/components/ui/empty-state";
import { LoadingState } from "@/components/ui/loading-state";
import { getSchoolDataBundle, DataProviderError, DataProviderMode } from "@/src/lib/dataProvider";
import { getRuntimeDataBundle } from "@/src/lib/runtimeDataStore";
import { DemoDataBundle } from "@/types/domain";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

type SchoolDataContextValue = {
  data: DemoDataBundle;
  mode: DataProviderMode;
  loading: boolean;
  error?: DataProviderError;
  usingFallback: boolean;
  refresh: () => Promise<void>;
};

const SchoolDataContext = createContext<SchoolDataContextValue | null>(null);

export function SchoolDataProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [data, setData] = useState<DemoDataBundle>(() => getRuntimeDataBundle());
  const [mode, setMode] = useState<DataProviderMode>("demo");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<DataProviderError | undefined>();
  const [usingFallback, setUsingFallback] = useState(true);

  const loadData = async () => {
    setLoading(true);
    const result = await getSchoolDataBundle({
      forceDemo: user?.isDemo ?? true,
      schoolId: user?.schoolId || undefined
    });
    setData(result.data);
    setMode(result.mode);
    setError(result.error);
    setUsingFallback(result.usingFallback);
    setLoading(false);
  };

  useEffect(() => {
    void loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, user?.schoolId, user?.isDemo]);

  const value = useMemo<SchoolDataContextValue>(
    () => ({ data, mode, loading, error, usingFallback, refresh: loadData }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data, error, loading, mode, usingFallback]
  );

  if (loading) {
    return (
      <div className="p-4 md:p-6">
        <LoadingState label={user?.isDemo ? "Loading demo school workspace..." : "Loading Supabase school workspace..."} />
      </div>
    );
  }

  return (
    <SchoolDataContext.Provider value={value}>
      <DataProviderNotice mode={mode} error={error} usingFallback={usingFallback} data={data} />
      {children}
    </SchoolDataContext.Provider>
  );
}

export function useSchoolData() {
  const context = useContext(SchoolDataContext);
  if (!context) throw new Error("useSchoolData must be used inside SchoolDataProvider");
  return context;
}

export function useSchoolDataBundle() {
  return useSchoolData().data;
}

function DataProviderNotice({
  mode,
  error,
  usingFallback,
  data
}: {
  mode: DataProviderMode;
  error?: DataProviderError;
  usingFallback: boolean;
  data: DemoDataBundle;
}) {
  if (error) {
    return (
      <div className="mb-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        <p className="font-semibold">Supabase fallback active</p>
        <p className="mt-1">{error.message}</p>
        <p className="mt-1 text-amber-800">{error.hint}</p>
      </div>
    );
  }

  if (mode === "supabase" && data.learners.length === 0) {
    return (
      <div className="mb-4">
        <EmptyState
          title="Supabase is connected"
          description="No learner records were returned for this role yet. Seed learners or check the current user's RLS access."
        />
      </div>
    );
  }

  if (usingFallback && mode === "demo") {
    return (
      <div className="mb-4 rounded-2xl border border-slate-200 bg-white p-3 text-xs font-medium uppercase tracking-wide text-slate-500">
        Demo data mode
      </div>
    );
  }

  return null;
}
