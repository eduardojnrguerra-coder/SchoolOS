"use client";

import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { demoData } from "@/demo-data";
import { buildProofUpload, formatMoney, getStatementLines } from "@/src/lib/finance";
import { FeeAccount, Payment, ProofOfPayment } from "@/types/domain";
import { Bell, CreditCard, FileText, Upload } from "lucide-react";
import { useMemo, useState } from "react";

const demoLearnerId = "lrn_001";

export function ParentFeesView() {
  const initialAccount = demoData.feeAccounts.find((account) => account.learnerId === demoLearnerId) ?? demoData.feeAccounts[0];
  const [account] = useState<FeeAccount>(initialAccount);
  const [payments] = useState<Payment[]>(demoData.payments.filter((payment) => payment.feeAccountId === account.id));
  const [proofs, setProofs] = useState<ProofOfPayment[]>([]);
  const learner = demoData.learners.find((item) => item.id === account.learnerId);
  const statementLines = useMemo(() => getStatementLines(account, payments), [account, payments]);
  const upcomingAmount = Math.min(account.currentBalance, 4200);

  function uploadProof(formData: FormData) {
    const fileName = String(formData.get("fileName") || `proof-${Date.now()}.pdf`);
    setProofs((prev) => [buildProofUpload(account, fileName), ...prev]);
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-pine-900 p-5 text-white">
        <p className="text-sm text-white/70">School fees</p>
        <h1 className="mt-1 text-2xl font-semibold">{learner ? `${learner.firstName} ${learner.lastName}` : "Learner account"}</h1>
        <p className="mt-4 text-sm text-white/70">Current balance</p>
        <p className="text-4xl font-semibold">{formatMoney(account.currentBalance)}</p>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <Card>
          <p className="text-xs uppercase tracking-wide text-slate-500">Upcoming amount due</p>
          <p className="mt-2 text-2xl font-semibold text-pine-900">{formatMoney(upcomingAmount)}</p>
          <StatusBadge label="Monthly school fee" tone="info" />
        </Card>
        <Card>
          <p className="text-xs uppercase tracking-wide text-slate-500">Payment link</p>
          <button className="mt-2 inline-flex items-center gap-2 rounded-xl bg-pine-900 px-3 py-2 text-sm text-white">
            <CreditCard className="h-4 w-4" />
            Payment placeholder
          </button>
          <p className="mt-2 text-xs text-slate-500">PayFast, Yoco, Ozow, Peach, or EFT later.</p>
        </Card>
        <Card>
          <p className="text-xs uppercase tracking-wide text-slate-500">Reminder</p>
          <div className="mt-2 flex items-start gap-2 rounded-xl bg-amber-50 p-3 text-sm text-amber-800">
            <Bell className="mt-0.5 h-4 w-4" />
            Payment reminder: please upload proof if you already paid by EFT.
          </div>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <h2 className="text-lg font-semibold text-pine-900">Payment history</h2>
          <div className="mt-3 space-y-2 text-sm">
            {payments.map((payment) => (
              <div key={payment.id} className="flex justify-between rounded-lg border border-slate-200 p-3">
                <div>
                  <p className="font-medium">{payment.method} payment</p>
                  <p className="text-xs text-slate-500">{payment.reference}</p>
                </div>
                <p className="font-semibold text-pine-900">{formatMoney(payment.amount)}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold text-pine-900">Upload proof of payment</h2>
          <form action={uploadProof} className="mt-3 flex flex-col gap-3">
            <input name="fileName" placeholder="File name placeholder, e.g. EFT-proof.pdf" className="rounded-xl border border-slate-200 px-3 py-2 text-sm" />
            <button type="submit" className="inline-flex w-fit items-center gap-2 rounded-xl bg-pine-900 px-3 py-2 text-sm text-white">
              <Upload className="h-4 w-4" />
              Upload proof
            </button>
          </form>
          <div className="mt-3 space-y-2">
            {proofs.map((proof) => (
              <div key={proof.id} className="rounded-lg border border-slate-200 p-3 text-sm">
                <p className="font-medium text-slate-900">{proof.fileName}</p>
                <StatusBadge label={proof.status} tone="warning" />
              </div>
            ))}
            {proofs.length === 0 && <p className="text-sm text-slate-500">No new proofs uploaded in this demo session.</p>}
          </div>
        </Card>
      </div>

      <Card>
        <div className="mb-3 flex items-center gap-2">
          <FileText className="h-5 w-5 text-pine-800" />
          <h2 className="text-lg font-semibold text-pine-900">Statement</h2>
        </div>
        <div className="space-y-2 text-sm">
          {statementLines.map((line) => (
            <div key={line.label} className="flex justify-between border-b border-slate-100 pb-2">
              <span>{line.label}</span>
              <span className="font-medium">{formatMoney(line.amount)}</span>
            </div>
          ))}
        </div>
        <button className="mt-4 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm">View/download statement placeholder</button>
      </Card>
    </div>
  );
}
