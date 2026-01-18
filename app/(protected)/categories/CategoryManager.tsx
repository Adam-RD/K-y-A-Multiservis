"use client";

import { useRef, useState, useTransition } from "react";
import { Pagination } from "@/components/Pagination";
import { toast } from "sonner";
import {
  createCategoryAction,
  deleteCategoryAction,
  updateCategoryAction,
} from "./actions";

type Category = {
  id: string;
  name: string;
};

type CategoryManagerProps = {
  categories: Category[];
  totalItems: number;
  page: number;
  totalPages: number;
};

export const CategoryManager = ({
  categories,
  totalItems,
  page,
  totalPages,
}: CategoryManagerProps) => {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [editingId, setEditingId] = useState<string | null>(null);
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const handleCreate = (formData: FormData) => {
    setError(null);
    startTransition(async () => {
      const result = await createCategoryAction(formData);
      if (result?.error) {
        setError(result.error);
        toast.error(result.error);
        return;
      }
      toast.success("Categoria creada.");
    });
  };

  const handleUpdate = (id: string, formData: FormData) => {
    setError(null);
    startTransition(async () => {
      const result = await updateCategoryAction(id, formData);
      if (result?.error) {
        setError(result.error);
        toast.error(result.error);
        return;
      }
      toast.success("Categoria actualizada.");
      setEditingId(null);
    });
  };

  const handleDelete = (id: string) => {
    setError(null);
    startTransition(async () => {
      const result = await deleteCategoryAction(id);
      if (result?.error) {
        setError(result.error);
        toast.error(result.error);
        return;
      }
      toast.success("Categoria eliminada.");
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          const formData = new FormData(event.currentTarget);
          handleCreate(formData);
          event.currentTarget.reset();
        }}
        className="flex flex-wrap gap-3 rounded-2xl border border-app bg-white/90 p-5 shadow-soft"
      >
        <input
          name="name"
          placeholder="Nueva categoría"
          className="flex-1 rounded-lg border border-app px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-100"
        />
        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-teal-700"
        >
          Crear
        </button>
      </form>
      {error ? (
        <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-600">
          {error}
        </p>
      ) : null}
      <div className="grid gap-3">
        {categories.map((category) => (
          <form
            key={category.id}
            onSubmit={(event) => {
              event.preventDefault();
              const formData = new FormData(event.currentTarget);
              handleUpdate(category.id, formData);
            }}
            className="flex flex-wrap gap-3 rounded-xl border border-app bg-white/90 p-4 shadow-soft"
          >
            <input
              name="name"
              defaultValue={category.name}
              ref={(element) => {
                inputRefs.current[category.id] = element;
              }}
              disabled={editingId !== category.id}
              className="flex-1 rounded-lg border border-app px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-100"
            />
            <button
              type="submit"
              disabled={isPending || editingId !== category.id}
              className="rounded-lg border border-teal-300 bg-teal-100/80 px-4 py-2 text-sm font-semibold text-teal-900 transition hover:border-teal-400 hover:bg-teal-200"
            >
              Guardar
            </button>
            <button
              type="button"
              disabled={editingId === category.id}
              onClick={() => {
                const input = inputRefs.current[category.id];
                if (input) {
                  setEditingId(category.id);
                  input.focus();
                  input.select();
                }
              }}
              className="rounded-lg border border-sky-300 bg-sky-100/80 px-4 py-2 text-sm font-semibold text-sky-900 transition hover:border-sky-400 hover:bg-sky-200"
            >
              Editar
            </button>
            {editingId === category.id ? (
              <button
                type="button"
                onClick={() => {
                  const input = inputRefs.current[category.id];
                  if (input) {
                    input.value = category.name;
                  }
                  setEditingId(null);
                }}
                className="rounded-lg border border-slate-300 bg-slate-100/80 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-200"
              >
                Cancelar
              </button>
            ) : null}
            <button
              type="button"
              disabled={isPending}
              onClick={() => handleDelete(category.id)}
              className="rounded-lg border border-rose-300 bg-rose-100/80 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:border-rose-400 hover:bg-rose-200"
            >
              Borrar
            </button>
          </form>
        ))}
      </div>
      <Pagination page={page} totalPages={totalPages} totalItems={totalItems} />
    </div>
  );
};
