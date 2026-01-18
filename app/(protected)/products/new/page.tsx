import { ProductForm } from "../ProductForm";
import { listCategories } from "@/lib/repositories/categories";
import { createProductAction } from "../actions";

const NewProductPage = async () => {
  const categories = await listCategories();

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Nuevo producto</h1>
        <p className="text-sm text-slate-500">
          Completa los datos para registrar un producto.
        </p>
      </div>
      <ProductForm
        categories={categories}
        onSubmitAction={createProductAction}
        submitLabel="Crear producto"
        cancelHref="/products"
      />
    </div>
  );
};

export default NewProductPage;
