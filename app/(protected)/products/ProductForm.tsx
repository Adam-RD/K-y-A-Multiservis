"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  productFormSchema,
  ProductFormInput,
  ProductInput,
} from "@/lib/validators";

type Option = {
  id: string;
  name: string;
};

type ActionResult = {
  error?: string;
};

type ProductFormProps = {
  categories: Option[];
  initialValues?: ProductInput;
  onSubmitAction: (formData: FormData) => Promise<ActionResult>;
  submitLabel: string;
  cancelHref: string;
};

const units = ["unidad", "paquete", "caja"];

export const ProductForm = ({
  categories,
  initialValues,
  onSubmitAction,
  submitLabel,
  cancelHref,
}: ProductFormProps) => {
  const [serverError, setServerError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormInput>({
    resolver: zodResolver(productFormSchema),
    defaultValues: initialValues ?? {
      name: "",
      categoryId: "",
      unit: "unidad",
      costPrice: 0,
      salePrice: 0,
      minStock: 0,
      currentStock: 0,
    },
  });

  const onSubmit = (data: ProductFormInput) => {
    setServerError(null);
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (typeof value === "boolean") {
        if (value) {
          formData.append(key, "on");
        }
      } else {
        formData.append(key, value.toString());
      }
    });
    startTransition(async () => {
      const result = await onSubmitAction(formData);
      if (result?.error) {
        setServerError(result.error);
        toast.error(result.error);
        return;
      }
      toast.success("Producto guardado.");
      router.push("/products");
      router.refresh();
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid gap-4 rounded-2xl border border-app bg-white/90 p-6 shadow-soft"
    >
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Nombre
          </label>
          <input
            {...register("name")}
            className="mt-1 w-full rounded-lg border border-app px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-100"
          />
          {errors.name ? (
            <p className="mt-1 text-xs text-rose-500">
              {errors.name.message}
            </p>
          ) : null}
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Categoría
          </label>
          <select
            {...register("categoryId")}
            className="mt-1 w-full rounded-lg border border-app px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-100"
          >
            <option value="">Selecciona</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.categoryId ? (
            <p className="mt-1 text-xs text-rose-500">
              {errors.categoryId.message}
            </p>
          ) : null}
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Unidad
          </label>
          <select
            {...register("unit")}
            className="mt-1 w-full rounded-lg border border-app px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-100"
          >
            {units.map((unit) => (
              <option key={unit} value={unit}>
                {unit}
              </option>
            ))}
          </select>
          {errors.unit ? (
            <p className="mt-1 text-xs text-rose-500">
              {errors.unit.message}
            </p>
          ) : null}
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Costo
          </label>
          <input
            type="number"
            step="0.01"
            {...register("costPrice", { valueAsNumber: true })}
            className="mt-1 w-full rounded-lg border border-app px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-100"
          />
          {errors.costPrice ? (
            <p className="mt-1 text-xs text-rose-500">
              {errors.costPrice.message}
            </p>
          ) : null}
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Precio venta
          </label>
          <input
            type="number"
            step="0.01"
            {...register("salePrice", { valueAsNumber: true })}
            className="mt-1 w-full rounded-lg border border-app px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-100"
          />
          {errors.salePrice ? (
            <p className="mt-1 text-xs text-rose-500">
              {errors.salePrice.message}
            </p>
          ) : null}
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Stock mínimo
          </label>
          <input
            type="number"
            {...register("minStock", { valueAsNumber: true })}
            className="mt-1 w-full rounded-lg border border-app px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-100"
          />
          {errors.minStock ? (
            <p className="mt-1 text-xs text-rose-500">
              {errors.minStock.message}
            </p>
          ) : null}
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Stock actual
          </label>
          <input
            type="number"
            {...register("currentStock", { valueAsNumber: true })}
            className="mt-1 w-full rounded-lg border border-app px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-100"
          />
          {errors.currentStock ? (
            <p className="mt-1 text-xs text-rose-500">
              {errors.currentStock.message}
            </p>
          ) : null}
        </div>
      </div>
      {serverError ? (
        <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-600">
          {serverError}
        </p>
      ) : null}
      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isPending ? "Guardando..." : submitLabel}
        </button>
        <Link
          href={cancelHref}
          className="rounded-lg border border-app px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-amber-50/80"
        >
          Cancelar
        </Link>
      </div>
    </form>
  );
};
