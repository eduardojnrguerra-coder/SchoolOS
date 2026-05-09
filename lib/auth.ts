export type AppRole =
  | "SUPER_ADMIN"
  | "SCHOOL_ADMIN"
  | "PRINCIPAL"
  | "TEACHER"
  | "FINANCE"
  | "TRANSPORT_MANAGER"
  | "AFTERCARE_STAFF"
  | "PARENT";

export const adminOnlyRoles: AppRole[] = ["SUPER_ADMIN", "SCHOOL_ADMIN", "PRINCIPAL"];

export const dashboardRoles: AppRole[] = [
  "SUPER_ADMIN",
  "SCHOOL_ADMIN",
  "PRINCIPAL",
  "FINANCE",
  "TRANSPORT_MANAGER",
  "AFTERCARE_STAFF"
];

export function canAccess(role: AppRole, area: "dashboard" | "teacher" | "parent") {
  if (area === "dashboard") return dashboardRoles.includes(role);
  if (area === "teacher") return role === "TEACHER";
  return role === "PARENT";
}

export function getRoleLandingPath(role: AppRole) {
  if (role === "TEACHER") return "/teacher";
  if (role === "PARENT") return "/parent";
  return "/dashboard";
}

export function roleLabel(role: AppRole) {
  return role.replaceAll("_", " ").toLowerCase().replace(/\b\w/g, (letter) => letter.toUpperCase());
}
