import { listCategoriesPaged } from "@/lib/repositories/categories";
import { CategoryManager } from "./CategoryManager";

type CategoriesPageProps = {
  searchParams?: Promise<{ page?: string }>;
};

const CategoriesPage = async ({ searchParams }: CategoriesPageProps) => {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const page = Number(resolvedSearchParams?.page ?? "1");
  const pageSize = 7;
  const currentPage = Number.isNaN(page) || page < 1 ? 1 : page;
  const skip = (currentPage - 1) * pageSize;

  const categoriesResult = await listCategoriesPaged(skip, pageSize);
  const totalPages = Math.max(
    1,
    Math.ceil(categoriesResult.total / pageSize)
  );
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Categorías</h1>
        <p className="text-sm text-slate-500">
          Administra las categorías del inventario.
        </p>
      </div>
      <CategoryManager
        categories={categoriesResult.items.map((category) => ({
          id: category.id,
          name: category.name,
        }))}
        totalItems={categoriesResult.total}
        page={currentPage}
        totalPages={totalPages}
      />
    </div>
  );
};

export default CategoriesPage;
