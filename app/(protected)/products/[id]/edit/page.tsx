import { notFound } from "next/navigation";
import { ProductForm } from "../../ProductForm";
import { listCategories } from "@/lib/repositories/categories";
import { getProductById } from "@/lib/repositories/products";
import { updateProductAction } from "../../actions";

type EditProductPageProps = {
  params: Promise<{ id: string }>;
};

const EditProductPage = async ({ params }: EditProductPageProps) => {
  const resolvedParams = await params;
  const [product, categories] = await Promise.all([
    getProductById(resolvedParams.id),
    listCategories(),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Editar producto</h1>
        <p className="text-sm text-slate-500">
          Actualiza la información del producto.
        </p>
      </div>
      <ProductForm
        categories={categories}
        initialValues={{
          name: product.name,
          categoryId: product.categoryId,
          unit: product.unit,
          costPrice: Number(product.costPrice),
          salePrice: Number(product.salePrice),
          minStock: product.minStock,
          currentStock: product.currentStock,
        }}
        onSubmitAction={updateProductAction.bind(null, product.id)}
        submitLabel="Guardar cambios"
        cancelHref="/products"
      />
    </div>
  );
};

export default EditProductPage;
