import { prisma } from "@/lib/prisma";
import { KpiCard } from "@/components/KpiCard";
import { DataTable } from "@/components/DataTable";
import { formatCurrency } from "@/lib/format";
import { SelectFilter } from "@/components/SelectFilter";
import {
  RiMoneyDollarCircleLine,
  RiShoppingBag3Line,
  RiLineChartLine,
  RiPriceTag3Line,
} from "react-icons/ri";

const formatPercent = (value: number) => `${value.toFixed(1)}%`;

const summarizeSales = (
  movements: Array<{
    qty: number;
    product: { salePrice: unknown; costPrice: unknown };
  }>
) => {
  return movements.reduce(
    (acc, movement) => {
      const salePrice = Number(movement.product.salePrice);
      const costPrice = Number(movement.product.costPrice);
      const revenue = movement.qty * salePrice;
      const cost = movement.qty * costPrice;
      acc.revenue += revenue;
      acc.cost += cost;
      acc.qty += movement.qty;
      acc.count += 1;
      return acc;
    },
    { revenue: 0, cost: 0, qty: 0, count: 0 }
  );
};

type StatsPageProps = {
  searchParams?: Promise<{ range?: string }>;
};

const StatsPage = async ({ searchParams }: StatsPageProps) => {
  const resolvedSearchParams = searchParams
    ? await searchParams
    : undefined;
  const rangeParam = resolvedSearchParams?.range ?? "30";
  const rangeDays =
    rangeParam === ""
      ? null
      : Number.isNaN(Number(rangeParam)) || Number(rangeParam) <= 0
      ? 30
      : Number(rangeParam);
  const now = new Date();
  const fromRange = rangeDays ? new Date(now) : null;
  if (fromRange && rangeDays) {
    fromRange.setDate(now.getDate() - rangeDays);
  }

  const [salesAll, salesRange] = await Promise.all([
    prisma.stockMovement.findMany({
      where: { type: "OUT", reason: "SALE" },
      include: { product: { select: { id: true, name: true, salePrice: true, costPrice: true } } },
    }),
    rangeDays
      ? prisma.stockMovement.findMany({
          where: {
            type: "OUT",
            reason: "SALE",
            createdAt: fromRange ? { gte: fromRange } : undefined,
          },
          include: {
            product: {
              select: { id: true, name: true, salePrice: true, costPrice: true },
            },
          },
        })
      : Promise.resolve([]),
  ]);

  const effectiveRange = rangeDays ? salesRange : salesAll;
  const summaryAll = summarizeSales(salesAll);
  const summaryRange = summarizeSales(effectiveRange);
  const profitAll = summaryAll.revenue - summaryAll.cost;
  const profitRange = summaryRange.revenue - summaryRange.cost;
  const marginAll = summaryAll.revenue
    ? (profitAll / summaryAll.revenue) * 100
    : 0;
  const marginRange = summaryRange.revenue
    ? (profitRange / summaryRange.revenue) * 100
    : 0;

  const productTotals = new Map<
    string,
    { name: string; units: number; revenue: number; profit: number }
  >();
  effectiveRange.forEach((movement) => {
    const salePrice = Number(movement.product.salePrice);
    const costPrice = Number(movement.product.costPrice);
    const revenue = movement.qty * salePrice;
    const profit = movement.qty * (salePrice - costPrice);
    const current = productTotals.get(movement.product.id) || {
      name: movement.product.name,
      units: 0,
      revenue: 0,
      profit: 0,
    };
    current.units += movement.qty;
    current.revenue += revenue;
    current.profit += profit;
    productTotals.set(movement.product.id, current);
  });

  const topProducts = Array.from(productTotals.values())
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 6);
  const rangeLabel = rangeDays ? `${rangeDays} dias` : "total";

  return (
    <div className="flex flex-col gap-6">
      <section className="flex flex-col gap-4 rounded-2xl border border-app bg-white/90 p-5 shadow-soft">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold text-slate-900">
              Ganancias y estadisticas
            </h1>
            <p className="text-sm text-slate-500">
              Resumen de ventas y rentabilidad del inventario.
            </p>
          </div>
          <form className="grid gap-3 md:grid-cols-[minmax(200px,_1fr)_auto]">
            <SelectFilter
              name="range"
              label="Rango"
              options={[
                { value: "7", label: "7 dias" },
                { value: "30", label: "30 dias" },
                { value: "90", label: "90 dias" },
              ]}
              defaultValue={rangeParam}
            />
            <button className="h-10 self-end rounded-lg border border-app bg-teal-600 px-4 text-sm font-semibold text-white transition hover:bg-teal-700">
              Aplicar
            </button>
          </form>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          title={`Ingresos (${rangeLabel})`}
          value={formatCurrency(summaryRange.revenue)}
          icon={<RiMoneyDollarCircleLine className="text-emerald-600" />}
        />
        <KpiCard
          title={`Costo vendido (${rangeLabel})`}
          value={formatCurrency(summaryRange.cost)}
          icon={<RiPriceTag3Line className="text-amber-600" />}
        />
        <KpiCard
          title={`Ganancia (${rangeLabel})`}
          value={formatCurrency(profitRange)}
          icon={<RiLineChartLine className="text-sky-600" />}
          helper={`Margen ${formatPercent(marginRange)}`}
        />
        <KpiCard
          title={`Ventas (${rangeLabel})`}
          value={`${summaryRange.qty}`}
          icon={<RiShoppingBag3Line className="text-rose-600" />}
          helper={`${summaryRange.count} movimientos`}
        />
      </section>

      {rangeDays ? (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <KpiCard
            title="Ingresos (total)"
            value={formatCurrency(summaryAll.revenue)}
            icon={<RiMoneyDollarCircleLine className="text-emerald-600" />}
          />
          <KpiCard
            title="Costo vendido (total)"
            value={formatCurrency(summaryAll.cost)}
            icon={<RiPriceTag3Line className="text-amber-600" />}
          />
          <KpiCard
            title="Ganancia (total)"
            value={formatCurrency(profitAll)}
            icon={<RiLineChartLine className="text-sky-600" />}
            helper={`Margen ${formatPercent(marginAll)}`}
          />
          <KpiCard
            title="Ventas (total)"
            value={`${summaryAll.qty}`}
            icon={<RiShoppingBag3Line className="text-rose-600" />}
            helper={`${summaryAll.count} movimientos`}
          />
        </section>
      ) : null}

      <section className="flex flex-col gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Productos mas vendidos ({rangeLabel})
          </h2>
          <p className="text-sm text-slate-500">
            Top productos por ingresos generados.
          </p>
        </div>
        <DataTable headers={["Producto", "Unidades", "Ingresos", "Ganancia"]}>
          {topProducts.length === 0 ? (
            <tr>
              <td
                colSpan={4}
                className="px-4 py-6 text-center text-sm text-slate-500"
              >
                Sin resultados
              </td>
            </tr>
          ) : (
            topProducts.map((product) => (
              <tr key={product.name} className="text-sm text-slate-700">
                <td className="px-4 py-3">{product.name}</td>
                <td className="px-4 py-3">{product.units}</td>
                <td className="px-4 py-3">
                  {formatCurrency(product.revenue)}
                </td>
                <td className="px-4 py-3">
                  {formatCurrency(product.profit)}
                </td>
              </tr>
            ))
          )}
        </DataTable>
      </section>
    </div>
  );
};

export default StatsPage;
