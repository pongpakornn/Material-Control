"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import StoreView from "@/components/StoreView";

export default function Home() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen w-full bg-[#ece9f1]">
      <Sidebar collapsed={collapsed} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar
          title="STORE ( MAX-MIN )"
          userName="Pongpakorn"
          empId="2124"
          onToggleSidebar={() => setCollapsed((v) => !v)}
        />
        <main className="flex-1 overflow-auto p-4 sm:p-6">
          <StoreView />
        </main>
      </div>
    </div>
  );
}
