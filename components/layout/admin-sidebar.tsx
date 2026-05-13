"use client";

import { useAuth } from "@/components/auth/auth-provider";
import { AppRole } from "@/lib/auth";
import Link from "next/link";

const items: Array<{ slug: string; label: string; roles: AppRole[] }> = [
  { slug: "learners", label: "Learners", roles: ["SCHOOL_ADMIN", "PRINCIPAL", "SUPER_ADMIN"] },
  { slug: "parents", label: "Parents", roles: ["SCHOOL_ADMIN", "PRINCIPAL", "SUPER_ADMIN"] },
  { slug: "classes", label: "Classes", roles: ["SCHOOL_ADMIN", "PRINCIPAL", "SUPER_ADMIN"] },
  { slug: "attendance", label: "Attendance", roles: ["SCHOOL_ADMIN", "PRINCIPAL", "SUPER_ADMIN"] },
  { slug: "notices", label: "Notices", roles: ["SCHOOL_ADMIN", "PRINCIPAL", "SUPER_ADMIN"] },
  { slug: "fees", label: "Fees", roles: ["SCHOOL_ADMIN", "PRINCIPAL", "SUPER_ADMIN", "FINANCE"] },
  { slug: "consent-forms", label: "Consent Forms", roles: ["SCHOOL_ADMIN", "PRINCIPAL", "SUPER_ADMIN"] },
  { slug: "events", label: "Events", roles: ["SCHOOL_ADMIN", "PRINCIPAL", "SUPER_ADMIN"] },
  { slug: "documents", label: "Documents", roles: ["SCHOOL_ADMIN", "PRINCIPAL", "SUPER_ADMIN"] },
  { slug: "incidents", label: "Incidents", roles: ["SCHOOL_ADMIN", "PRINCIPAL", "SUPER_ADMIN"] },
  { slug: "transport", label: "Transport", roles: ["SCHOOL_ADMIN", "PRINCIPAL", "SUPER_ADMIN", "TRANSPORT_MANAGER"] },
  { slug: "aftercare", label: "Aftercare", roles: ["SCHOOL_ADMIN", "PRINCIPAL", "SUPER_ADMIN", "AFTERCARE_STAFF"] },
  { slug: "implementation", label: "Implementation", roles: ["SCHOOL_ADMIN", "PRINCIPAL", "SUPER_ADMIN"] },
  { slug: "settings", label: "Settings", roles: ["SCHOOL_ADMIN", "PRINCIPAL", "SUPER_ADMIN"] }
];

export function AdminSidebar() {
  const { user } = useAuth();
  const visibleItems = items.filter((item) => user && item.roles.includes(user.role));

  return (
    <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-pine-900 p-4 text-white md:block">
      <Link href="/dashboard" className="mb-6 block text-lg font-semibold">Admin</Link>
      <nav className="grid gap-1">
        {visibleItems.map((item) => (
          <Link key={item.slug} href={`/dashboard/${item.slug}`} className="rounded-lg px-3 py-2 text-sm text-white/85 hover:bg-white/10">
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
