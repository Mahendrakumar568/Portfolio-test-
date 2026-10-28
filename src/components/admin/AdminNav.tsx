"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export const AdminNav = ({ signalOn, revealed }: { signalOn: boolean; revealed: boolean }) => {
  const pathname = usePathname();
  const items = [
    { href: "/admin", label: "Writing", active: pathname === "/admin" || pathname.startsWith("/admin/posts") },
    { href: "/admin/topics", label: "Writing topics" },
    { href: "/admin/signal", label: "Availability signal", badge: signalOn ? "On" : undefined },
    { href: "/admin/venture", label: "Stealth venture", badge: revealed ? "Revealed" : "Sealed" },
    { href: "/admin/profile", label: "Profile and numbers" },
  ];
  return (
    <nav className="mt-6 flex gap-1 overflow-x-auto md:mt-10 md:flex-col">
      {items.map((item) => {
        const active = item.active ?? pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex shrink-0 items-center justify-between gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
              active ? "bg-paper/10 text-paper" : "text-paper/65 hover:text-paper"
            }`}
          >
            {item.label}
            {item.badge && (
              <span className={`rounded-full px-2 py-0.5 text-[11px] ${item.badge === "On" || item.badge === "Revealed" ? "bg-ember text-ink" : "bg-paper/10 text-paper/60"}`}>
                {item.badge}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
};
