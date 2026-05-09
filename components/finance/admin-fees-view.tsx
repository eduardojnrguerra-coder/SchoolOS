"use client";

import { CollectionProgressChart } from "@/components/finance/collection-chart";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { demoData } from "@/demo-data";
import {
  FinanceAuditEntry,
  buildFinanceAudit,
  buildManualPayment,
  formatMoney,
  getCollectionChartData,
  getFeeRows,
  getFinanceKpis,
  getStatementLines
} from "@/src/lib/finance";
import { FeeAccount, Payment, ProofOfPayment } from "@/types/domain";
import { Bell, Check, FileCheck2, Plus, Search, X } from "lucide-react";
import { useMemo, useState } from "react";

export function AdminFeesView() {
  const [accounts, setAccounts] = useState<FeeAccount[]>(demoData.feeAccounts);
  const [payments, setPayments] = useState<Payment[]>(demoData.payments);
  const [proofs, setProofs] = useState<ProofOfPayment[]>(demoData.proofsOfPayment);
  const [auditLogs, setAuditLogs] = useState<FinanceAuditEntry[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedAccountId, setSelectedAccountId] = useState(accounts[0]?.id ?? "");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [reminderMessage, setReminderMessage] = useState("");

  const rows = useMemo(() => getFeeRows(accounts, payments), [accounts, payments]);
  const filteredRows = rows.filter((row) => {
    const matchesSearch = `${row.learnerName} ${row.parentName} ${row.account.accountCode}`.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || row.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
  const selectedRow = rows.find((row) => row.account.id === selectedAccountId) ?? rows[0];
  const kpis = getFinanceKpis(accounts, payments);
  const chartData = getCollectionChartData(accounts, payments);

  function addManualPayment(formData: FormData) {
    if (!selectedRow) return;
    const amount = Number(formData.get("amount"));
    const method = String(formData.get("method")) as Payment["method"];
    const reference = String(formData.get("reference") || `MANUAL-${Date.now()}`);
    if (!amount || amount <= 0) return;
    const payment = buildManualPayment(selectedRow.account, amount, method, reference);
    setPayments((prev) => [payment, ...prev]);
    setAccounts((prev) => prev.map((account) => account.id === selectedRow.account.id ? { ...account, currentBalance: Math.max(account.currentBalance - amount, 0), updatedAt: payment.paidAt } : account));
    setAuditLogs((prev) => [buildFinanceAudit("MANUAL_PAYMENT_ADDED", `${formatMoney(amount)} added to ${selectedRow.learnerName}`), ...prev]);
    setShowPaymentModal(false);
  }

  function updateProof(proofId: string, status: ProofOfPayment["status"]) {
    setProofs((prev) => prev.map((proof) => proof.id === proofId ? { ...proof, status, verifiedByUserId: "usr_003", verifiedAt: new Date().toISOString() } : proof));
    setAuditLogs((prev) => [buildFinanceAudit(`PROOF_${status}`, `Proof ${proofId} marked ${status.toLowerCase()}`), ...prev]);
  }

  function sendReminder() {
    if (!selectedRow) return;
    setReminderMessage(`Reminder queued for ${selectedRow.parentName}. No real message was sent.`);
    setAuditLogs((prev) => [buildFinanceAudit("FEE_REMINDER_QUEUED", `Reminder queued for ${selectedRow.learnerName}`), ...prev]);
  }

  return (
    <div className="space-y-5">
      <PageHeader title="Fees" subtitle="Track school fee balances, proof uploads, and payment follow-up." />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Kpi label="Expected monthly fees" value={formatMoney(kpis.totalExpected)} />
        <Kpi label="Total collected" value={formatMoney(kpis.totalCollected)} tone="success" />
        <Kpi label="Total outstanding" value={formatMoney(kpis.totalOutstanding)} tone="warning" />
        <Kpi label="Overdue accounts" value={String(kpis.overdueAccounts)} tone="danger" />
      </section>

      <div className="grid gap-4 xl:grid-cols-[1.25fr_0.85fr]">
        <Card>
          <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 lg:w-96">
              <Search className="h-4 w-4 text-slate-400" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search learner, parent, account..." className="w-full bg-transparent text-sm outline-none" />
            </div>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded-xl border border-slate-200 px-3 py-2 text-sm">
              <option value="ALL">All statuses</option>
              <option value="Up to date">Up to date</option>
              <option value="Outstanding">Outstanding</option>
              <option value="Overdue">Overdue</option>
            </select>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] text-left text-sm">
              <thead className="border-b border-slate-200 text-slate-500">
                <tr>
                  <th className="px-3 py-2">Learner</th>
                  <th className="px-3 py-2">Parent</th>
                  <th className="px-3 py-2">Monthly fee</th>
                  <th className="px-3 py-2">Balance</th>
                  <th className="px-3 py-2">Last payment</th>
                  <th className="px-3 py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredRows.map((row) => (
                  <tr key={row.account.id} onClick={() => setSelectedAccountId(row.account.id)} className="cursor-pointer border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-3 py-3 font-medium text-slate-900">{row.learnerName}</td>
                    <td className="px-3 py-3">{row.parentName}</td>
                    <td className="px-3 py-3">{formatMoney(row.monthlyFee)}</td>
                    <td className="px-3 py-3">{formatMoney(row.balance)}</td>
                    <td className="px-3 py-3">{row.lastPayment ? `${formatMoney(row.lastPayment.amount)} · ${row.lastPayment.method}` : "No payments"}</td>
                    <td className="px-3 py-3"><StatusBadge label={row.status} tone={row.status === "Overdue" ? "danger" : row.status === "Outstanding" ? "warning" : "success"} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredRows.length === 0 && <EmptyState title="No fee accounts found" description="Try another search or status filter." />}
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold text-pine-900">Collection Progress</h2>
          <CollectionProgressChart data={chartData} />
        </Card>
      </div>

      {selectedRow && (
        <div className="grid gap-4 xl:grid-cols-3">
          <Card className="xl:col-span-2">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-pine-900">{selectedRow.learnerName}</h2>
                <p className="text-sm text-slate-600">{selectedRow.parentName} · {selectedRow.account.accountCode}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => setShowPaymentModal(true)} className="inline-flex items-center gap-2 rounded-xl bg-pine-900 px-3 py-2 text-sm text-white"><Plus className="h-4 w-4" /> Add manual payment</button>
                <button onClick={sendReminder} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm"><Bell className="h-4 w-4" /> Send reminder</button>
              </div>
            </div>
            {reminderMessage && <p className="mt-3 text-sm text-emerald-700">{reminderMessage}</p>}
            <DetailGrid row={selectedRow} payments={payments} proofs={proofs} />
          </Card>

          <StatementPreview account={selectedRow.account} payments={payments} learnerName={selectedRow.learnerName} />
        </div>
      )}

      <div className="grid gap-4 xl:grid-cols-2">
        <ProofReviewPanel proofs={proofs} onUpdateProof={updateProof} />
        <Card>
          <h2 className="text-lg font-semibold text-pine-900">Finance Audit Log</h2>
          <div className="mt-3 space-y-2 text-sm">
            {auditLogs.length === 0 ? <p className="text-slate-500">Audit entries appear after payment or proof changes.</p> : auditLogs.map((log) => (
              <div key={log.id} className="rounded-lg border border-slate-200 p-3">
                <p className="font-medium text-slate-900">{log.action}</p>
                <p className="text-slate-600">{log.detail}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <form action={addManualPayment} className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl">
            <h3 className="text-lg font-semibold text-pine-900">Add manual payment</h3>
            <p className="mt-1 text-sm text-slate-500">Use for EFT, cash, card terminal, or gateway reconciliation.</p>
            <div className="mt-4 grid gap-3">
              <input name="amount" type="number" min="1" placeholder="Amount in ZAR" className="rounded-xl border border-slate-200 px-3 py-2 text-sm" />
              <select name="method" className="rounded-xl border border-slate-200 px-3 py-2 text-sm">
                <option value="EFT">EFT</option>
                <option value="CARD">Card</option>
                <option value="CASH">Cash</option>
              </select>
              <input name="reference" placeholder="Reference" className="rounded-xl border border-slate-200 px-3 py-2 text-sm" />
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button type="button" onClick={() => setShowPaymentModal(false)} className="rounded-xl border border-slate-200 px-3 py-2 text-sm">Cancel</button>
              <button type="submit" className="rounded-xl bg-pine-900 px-3 py-2 text-sm text-white">Record payment</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

function Kpi({ label, value, tone = "info" }: { label: string; value: string; tone?: "info" | "success" | "warning" | "danger" }) {
  return (
    <Card>
      <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-pine-900">{value}</p>
      <div className="mt-3"><StatusBadge label="Demo finance" tone={tone} /></div>
    </Card>
  );
}

function DetailGrid({ row, payments, proofs }: { row: ReturnType<typeof getFeeRows>[number]; payments: Payment[]; proofs: ProofOfPayment[] }) {
  const accountPayments = payments.filter((payment) => payment.feeAccountId === row.account.id);
  const accountProofs = proofs.filter((proof) => accountPayments.some((payment) => payment.id === proof.paymentId) || proof.paymentId.includes(row.account.id));
  return (
    <div className="mt-5 grid gap-4 md:grid-cols-2">
      <Panel title="Payment history" lines={accountPayments.map((p) => `${formatMoney(p.amount)} · ${p.method} · ${p.reference}`)} empty="No payments captured." />
      <Panel title="Outstanding invoices" lines={[`May tuition balance: ${formatMoney(row.balance)}`, `Overdue amount: ${formatMoney(row.account.overdueAmount)}`]} />
      <Panel title="Proofs of payment" lines={accountProofs.map((p) => `${p.fileName} · ${p.status}`)} empty="No proof uploads." />
      <Panel title="Notes" lines={["Gateway-ready fields: provider, provider reference, reconciliation status.", "Supports PayFast, Yoco, Ozow, Peach Payments, and EFT proof workflows later."]} />
    </div>
  );
}

function Panel({ title, lines, empty }: { title: string; lines: string[]; empty?: string }) {
  return (
    <div className="rounded-lg border border-slate-200 p-3 text-sm">
      <p className="mb-2 font-medium text-slate-900">{title}</p>
      {lines.length ? lines.map((line) => <p key={line} className="text-slate-600">{line}</p>) : <p className="text-slate-500">{empty}</p>}
    </div>
  );
}

function ProofReviewPanel({ proofs, onUpdateProof }: { proofs: ProofOfPayment[]; onUpdateProof: (id: string, status: ProofOfPayment["status"]) => void }) {
  return (
    <Card>
      <h2 className="text-lg font-semibold text-pine-900">Proof Review Panel</h2>
      <div className="mt-3 space-y-2 text-sm">
        {proofs.slice(0, 8).map((proof) => (
          <div key={proof.id} className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 p-3">
            <div>
              <p className="font-medium text-slate-900">{proof.fileName}</p>
              <StatusBadge label={proof.status} tone={proof.status === "VERIFIED" ? "success" : proof.status === "REJECTED" ? "danger" : "warning"} />
            </div>
            <div className="flex gap-2">
              <button onClick={() => onUpdateProof(proof.id, "VERIFIED")} className="rounded-lg border border-slate-200 p-2" aria-label="Approve proof"><Check className="h-4 w-4" /></button>
              <button onClick={() => onUpdateProof(proof.id, "REJECTED")} className="rounded-lg border border-slate-200 p-2" aria-label="Reject proof"><X className="h-4 w-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function StatementPreview({ account, payments, learnerName }: { account: FeeAccount; payments: Payment[]; learnerName: string }) {
  const lines = getStatementLines(account, payments);
  return (
    <Card>
      <div className="mb-3 flex items-center gap-2">
        <FileCheck2 className="h-5 w-5 text-pine-800" />
        <h2 className="text-lg font-semibold text-pine-900">Statement preview</h2>
      </div>
      <p className="text-sm text-slate-600">{learnerName}</p>
      <div className="mt-4 space-y-2 text-sm">
        {lines.map((line) => (
          <div key={line.label} className="flex justify-between border-b border-slate-100 pb-2">
            <span>{line.label}</span>
            <span className="font-medium">{formatMoney(line.amount)}</span>
          </div>
        ))}
      </div>
      <button className="mt-4 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm">Download statement placeholder</button>
    </Card>
  );
}
