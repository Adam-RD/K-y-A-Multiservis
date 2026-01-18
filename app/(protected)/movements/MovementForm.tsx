"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { movementFormSchema, MovementFormInput } from "@/lib/validators";
import { createMovementAction } from "./actions";

type ProductOption = {
  id: string;
  name: string;
};

type MovementFormProps = {
  products: ProductOption[];
};

export const MovementForm = ({ products }: MovementFormProps) => {
  const [serverError, setServerError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MovementFormInput>({
    resolver: zodResolver(movementFormSchema),
    defaultValues: {
      type: "OUT",
      reason: "SALE",
      qty: 1,
      productId: "",
    },
  });

  const onSubmit = (data: MovementFormInput) => {
    setServerError(null);
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        formData.append(key, value.toString());
      }
    });
    startTransition(async () => {
      const result = await createMovementAction(formData);
      if (result?.error) {
        setServerError(result.error);
        toast.error(result.error);
        return;
      }
      toast.success("Movimiento registrado.");
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid gap-4 rounded-2xl border border-app bg-white/90 p-6 shadow-soft"
    >
      <input type="hidden" {...register("type")} />
      <input type="hidden" {...register("reason")} />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Tipo
          </label>
          <input
            value="Venta"
            readOnly
            className="mt-1 w-full rounded-lg border border-app bg-amber-50/70 px-3 py-2 text-sm text-slate-700"
          />
        </div>
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
            Cantidad
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
        {isPending ? "Registrando..." : "Registrar movimiento"}
      </button>
    </form>
  );
};
