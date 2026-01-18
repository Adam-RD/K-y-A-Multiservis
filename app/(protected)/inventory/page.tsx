import { prisma } from "@/lib/prisma";
import { AddStockForm } from "./AddStockForm";

const InventoryPage = async () => {
  const products = await prisma.product.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">
          Ingreso de inventario
        </h1>
        <p className="text-sm text-slate-500">
          Suma stock a productos existentes.
        </p>
      </div>
      <AddStockForm products={products} />
    </div>
  );
};

export default InventoryPage;
