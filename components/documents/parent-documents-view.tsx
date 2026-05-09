"use client";

import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { demoData } from "@/demo-data";
import { DocumentRecord, documentCategories, getInitialDocuments, getParentDocuments } from "@/src/lib/documents";
import { Download, FileText, Search } from "lucide-react";
import { useMemo, useState } from "react";

export function ParentDocumentsView() {
  const [documents, setDocuments] = useState<DocumentRecord[]>(getParentDocuments(getInitialDocuments()));
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [childId, setChildId] = useState("All");
  const linkedLearners = demoData.learnerGuardianLinks
    .filter((link) => link.guardianId === demoData.guardians[0]?.id)
    .map((link) => demoData.learners.find((learner) => learner.id === link.learnerId))
    .filter(Boolean);

  const filtered = useMemo(() => {
    return documents.filter((document) => {
      const matchesSearch = document.title.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === "All" || document.displayCategory === category;
      const matchesChild = childId === "All" || document.visibilityTargetId === childId || document.visibility === "Whole school";
      return matchesSearch && matchesCategory && matchesChild;
    });
  }, [documents, search, category, childId]);

  function markDownloaded(documentId: string) {
    setDocuments((prev) => prev.map((document) => document.id === documentId ? { ...document, downloadedCount: document.downloadedCount + 1, isNewForParent: false } : document));
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-pine-900 p-5 text-white">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          <h1 className="text-xl font-semibold">Documents</h1>
        </div>
        <p className="mt-1 text-sm text-white/75">Reports, policies, statements, and useful school files.</p>
      </div>

      <Card>
        <div className="grid gap-3 md:grid-cols-3">
          <label className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm">
            <Search className="h-4 w-4 text-slate-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search documents" className="min-w-0 flex-1 bg-transparent outline-none" />
          </label>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="rounded-xl border border-slate-200 px-3 py-2 text-sm">
            <option>All</option>
            {documentCategories.map((item) => <option key={item}>{item}</option>)}
          </select>
          <select value={childId} onChange={(e) => setChildId(e.target.value)} className="rounded-xl border border-slate-200 px-3 py-2 text-sm">
            <option value="All">All children</option>
            {linkedLearners.map((learner) => learner && <option key={learner.id} value={learner.id}>{learner.firstName} {learner.lastName}</option>)}
          </select>
        </div>
      </Card>

      <div className="grid gap-3 md:grid-cols-2">
        {filtered.map((document) => (
          <Card key={document.id}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-pine-900">{document.title}</p>
                <p className="mt-1 text-sm text-slate-600">{document.displayCategory}</p>
              </div>
              {document.isNewForParent && <StatusBadge label="New" tone="warning" />}
            </div>
            <p className="mt-3 text-xs text-slate-500">Storage-ready path: {document.storageBucket}/{document.storagePath}</p>
            <button onClick={() => markDownloaded(document.id)} className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm">
              <Download className="h-4 w-4" />
              Download placeholder
            </button>
          </Card>
        ))}
        {filtered.length === 0 && <p className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-500">No documents match your filters.</p>}
      </div>
    </div>
  );
}
