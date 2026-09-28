"use client";

import { useState } from "react";
import {
  BoxIcon,
  CalculatorIcon,
  ChevronDownIcon,
  DashboardIcon,
  RegisterIcon,
  ScannerIcon,
  StackIcon,
} from "./icons";

interface NavItem {
  key: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  hasChildren?: boolean;
}

const items: NavItem[] = [
  { key: "dashboard", label: "Dashboard", icon: DashboardIcon },
  { key: "store", label: "Store ( Max - Min )", icon: BoxIcon },
  { key: "scanner", label: "MULTI-SCANNER", icon: ScannerIcon, hasChildren: true },
  { key: "inventory", label: "Inventory Registration", icon: RegisterIcon },
  { key: "calculator", label: "Max-Min Calculator", icon: CalculatorIcon },
];

export default function Sidebar({ collapsed }: { collapsed: boolean }) {
  const [active, setActive] = useState("store");

  if (collapsed) return null;

  return (
    <aside className="hidden w-64 shrink-0 flex-col bg-[#1f1d2b] text-slate-300 md:flex">
      {/* Logo */}
      <div className="flex h-[72px] items-center gap-3 px-6">
        <StackIcon className="h-8 w-8 text-emerald-400" />
        <span className="text-xl font-extrabold tracking-wide text-white">
          STORE <span className="text-emerald-400">PC</span>
        </span>
      </div>

      <nav className="mt-4 flex flex-1 flex-col gap-1 px-3">
        {items.map((item) => {
          const isActive = active === item.key;
          const Icon = item.icon;
          return (
            <button
              key={item.key}
              onClick={() => setActive(item.key)}
              className={`group flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-white/10 text-white"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon className="h-5 w-5 shrink-0" />
              <span className="flex-1 text-left">{item.label}</span>
              {item.hasChildren && <ChevronDownIcon className="h-4 w-4" />}
            </button>
          );
        })}
      </nav>

      <div className="px-6 py-4 text-[11px] text-slate-500">
        © 2026 Pongpakorn Urang
      </div>
    </aside>
  );
}
