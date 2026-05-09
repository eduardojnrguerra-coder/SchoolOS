"use client";

import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  DocumentDraft,
  DocumentRecord,
  createDocumentFromDraft,
  defaultDocumentDraft,
  documentCategories,
  getInitialDocuments
} from "@/src/lib/documents";
import { Download, Eye, Upload } from "lucide-react";
import { useMemo, useState } from "react";

export function AdminDocumentsView() {
  const [documents, setDocuments] = useState<DocumentRecord[]>(getInitialDocuments());
  const [draft, setDraft] = useState<DocumentDraft>(defaultDocumentDraft);
  const [message, setMessage] = useState("");

  const grouped = useMemo(() => {
    return documentCategories.map((category) => ({
      category,
      docs: documents.filter((document) => document.displayCategory === category)
    }));
  }, [documents]);

  function updateDraft(data: Partial<DocumentDraft>) {
    setDraft((prev) => ({ ...prev, ...data }));
  }

  function uploadDocument() {
    if (!draft.title || !draft.fileName) return;
    setDocuments((prev) => [createDocumentFromDraft(draft), ...prev]);
    setMessage("Document uploaded in demo mode. Supabase Storage is not connected yet.");
  }

  return (
    <div className="space-y-5">
      <PageHeader title="Documents" subtitle="Publish structured, permission-aware school files." />

      <Card>
        <h2 className="text-lg font-semibold text-pine-900">Upload document placeholder</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-5">
          <input value={draft.title} onChange={(e) => updateDraft({ title: e.target.value })} placeholder="Document title" className="rounded-xl border border-slate-200 px-3 py-2 text-sm md:col-span-2" />
          <select value={draft.category} onChange={(e) => updateDraft({ category: e.target.value as DocumentDraft["category"] })} className="rounded-xl border border-slate-200 px-3 py-2 text-sm">
            {documentCategories.map((category) => <option key={category}>{category}</option>)}
          </select>
          <select value={draft.visibility} onChange={(e) => updateDraft({ visibility: e.target.value as DocumentDraft["visibility"] })} className="rounded-xl border border-slate-200 px-3 py-2 text-sm">
            {["Whole school", "Grade", "Class", "Specific learner"].map((item) => <option key={item}>{item}</option>)}
          </select>
          <input value={draft.fileName} onChange={(e) => updateDraft({ fileName: e.target.value })} placeholder="file-name.pdf" className="rounded-xl border border-slate-200 px-3 py-2 text-sm" />
        </div>
        <button onClick={uploadDocument} className="mt-4 inline-flex items-center gap-2 rounded-xl bg-pine-900 px-3 py-2 text-sm text-white"><Upload className="h-4 w-4" /> Upload placeholder</button>
        {message && <p className="mt-3 text-sm text-emerald-700">{message}</p>}
      </Card>

      <div className="grid gap-4 xl:grid-cols-2">
        {grouped.map((group) => (
          <Card key={group.category}>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-pine-900">{group.category}</h2>
              <StatusBadge label={`${group.docs.length} files`} tone="info" />
            </div>
            {group.docs.length === 0 ? <EmptyState title="No documents" description="This category is ready for uploads." /> : (
              <div className="space-y-2">
                {group.docs.map((document) => (
                  <div key={document.id} className="rounded-lg border border-slate-200 p-3 text-sm">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium text-slate-900">{document.title}</p>
                        <p className="text-xs text-slate-500">{document.storageBucket}/{document.storagePath}</p>
                      </div>
                      <StatusBadge label={document.visibility} tone="info" />
                    </div>
                    <div className="mt-3 flex gap-3 text-xs text-slate-500">
                      <span className="inline-flex items-center gap-1"><Eye className="h-3 w-3" /> {document.viewedCount} viewed</span>
                      <span className="inline-flex items-center gap-1"><Download className="h-3 w-3" /> {document.downloadedCount} downloaded</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
