import { demoData } from "@/demo-data";
import { FeeAccount, Payment, ProofOfPayment } from "@/types/domain";

export type FeeAccountRow = {
  account: FeeAccount;
  learnerName: string;
  parentName: string;
  monthlyFee: number;
  balance: number;
  lastPayment?: Payment;
  status: "Up to date" | "Outstanding" | "Overdue";
};

export type FinanceAuditEntry = {
  id: string;
  action: string;
  detail: string;
  at: string;
};

export function formatMoney(value: number) {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    maximumFractionDigits: 0
  }).format(value);
}

export function getFeeRows(accounts: FeeAccount[] = demoData.feeAccounts, payments: Payment[] = demoData.payments): FeeAccountRow[] {
  return accounts.map((account, index) => {
    const learner = demoData.learners.find((item) => item.id === account.learnerId);
    const primaryLink = demoData.learnerGuardianLinks.find(
      (link) => link.learnerId === account.learnerId && link.custodyLevel === "PRIMARY"
    );
    const parent = demoData.guardians.find((guardian) => guardian.id === primaryLink?.guardianId);
    const accountPayments = payments
      .filter((payment) => payment.feeAccountId === account.id)
      .sort((a, b) => b.paidAt.localeCompare(a.paidAt));
    const status = account.overdueAmount > 0 ? "Overdue" : account.currentBalance > 0 ? "Outstanding" : "Up to date";
    return {
      account,
      learnerName: learner ? `${learner.firstName} ${learner.lastName}` : "Unknown learner",
      parentName: parent?.fullName ?? "No primary parent",
      monthlyFee: 4200 + (index % 4) * 250,
      balance: account.currentBalance,
      lastPayment: accountPayments[0],
      status
    };
  });
}

export function getFinanceKpis(accounts: FeeAccount[], payments: Payment[]) {
  const rows = getFeeRows(accounts, payments);
  const totalExpected = rows.reduce((sum, row) => sum + row.monthlyFee, 0);
  const totalCollected = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const totalOutstanding = accounts.reduce((sum, account) => sum + account.currentBalance, 0);
  const overdueAccounts = accounts.filter((account) => account.overdueAmount > 0).length;
  return { totalExpected, totalCollected, totalOutstanding, overdueAccounts };
}

export function getCollectionChartData(accounts: FeeAccount[], payments: Payment[]) {
  const totalOutstanding = accounts.reduce((sum, account) => sum + account.currentBalance, 0);
  const byMonth = new Map<string, { month: string; paid: number; outstanding: number; target: number }>();
  for (const payment of payments) {
    const month = payment.paidAt.slice(0, 7);
    if (!byMonth.has(month)) byMonth.set(month, { month, paid: 0, outstanding: 0, target: 0 });
    byMonth.get(month)!.paid += payment.amount;
  }
  const currentMonth = new Date().toISOString().slice(0, 7);
  if (!byMonth.has(currentMonth)) byMonth.set(currentMonth, { month: currentMonth, paid: 0, outstanding: 0, target: 0 });
  byMonth.get(currentMonth)!.outstanding = totalOutstanding;
  for (const row of byMonth.values()) row.target = row.paid + row.outstanding;
  return [...byMonth.values()].sort((a, b) => a.month.localeCompare(b.month));
}

export function buildManualPayment(account: FeeAccount, amount: number, method: Payment["method"], reference: string): Payment {
  return {
    id: `pmt_manual_${Date.now()}`,
    schoolId: account.schoolId,
    feeAccountId: account.id,
    amount,
    currency: "ZAR",
    paidAt: new Date().toISOString(),
    method,
    reference,
    capturedByUserId: "usr_003"
  };
}

export function buildProofUpload(account: FeeAccount, fileName: string): ProofOfPayment {
  return {
    id: `pop_demo_${Date.now()}`,
    schoolId: account.schoolId,
    paymentId: `pending_${account.id}`,
    uploadedByUserId: "usr_001",
    fileName,
    filePath: `proofs/demo/${fileName}`,
    status: "PENDING"
  };
}

export function buildFinanceAudit(action: string, detail: string): FinanceAuditEntry {
  return { id: `aud_fin_${Date.now()}`, action, detail, at: new Date().toISOString() };
}

export function getStatementLines(account: FeeAccount, payments: Payment[]) {
  const accountPayments = payments.filter((payment) => payment.feeAccountId === account.id);
  return [
    { label: "Opening balance", amount: account.currentBalance + accountPayments.reduce((sum, p) => sum + p.amount, 0) },
    ...accountPayments.map((payment) => ({ label: `Payment ${payment.reference}`, amount: -payment.amount })),
    { label: "Current balance", amount: account.currentBalance }
  ];
}
