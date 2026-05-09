import { demoData } from "@/demo-data";
import { Document } from "@/types/domain";

export type DocumentCategory = "Reports" | "Policies" | "Newsletters" | "Timetables" | "Statements" | "Supply lists" | "Medical forms";
export type DocumentVisibility = "Whole school" | "Grade" | "Class" | "Specific learner";

export type DocumentRecord = Document & {
  displayCategory: DocumentCategory;
  visibility: DocumentVisibility;
  visibilityTargetId: string;
  storageBucket: "documents";
  storagePath: string;
  viewedCount: number;
  downloadedCount: number;
  isNewForParent: boolean;
};

export type DocumentDraft = {
  title: string;
  category: DocumentCategory;
  visibility: DocumentVisibility;
  visibilityTargetId: string;
  fileName: string;
};

export const documentCategories: DocumentCategory[] = ["Reports", "Policies", "Newsletters", "Timetables", "Statements", "Supply lists", "Medical forms"];

export const defaultDocumentDraft: DocumentDraft = {
  title: "Term information pack",
  category: "Newsletters",
  visibility: "Whole school",
  visibilityTargetId: "all",
  fileName: "term-information-pack.pdf"
};

export function getInitialDocuments(): DocumentRecord[] {
  return demoData.documents.map((document, index) => ({
    ...document,
    displayCategory: index === 0 ? "Policies" : index === 1 ? "Statements" : "Timetables",
    visibility: document.audience === "ALL" ? "Whole school" : "Grade",
    visibilityTargetId: "all",
    storageBucket: "documents",
    storagePath: document.filePath,
    viewedCount: 12 + index * 7,
    downloadedCount: 4 + index * 3,
    isNewForParent: index === 1
  }));
}

export function createDocumentFromDraft(draft: DocumentDraft): DocumentRecord {
  const storagePath = `documents/demo/${draft.category.toLowerCase().replaceAll(" ", "-")}/${draft.fileName}`;
  return {
    id: `doc_demo_${Date.now()}`,
    schoolId: demoData.school.id,
    title: draft.title,
    category: draft.category === "Policies" ? "POLICY" : draft.category === "Statements" ? "FINANCE" : "ACADEMIC",
    audience: draft.visibility === "Whole school" ? "ALL" : "PARENTS",
    filePath: storagePath,
    uploadedByUserId: "usr_001",
    uploadedAt: new Date().toISOString(),
    displayCategory: draft.category,
    visibility: draft.visibility,
    visibilityTargetId: draft.visibilityTargetId,
    storageBucket: "documents",
    storagePath,
    viewedCount: 0,
    downloadedCount: 0,
    isNewForParent: true
  };
}

export function getParentDocuments(documents: DocumentRecord[]) {
  const linkedLearnerIds = demoData.learnerGuardianLinks
    .filter((link) => link.guardianId === demoData.guardians[0]?.id)
    .map((link) => link.learnerId);
  const linkedLearners = demoData.learners.filter((learner) => linkedLearnerIds.includes(learner.id));
  return documents.filter((document) => {
    if (document.visibility === "Whole school") return true;
    if (document.visibility === "Specific learner") return linkedLearnerIds.includes(document.visibilityTargetId);
    if (document.visibility === "Class") return linkedLearners.some((learner) => learner.classId === document.visibilityTargetId);
    if (document.visibility === "Grade") return linkedLearners.some((learner) => learner.gradeId === document.visibilityTargetId);
    return false;
  });
}
