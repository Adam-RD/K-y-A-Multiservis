import Link from "next/link";
import { DataTable } from "@/components/DataTable";
import { Pagination } from "@/components/Pagination";
import { SearchInput } from "@/components/SearchInput";
import { SelectFilter } from "@/components/SelectFilter";
import { StatusBadge } from "@/components/StatusBadge";
import { listProductsPaged } from "@/lib/repositories/products";
import { listCategories } from "@/lib/repositories/categories";
import { ProductDeleteButton } from "./ProductDeleteButton";
import { formatCurrency } from "@/lib/format";
import {
  RiAddLine,
  RiEdit2Line,
  RiFileListLine,
} from "react-icons/ri";

type ProductsPageProps = {
  searchParams?: Promise<{
    q?: string;
    categoryId?: string;
    page?: string;
  }>;
};

const ProductsPage = async ({ searchParams }: ProductsPageProps) => {
  const resolvedSearchParams = searchParams
    ? await searchParams
    : undefined;
  const query = resolvedSearchParams?.q ?? "";
  const categoryId = resolvedSearchParams?.categoryId ?? "";
  const page = Number(resolvedSearchParams?.page ?? "1");
  const pageSize = 7;
  const currentPage = Number.isNaN(page) || page < 1 ? 1 : page;
  const skip = (currentPage - 1) * pageSize;

  const [productsResult, categories] = await Promise.all([
    listProductsPaged({ query, categoryId }, skip, pageSize),
    listCategories(),
  ]);
  const totalPages = Math.max(1, Math.ceil(productsResult.total / pageSize));

  return (
    <div className="flex flex-col gap-6">
      <section className="flex flex-col gap-4 rounded-2xl border border-app bg-white/90 p-5 shadow-soft">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold text-slate-900">Productos</h1>
            <p className="text-sm text-slate-500">
              Administra el catálogo y los niveles de stock.
            </p>
          </div>
          <Link
            href="/products/new"
            className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-teal-700"
          >
            <RiAddLine />
            Nuevo producto
          </Link>
        </div>
        <form className="grid gap-4 md:grid-cols-[1.2fr_0.8fr_auto]">
          <SearchInput
            placeholder="Buscar por nombre"
            defaultValue={query}
            liveSearch
          />
          <SelectFilter
            name="categoryId"
            label="Categoría"
            options={categories.map((category) => ({
              value: category.id,
              label: category.name,
            }))}
            defaultValue={categoryId}
          />
          <button className="h-10 self-end rounded-lg border border-app bg-teal-600 px-4 text-sm font-semibold text-white transition hover:bg-teal-700">
            Filtrar
          </button>
        </form>
      </section>

      <DataTable
        headers={[
          "Producto",
          "Categoría",
          "Precio",
          "Stock",
          "Mínimo",
          "Estado",
          "Acciones",
        ]}
      >
        {productsResult.items.length === 0 ? (
          <tr>
            <td
              colSpan={7}
              className="px-4 py-6 text-center text-sm text-slate-500"
            >
              Sin resultados
            </td>
          </tr>
        ) : (
          productsResult.items.map((product) => {
            const status =
              product.currentStock <= product.minStock ? "Bajo" : "OK";
            return (
              <tr key={product.id} className="text-sm text-slate-700">
                <td className="px-4 py-3">
                  <div className="font-semibold text-slate-900">
                    {product.name}
                  </div>
                  <div className="text-xs text-slate-500">{product.unit}</div>
                </td>
                <td className="px-4 py-3">{product.category.name}</td>
                <td className="px-4 py-3">
                  {formatCurrency(Number(product.salePrice))}
                </td>
                <td className="px-4 py-3">{product.currentStock}</td>
                <td className="px-4 py-3">{product.minStock}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={status} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    <Link
                      href={`/products/${product.id}/edit`}
                      className="inline-flex items-center gap-1 rounded-md border border-teal-300 bg-teal-100/80 px-2 py-1 text-xs font-semibold text-teal-900 transition hover:border-teal-400 hover:bg-teal-200"
                    >
                      <RiEdit2Line />
                      Editar
                    </Link>
                    <Link
                      href={`/products/${product.id}/kardex`}
                      className="inline-flex items-center gap-1 rounded-md border border-sky-300 bg-sky-100/80 px-2 py-1 text-xs font-semibold text-sky-900 transition hover:border-sky-400 hover:bg-sky-200"
                    >
                      <RiFileListLine />
                      Historial
                    </Link>
                    <ProductDeleteButton id={product.id} />
                  </div>
                </td>
              </tr>
            );
          })
        )}
      </DataTable>
      <Pagination
        page={currentPage}
        totalPages={totalPages}
        totalItems={productsResult.total}
        query={{
          q: query || undefined,
          categoryId: categoryId || undefined,
        }}
      />
    </div>
  );
};

export default ProductsPage;
