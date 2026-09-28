"use client";

import { useEffect, useMemo, useState } from "react";
import { fetchStore } from "@/lib/api";
import { getStockStatus, type Category, type Part, type StockFilter } from "@/lib/types";
import { BoxIcon, ChevronDownIcon, SearchIcon, StackIcon } from "./icons";

const statusColor: Record<string, string> = {
  low: "bg-red-500 shadow-[0_0_10px_2px_rgba(239,68,68,0.5)]",
  ok: "bg-green-500 shadow-[0_0_10px_2px_rgba(34,197,94,0.4)]",
  over: "bg-green-700",
};

function StatusDot({ part }: { part: Part }) {
  const status = getStockStatus(part);
  return (
    <span className="inline-flex justify-center">
      <span className={`h-5 w-5 rounded-full ${statusColor[status]}`} />
    </span>
  );
}

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!on)}
      className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors ${
        on ? "bg-emerald-500" : "bg-slate-300"
      }`}
    >
      <span
        className={`inline-block h-6 w-6 transform rounded-full bg-white shadow transition-transform ${
          on ? "translate-x-7" : "translate-x-1"
        }`}
      />
      <span
        className={`absolute text-[10px] font-bold ${
          on ? "left-2 text-white" : "right-1.5 text-slate-600"
        }`}
      >
        {on ? "ON" : "OFF"}
      </span>
    </button>
  );
}

const CUSTOMERS = ["ALL CUSTOMERS", "JTEKT", "TGT"];

export default function StoreView() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [customer, setCustomer] = useState("ALL CUSTOMERS");
  const [filter, setFilter] = useState<StockFilter>("all");
  const [showProduction, setShowProduction] = useState(false);

  useEffect(() => {
    fetchStore()
      .then(setCategories)
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return categories
      .filter((c) => customer === "ALL CUSTOMERS" || c.name === customer)
      .map((cat) => {
        const parts = cat.parts.filter((p) => {
          const status = getStockStatus(p);
          if (filter === "max" && status !== "over") return false;
          if (filter === "min" && status !== "low") return false;
          if (showProduction && !p.inProduction) return false;
          if (!q) return true;
          return (
            p.partA.toLowerCase().includes(q) ||
            p.partNo.toLowerCase().includes(q) ||
            p.productName.toLowerCase().includes(q) ||
            p.model.toLowerCase().includes(q)
          );
        });
        return { ...cat, parts };
      })
      .filter((c) => c.parts.length > 0);
  }, [categories, query, customer, filter, showProduction]);

  const columns = [
    "MODEL", "IMAGE", "PD CODE", "PART A", "PART NO", "PRODUCT NAME",
    "PACKSIZE", "MAX(BOX)", "MIN(BOX)", "STOCK(BOX)", "STOCK(PCS)", "REMARK", "STATUS",
  ];

  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm sm:p-6">
      {/* Header row */}
      <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <BoxIcon className="h-8 w-8 text-slate-700" />
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-800">
            STORE ( MAX - MIN )
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <label className="text-xs font-semibold text-slate-500">CUSTOMER:</label>
          <div className="relative">
            <select
              value={customer}
              onChange={(e) => setCustomer(e.target.value)}
              className="appearance-none rounded-lg border border-slate-300 bg-white py-2 pl-3 pr-9 text-sm font-medium text-slate-700 focus:border-emerald-500 focus:outline-none"
            >
              {CUSTOMERS.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
            <ChevronDownIcon className="pointer-events-none absolute right-2 top-2.5 h-4 w-4 text-slate-400" />
          </div>

          <FilterButton
            active={filter === "max"}
            onClick={() => setFilter(filter === "max" ? "all" : "max")}
            icon={<StackIcon className="h-4 w-4 text-amber-400" />}
            label="MAX Stock"
          />
          <FilterButton
            active={filter === "min"}
            onClick={() => setFilter(filter === "min" ? "all" : "min")}
            icon={<StackIcon className="h-4 w-4 text-red-400" />}
            label="MIN Stock"
          />
          <FilterButton
            active={filter === "all"}
            onClick={() => setFilter("all")}
            icon={<BoxIcon className="h-4 w-4 text-slate-300" />}
            label="SHOW ALL"
          />
        </div>
      </div>

      {/* Search row */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex flex-1 items-stretch overflow-hidden rounded-lg border border-slate-300">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && setQuery(search)}
            placeholder="ค้นหา Part Code หรือ Part Name..."
            className="flex-1 px-4 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
          />
          <button
            onClick={() => setQuery(search)}
            className="flex items-center gap-2 bg-slate-100 px-5 text-sm font-semibold text-slate-700 hover:bg-slate-200"
          >
            <SearchIcon className="h-4 w-4" /> SEARCH
          </button>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-slate-500">SHOW PRODUCTION :</span>
          <Toggle on={showProduction} onChange={setShowProduction} />
        </div>
      </div>

      {/* Table */}
      <div className="max-h-[70vh] overflow-auto rounded-lg border border-slate-200">
        <table className="w-full min-w-[1100px] border-collapse text-sm">
          <thead className="sticky top-0 z-10">
            <tr className="bg-[#3a3745] text-xs font-semibold text-white">
              {columns.map((c) => (
                <th key={c} className="whitespace-nowrap px-3 py-3 text-left first:pl-4">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={columns.length} className="px-4 py-10 text-center text-slate-400">
                  กำลังโหลดข้อมูล...
                </td>
              </tr>
            )}
            {!loading && filtered.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="px-4 py-10 text-center text-slate-400">
                  ไม่พบข้อมูล
                </td>
              </tr>
            )}
            {filtered.map((cat) => (
              <CategoryGroup key={cat.name} cat={cat} colSpan={columns.length} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CategoryGroup({ cat, colSpan }: { cat: Category; colSpan: number }) {
  return (
    <>
      <tr className="bg-[#f4eef9]">
        <td colSpan={colSpan} className="px-4 py-2">
          <span className="inline-flex items-center gap-2 text-sm font-bold text-purple-800">
            <BoxIcon className="h-4 w-4" /> CATEGORY : {cat.name}
            <span className="rounded-full bg-purple-200/70 px-2 py-0.5 text-[11px] font-semibold text-purple-800">
              {cat.parts.length} รายการ
            </span>
          </span>
        </td>
      </tr>
      {cat.parts.map((p) => (
        <tr key={p.id} className="border-b border-slate-100 hover:bg-slate-50">
          <td className="px-3 py-3 pl-4 font-medium text-slate-700">{p.model}</td>
          <td className="px-3 py-3">
            <div className="flex h-9 w-12 items-center justify-center rounded bg-slate-100 text-slate-400">
              {p.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.image} alt={p.productName} className="h-9 w-12 rounded object-contain" />
              ) : (
                <BoxIcon className="h-4 w-4" />
              )}
            </div>
          </td>
          <td className="px-3 py-3 text-slate-600">{p.pdCode ?? ""}</td>
          <td className="px-3 py-3 font-medium text-slate-700">{p.partA}</td>
          <td className="px-3 py-3 text-slate-600">{p.partNo}</td>
          <td className="px-3 py-3 text-slate-700">{p.productName}</td>
          <td className="px-3 py-3 text-slate-600">{p.packSize}</td>
          <td className="px-3 py-3 text-slate-600">{p.maxBox ?? "-"}</td>
          <td className="px-3 py-3 text-slate-600">{p.minBox}</td>
          <td className="px-3 py-3 font-semibold text-slate-700">{p.stockBox}</td>
          <td className="px-3 py-3 text-slate-600">{p.stockPcs}</td>
          <td className="px-3 py-3 text-slate-500">{p.remark ?? ""}</td>
          <td className="px-3 py-3 text-center">
            <StatusDot part={p} />
          </td>
        </tr>
      ))}
    </>
  );
}

function FilterButton({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white transition-colors ${
        active ? "bg-[#2b2838] ring-2 ring-emerald-400" : "bg-[#2b2838] hover:bg-[#37334a]"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
