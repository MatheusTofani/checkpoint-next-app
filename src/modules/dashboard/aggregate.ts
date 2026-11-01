import type { ProductResponse } from "@/src/api/routes/product/productModels";
import type { PurchaseResponse } from "@/src/api/routes/purchase/purchaseModels";
import type { SaleResponse } from "@/src/api/routes/sale/saleModels";

export interface RankedValue {
  name: string;
  value: number;
}

export interface TimePoint {
  label: string;
  sales: number;
  purchases: number;
}

export interface StockMovement {
  name: string;
  purchased: number;
  sold: number;
}

export interface DashboardSummary {
  revenue: number;
  salesCount: number;
  averageTicket: number;
  purchasesTotal: number;
  result: number;
  unitsSold: number;
  timeline: TimePoint[];
  topProducts: RankedValue[];
  categories: RankedValue[];
  paymentMethods: RankedValue[];
  topLeads: RankedValue[];
  stock: StockMovement[];
}

interface AggregateInput {
  sales: SaleResponse[];
  purchases: PurchaseResponse[];
  products: ProductResponse[];
  productId: string;
  category: string;
  /** Período filtrado (yyyy-mm-dd); vazio usa o intervalo dos próprios dados. */
  from: string;
  to: string;
}

const TOP_LIMIT = 8;
const NO_CATEGORY = "Sem categoria";

function addTo(map: Map<string, number>, key: string, value: number) {
  map.set(key, (map.get(key) ?? 0) + value);
}

function ranked(map: Map<string, number>, limit = TOP_LIMIT): RankedValue[] {
  return [...map]
    .map(([name, value]) => ({ name, value }))
    .filter((item) => item.value > 0)
    .sort((a, b) => b.value - a.value)
    .slice(0, limit);
}

// ---- Linha do tempo -------------------------------------------------------

type Granularity = "day" | "month";

function toLocalDay(date: Date) {
  const offset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 10);
}

function bucketKey(iso: string, granularity: Granularity) {
  const day = toLocalDay(new Date(iso));
  return granularity === "day" ? day : day.slice(0, 7);
}

function bucketLabel(key: string, granularity: Granularity) {
  const [year, month, day] = key.split("-").map(Number);
  const date = new Date(year, month - 1, day ?? 1);
  return granularity === "day"
    ? date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })
    : date.toLocaleDateString("pt-BR", { month: "short", year: "2-digit" });
}

/** Todas as chaves entre início e fim, para a linha não "pular" dias sem movimento. */
function bucketRange(start: string, end: string, granularity: Granularity) {
  const keys: string[] = [];
  const cursor = new Date(`${start}T12:00:00`);
  const last = new Date(`${end}T12:00:00`);
  if (granularity === "month") cursor.setDate(1);
  while (cursor <= last && keys.length < 1000) {
    keys.push(bucketKey(cursor.toISOString(), granularity));
    if (granularity === "day") cursor.setDate(cursor.getDate() + 1);
    else cursor.setMonth(cursor.getMonth() + 1);
  }
  return keys;
}

function buildTimeline(
  salesByDay: Map<string, number>,
  purchasesByDay: Map<string, number>,
  from: string,
  to: string
): TimePoint[] {
  const days = [...salesByDay.keys(), ...purchasesByDay.keys()].sort();
  if (!days.length && !(from && to)) return [];

  const start = from || days[0];
  const end = to || days[days.length - 1];
  const spanDays = (new Date(end).getTime() - new Date(start).getTime()) / 86_400_000;
  const granularity: Granularity = spanDays > 62 ? "month" : "day";

  const sales = new Map<string, number>();
  const purchases = new Map<string, number>();
  for (const [day, value] of salesByDay) addTo(sales, granularity === "day" ? day : day.slice(0, 7), value);
  for (const [day, value] of purchasesByDay) addTo(purchases, granularity === "day" ? day : day.slice(0, 7), value);

  return bucketRange(start, end, granularity).map((key) => ({
    label: bucketLabel(key, granularity),
    sales: sales.get(key) ?? 0,
    purchases: purchases.get(key) ?? 0,
  }));
}

// ---- Resumo ---------------------------------------------------------------

export function aggregateDashboard({
  sales,
  purchases,
  products,
  productId,
  category,
  from,
  to,
}: AggregateInput): DashboardSummary {
  const categoryOf = new Map(products.map((p) => [p.id, p.category || NO_CATEGORY]));
  // Filtro por item: uma venda pode ter produtos de categorias diferentes
  const matches = (id: string) =>
    (!productId || id === productId) && (!category || categoryOf.get(id) === category);

  let revenue = 0;
  let salesCount = 0;
  let unitsSold = 0;
  const salesByDay = new Map<string, number>();
  const byProduct = new Map<string, number>();
  const byCategory = new Map<string, number>();
  const byPayment = new Map<string, number>();
  const byLead = new Map<string, number>();
  const stock = new Map<string, StockMovement>();

  const stockOf = (id: string, name: string) => {
    let entry = stock.get(id);
    if (!entry) stock.set(id, (entry = { name, purchased: 0, sold: 0 }));
    return entry;
  };

  for (const sale of sales) {
    const items = sale.items.filter((item) => matches(item.productId));
    if (!items.length) continue;

    // Rateia os descontos da venda entre os itens, proporcional ao valor de cada um
    const ratio = sale.subtotal > 0 ? sale.total / sale.subtotal : 0;
    let saleRevenue = 0;
    for (const item of items) {
      const value = item.total * ratio;
      saleRevenue += value;
      unitsSold += item.quantity;
      addTo(byProduct, item.name, value);
      addTo(byCategory, categoryOf.get(item.productId) ?? NO_CATEGORY, value);
      stockOf(item.productId, item.name).sold += item.quantity;
    }

    revenue += saleRevenue;
    salesCount++;
    addTo(salesByDay, toLocalDay(new Date(sale.soldAt)), saleRevenue);
    addTo(byPayment, sale.paymentMethod, saleRevenue);
    if (sale.lead) addTo(byLead, sale.lead.name, saleRevenue);
  }

  let purchasesTotal = 0;
  const purchasesByDay = new Map<string, number>();
  for (const purchase of purchases) {
    let purchaseTotal = 0;
    for (const item of purchase.items) {
      if (!matches(item.productId)) continue;
      purchaseTotal += item.price;
      stockOf(item.productId, item.name).purchased += item.quantity;
    }
    if (!purchaseTotal) continue;
    purchasesTotal += purchaseTotal;
    addTo(purchasesByDay, toLocalDay(new Date(purchase.purchasedAt)), purchaseTotal);
  }

  return {
    revenue,
    salesCount,
    averageTicket: salesCount ? revenue / salesCount : 0,
    purchasesTotal,
    result: revenue - purchasesTotal,
    unitsSold,
    timeline: buildTimeline(salesByDay, purchasesByDay, from, to),
    topProducts: ranked(byProduct),
    categories: ranked(byCategory),
    paymentMethods: ranked(byPayment),
    topLeads: ranked(byLead),
    stock: [...stock.values()]
      .sort((a, b) => b.purchased + b.sold - (a.purchased + a.sold))
      .slice(0, TOP_LIMIT),
  };
}
