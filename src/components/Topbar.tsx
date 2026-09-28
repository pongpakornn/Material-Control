"use client";

import { LogoutIcon, MenuIcon, UserIcon } from "./icons";

interface TopbarProps {
  title: string;
  userName: string;
  empId: string;
  onToggleSidebar: () => void;
}

export default function Topbar({ title, userName, empId, onToggleSidebar }: TopbarProps) {
  return (
    <header className="flex h-[72px] items-center bg-[#1f1d2b] px-4 text-white">
      <button
        onClick={onToggleSidebar}
        aria-label="Toggle menu"
        className="rounded-lg p-2 text-slate-300 hover:bg-white/10 hover:text-white"
      >
        <MenuIcon className="h-6 w-6" />
      </button>

      <h1 className="flex-1 text-center text-lg font-bold tracking-wide sm:text-xl">
        {title}
      </h1>

      <div className="flex items-center gap-3">
        <div className="text-right leading-tight">
          <div className="text-sm font-semibold">{userName}</div>
          <div className="text-[11px] text-slate-400">EmpID: {empId}</div>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
          <UserIcon className="h-6 w-6 text-slate-200" />
        </div>
        <button
          aria-label="Logout"
          className="rounded-lg p-2 text-slate-300 hover:bg-white/10 hover:text-white"
        >
          <LogoutIcon className="h-6 w-6" />
        </button>
      </div>
    </header>
  );
}
