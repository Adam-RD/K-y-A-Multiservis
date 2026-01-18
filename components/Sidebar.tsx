"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  RiBarChart2Line,
  RiDashboardLine,
  RiFolderLine,
  RiFileListLine,
  RiInboxUnarchiveLine,
  RiStackLine,
} from "react-icons/ri";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: RiDashboardLine },
  { href: "/stats", label: "Ganancias", icon: RiBarChart2Line },
  { href: "/inventory", label: "Ingreso stock", icon: RiInboxUnarchiveLine },
  { href: "/products", label: "Productos", icon: RiStackLine },
  { href: "/movements", label: "Movimientos", icon: RiFileListLine },
  { href: "/categories", label: "Categorías", icon: RiFolderLine },
];

export const Sidebar = () => {
  const pathname = usePathname();
  return (
    <aside
      className="flex h-full flex-col gap-3 border-r p-4 backdrop-blur sm:gap-6 sm:p-6"
      style={{
        backgroundColor: "var(--app-sidebar-bg)",
        borderRightColor: "var(--app-sidebar-border)",
      }}
    >
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm sm:h-11 sm:w-11">
          <Image
            src="/K y A Multiservis version black.png"
            alt="K y A Multiservis"
            width={44}
            height={44}
            className="h-full w-full object-contain"
            priority
          />
        </div>
        <div className="hidden sm:block">
          <p className="text-lg font-semibold text-slate-900">
            K y A Multiservis
          </p>
          <p className="text-xs text-slate-500">Inventario</p>
        </div>
      </div>
      <nav className="flex items-center gap-1 overflow-x-auto text-sm sm:flex-col">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group relative flex items-center justify-center gap-2 rounded-lg px-3 py-2 transition sm:justify-start sm:gap-3 ${
                active
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-slate-700 hover:bg-amber-200/80 hover:text-slate-900"
              }`}
            >
              <Icon
                className={`text-lg ${
                  active ? "text-amber-100" : "text-teal-600"
                }`}
              />
              <span className="hidden sm:inline">{item.label}</span>
              <span className="pointer-events-none absolute -top-9 left-1/2 hidden -translate-x-1/2 rounded-md border border-slate-200 bg-white px-2 py-1 text-xs font-semibold text-slate-700 shadow-sm group-hover:block sm:hidden">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};
