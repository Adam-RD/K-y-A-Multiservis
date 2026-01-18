import { prisma } from "@/lib/prisma";
import { KpiCard } from "@/components/KpiCard";
import { DataTable } from "@/components/DataTable";
import { Pagination } from "@/components/Pagination";
import { formatCurrency, formatDate } from "@/lib/format";
import { formatMovementType } from "@/lib/labels";
import {
  RiBox3Line,
  RiExchangeLine,
  RiLineChartLine,
  RiAlarmWarningLine,
} from "react-icons/ri";

type DashboardPageProps = {
  searchParams?: Promise<{ page?: string }>;
};

const DashboardPage = async ({ searchParams }: DashboardPageProps) => {
  const resolvedSearchParams = searchParams
    ? await searchParams
    : undefined;
  const page = Number(resolvedSearchParams?.page ?? "1");
  const pageSize = 7;
  const currentPage = Number.isNaN(page) || page < 1 ? 1 : page;
  const skip = (currentPage - 1) * pageSize;

  const [totalProducts, products, movementTotal, recentMovements] =
    await Promise.all([
      prisma.product.count(),
      prisma.product.findMany({
        select: { currentStock: true, costPrice: true, minStock: true },
      }),
      prisma.stockMovement.count({ where: { type: "OUT" } }),
      prisma.stockMovement.findMany({
        take: pageSize,
        skip,
        orderBy: { createdAt: "desc" },
        include: { product: true },
        where: { type: "OUT" },
      }),
    ]);
  const totalPages = Math.max(1, Math.ceil(movementTotal / pageSize));

  const inventoryValue = products.reduce(
    (
      acc: number,
      item: { currentStock: number; costPrice: unknown }
    ) => {
      const cost = Number(item.costPrice);
      return acc + item.currentStock * cost;
    },
    0
  );
  const lowStock = products.filter(
    (item) => item.currentStock <= item.minStock
  ).length;

  return (
    <div className="flex flex-col gap-6">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          title="Total productos"
          value={`${totalProducts}`}
          icon={<RiBox3Line className="text-emerald-600" />}
        />
        <KpiCard
          title="Stock bajo"
          value={`${lowStock}`}
          icon={<RiAlarmWarningLine className="text-amber-600" />}
          helper="Stock <= mínimo"
        />
        <KpiCard
          title="Valor inventario"
          value={formatCurrency(inventoryValue)}
          icon={<RiLineChartLine className="text-sky-600" />}
        />
        <KpiCard
          title="Movimientos recientes"
          value={`${movementTotal}`}
          icon={<RiExchangeLine className="text-rose-600" />}
        />
      </section>

      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Movimientos recientes
            </h2>
            <p className="text-sm text-slate-500">
              Últimos 10 movimientos registrados.
            </p>
          </div>
        </div>
        <DataTable headers={["Fecha", "Tipo", "Producto", "Qty"]}>
          {recentMovements.length === 0 ? (
            <tr>
              <td
                colSpan={4}
                className="px-4 py-6 text-center text-sm text-slate-500"
              >
                Sin resultados
              </td>
            </tr>
          ) : (
            recentMovements.map((movement) => (
              <tr key={movement.id} className="text-sm text-slate-700">
                <td className="px-4 py-3">{formatDate(movement.createdAt)}</td>
                <td className="px-4 py-3 font-semibold">
                  {formatMovementType(movement.type)}
                </td>
                <td className="px-4 py-3">{movement.product.name}</td>
                <td className="px-4 py-3">{movement.qty}</td>
              </tr>
            ))
          )}
        </DataTable>
        <Pagination
          page={currentPage}
          totalPages={totalPages}
          totalItems={movementTotal}
        />
      </section>
    </div>
  );
};

export default DashboardPage;
