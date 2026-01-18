import { DataTable } from "@/components/DataTable";
import { Pagination } from "@/components/Pagination";
import { SelectFilter } from "@/components/SelectFilter";
import { MovementForm } from "./MovementForm";
import { listMovementsPaged } from "@/lib/repositories/movements";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/format";

type MovementsPageProps = {
  searchParams?: Promise<{
    from?: string;
    to?: string;
    productId?: string;
    page?: string;
  }>;
};

const MovementsPage = async ({ searchParams }: MovementsPageProps) => {
  const resolvedSearchParams = searchParams
    ? await searchParams
    : undefined;
  const from = resolvedSearchParams?.from;
  const to = resolvedSearchParams?.to;
  const productId = resolvedSearchParams?.productId;
  const page = Number(resolvedSearchParams?.page ?? "1");
  const pageSize = 7;
  const currentPage = Number.isNaN(page) || page < 1 ? 1 : page;
  const skip = (currentPage - 1) * pageSize;

  const [products, movementsResult] = await Promise.all([
    prisma.product.findMany({ orderBy: { name: "asc" } }),
    listMovementsPaged(
      {
        from,
        to,
        type: "OUT",
        productId,
      },
      skip,
      pageSize
    ),
  ]);
  const totalPages = Math.max(
    1,
    Math.ceil(movementsResult.total / pageSize)
  );

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Movimientos</h1>
        <p className="text-sm text-slate-500">
          Registra ventas de productos.
        </p>
      </div>
      <MovementForm
        products={products.map((product) => ({
          id: product.id,
          name: product.name,
        }))}
      />
      <section className="flex flex-col gap-4 rounded-2xl border border-app bg-white/90 p-5 shadow-soft">
        <form className="grid gap-4 md:grid-cols-[1fr_1fr_1fr_auto]">
          <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Desde
            <input
              type="date"
              name="from"
              defaultValue={from}
              className="mt-1 block w-full rounded-lg border border-app px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-100"
            />
          </label>
          <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Hasta
            <input
              type="date"
              name="to"
              defaultValue={to}
              className="mt-1 block w-full rounded-lg border border-app px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-100"
            />
          </label>
          <SelectFilter
            name="productId"
            label="Producto"
            options={products.map((product) => ({
              value: product.id,
              label: product.name,
            }))}
            defaultValue={productId}
          />
          <button className="h-10 self-end rounded-lg border border-app bg-teal-600 px-4 text-sm font-semibold text-white transition hover:bg-teal-700">
            Filtrar
          </button>
        </form>
      </section>
      <DataTable headers={["Fecha", "Producto", "Qty", "Usuario"]}>
        {movementsResult.items.length === 0 ? (
          <tr>
            <td
              colSpan={4}
              className="px-4 py-6 text-center text-sm text-slate-500"
            >
              Sin resultados
            </td>
          </tr>
        ) : (
          movementsResult.items.map((movement) => (
            <tr key={movement.id} className="text-sm text-slate-700">
              <td className="px-4 py-3">{formatDate(movement.createdAt)}</td>
              <td className="px-4 py-3">{movement.product.name}</td>
              <td className="px-4 py-3">{movement.qty}</td>
              <td className="px-4 py-3">{movement.user.username}</td>
            </tr>
          ))
        )}
      </DataTable>
      <Pagination
        page={currentPage}
        totalPages={totalPages}
        totalItems={movementsResult.total}
        query={{
          from: from || undefined,
          to: to || undefined,
          productId: productId || undefined,
        }}
      />
    </div>
  );
};

export default MovementsPage;
