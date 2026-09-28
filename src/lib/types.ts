// Domain types for the STORE (MAX-MIN) inventory app.

export type StockStatus = "low" | "ok" | "over";

export interface Part {
  id: string;
  model: string;
  image?: string | null;
  pdCode?: string | null;
  partA: string;
  partNo: string;
  productName: string;
  packSize: number;
  /** MAX in boxes. null = not defined ("-" in the sheet). */
  maxBox: number | null;
  /** MIN in boxes. */
  minBox: number;
  /** Current stock in boxes. */
  stockBox: number;
  /** Current stock in pieces. */
  stockPcs: number;
  remark?: string | null;
  /** Whether the part is currently in production. */
  inProduction?: boolean;
}

export interface Category {
  name: string;
  parts: Part[];
}

export type StockFilter = "all" | "max" | "min";

/** Derive the stock light shown in the STATUS column. */
export function getStockStatus(part: Part): StockStatus {
  if (part.stockBox < part.minBox) return "low";
  if (part.maxBox !== null && part.stockBox > part.maxBox) return "over";
  return "ok";
}
