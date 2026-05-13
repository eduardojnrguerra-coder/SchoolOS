export const salesDemoActiveStorageKey = "pine-x-sales-demo-active";
export const salesDemoStateEventName = "pine-x-sales-demo-state";
export const salesDemoActionEventName = "pine-x-sales-demo-action";

export type SalesDemoAction =
  | "MARK_LEARNER_ABSENT"
  | "PARENT_CONFIRM_ABSENCE"
  | "SEND_URGENT_GRADE3_NOTICE"
  | "CREATE_OUTING_CONSENT_FORM"
  | "SHOW_OVERDUE_FEE"
  | "UPLOAD_PROOF_OF_PAYMENT"
  | "MARK_TRANSPORT_DELAYED"
  | "CHECK_LEARNER_INTO_AFTERCARE"
  | "CONFIRM_AFTERCARE_PICKUP"
  | "RESET_DEMO";

export type SalesDemoActionPayload = {
  type: SalesDemoAction;
};

export function getIsSalesDemoActive() {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(salesDemoActiveStorageKey) === "true";
}

export function setSalesDemoActive(active: boolean) {
  if (typeof window === "undefined") return;
  if (active) {
    window.localStorage.setItem(salesDemoActiveStorageKey, "true");
  } else {
    window.localStorage.removeItem(salesDemoActiveStorageKey);
  }
  window.dispatchEvent(new Event(salesDemoStateEventName));
}

export function dispatchSalesDemoAction(type: SalesDemoAction) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent<SalesDemoActionPayload>(salesDemoActionEventName, { detail: { type } }));
}
