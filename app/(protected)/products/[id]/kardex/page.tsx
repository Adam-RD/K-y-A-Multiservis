import { notFound } from "next/navigation";
import { DataTable } from "@/components/DataTable";
import { Pagination } from "@/components/Pagination";
import { formatDate } from "@/lib/format";
import { formatMovementReason, formatMovementType } from "@/lib/labels";
import { listMovementsPaged } from "@/lib/repositories/movements";
import { getProductById } from "@/lib/repositories/products";

type KardexPageProps = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ page?: string }>;
};

const KardexPage = async ({ params, searchParams }: KardexPageProps) => {
  const resolvedParams = await params;
  const resolvedSearchParams = searchParams
    ? await searchParams
    : undefined;
  const page = Number(resolvedSearchParams?.page ?? "1");
  const pageSize = 7;
  const currentPage = Number.isNaN(page) || page < 1 ? 1 : page;
  const skip = (currentPage - 1) * pageSize;
  const product = await getProductById(resolvedParams.id);
  if (!product) {
    notFound();
  }
  const movementsResult = await listMovementsPaged(
    { productId: product.id },
    skip,
    pageSize
  );
  const totalPages = Math.max(
    1,
    Math.ceil(movementsResult.total / pageSize)
  );
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">
          Historial de movimientos
        </h1>
        <p className="text-sm text-slate-500">{product.name}</p>
      </div>
      <DataTable headers={["Fecha", "Tipo", "Motivo", "Qty", "Usuario"]}>
        {movementsResult.items.length === 0 ? (
          <tr>
            <td
              colSpan={5}
              className="px-4 py-6 text-center text-sm text-slate-500"
            >
              Sin resultados
            </td>
          </tr>
        ) : (
          movementsResult.items.map((movement) => (
            <tr key={movement.id} className="text-sm text-slate-700">
              <td className="px-4 py-3">{formatDate(movement.createdAt)}</td>
              <td className="px-4 py-3 font-semibold">
                {formatMovementType(movement.type)}
              </td>
              <td className="px-4 py-3">
                {formatMovementReason(movement.reason)}
              </td>
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
      />
    </div>
  );
};

export default KardexPage;
