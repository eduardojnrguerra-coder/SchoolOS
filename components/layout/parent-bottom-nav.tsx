"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, CreditCard, Home, MessageCircle, Users } from "lucide-react";

const items = [
  { href: "/parent", label: "Home", icon: Home },
  { href: "/parent/children", label: "Children", icon: Users },
  { href: "/parent/notices", label: "Alerts", icon: Bell, badge: true },
  { href: "/parent/fees", label: "Fees", icon: CreditCard },
  { href: "/parent/messages", label: "Contact", icon: MessageCircle }
];

export function ParentBottomNav() {
  const pathname = usePathname();
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white/95 px-2 pb-[calc(env(safe-area-inset-bottom)+0.5rem)] pt-2 shadow-[0_-10px_30px_-20px_rgba(15,23,42,0.35)] backdrop-blur md:hidden">
      <nav className="mx-auto grid max-w-md grid-cols-5 gap-1">
        {items.map((item) => (
          <Link key={item.href} href={item.href} className={`relative flex flex-col items-center gap-1 rounded-xl px-2 py-2 text-[11px] transition ${pathname === item.href ? "bg-pine-900 text-white" : "text-slate-500"}`}>
            <item.icon className="h-4 w-4" />
            {item.badge && <span className="absolute right-4 top-1 h-2 w-2 rounded-full bg-amber-400" />}
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
