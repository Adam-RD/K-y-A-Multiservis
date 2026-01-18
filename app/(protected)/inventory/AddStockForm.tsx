"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { addStockFormSchema, AddStockFormInput } from "@/lib/validators";
import { addStockAction } from "./actions";

type ProductOption = {
  id: string;
  name: string;
};

type AddStockFormProps = {
  products: ProductOption[];
};

export const AddStockForm = ({ products }: AddStockFormProps) => {
  const [serverError, setServerError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddStockFormInput>({
    resolver: zodResolver(addStockFormSchema),
    defaultValues: {
      productId: "",
      qty: 1,
    },
  });

  const onSubmit = (data: AddStockFormInput) => {
    setServerError(null);
    const formData = new FormData();
    formData.append("productId", data.productId);
    formData.append("qty", data.qty.toString());
    startTransition(async () => {
      const result = await addStockAction(formData);
      if (result?.error) {
        setServerError(result.error);
        toast.error(result.error);
        return;
      }
      toast.success("Stock ingresado.");
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
            Producto
          </label>
          <select
            {...register("productId")}
            className="mt-1 w-full rounded-lg border border-app px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-100"
          >
            <option value="">Selecciona</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </select>
          {errors.productId ? (
            <p className="mt-1 text-xs text-rose-500">
              {errors.productId.message}
            </p>
          ) : null}
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Cantidad a ingresar
          </label>
          <input
            type="number"
            {...register("qty", { valueAsNumber: true })}
            className="mt-1 w-full rounded-lg border border-app px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-100"
          />
          {errors.qty ? (
            <p className="mt-1 text-xs text-rose-500">{errors.qty.message}</p>
          ) : null}
        </div>
      </div>
      {serverError ? (
        <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-600">
          {serverError}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={isPending}
        className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isPending ? "Ingresando..." : "Ingresar stock"}
      </button>
    </form>
  );
};
