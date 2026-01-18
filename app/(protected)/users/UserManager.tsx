"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import {
  createUserAction,
  deleteUserAction,
  updateUserAction,
} from "./actions";
import { Pagination } from "@/components/Pagination";

type UserItem = {
  id: string;
  username: string;
};

type UserManagerProps = {
  users: UserItem[];
  currentUserId: string;
  totalItems: number;
  page: number;
  totalPages: number;
};

export const UserManager = ({
  users,
  currentUserId,
  totalItems,
  page,
  totalPages,
}: UserManagerProps) => {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleCreate = (formData: FormData) => {
    setError(null);
    startTransition(async () => {
      const result = await createUserAction(formData);
      if (result?.error) {
        setError(result.error);
        toast.error(result.error);
        return;
      }
      toast.success("Usuario creado.");
    });
  };

  const handleUpdate = (id: string, formData: FormData) => {
    setError(null);
    startTransition(async () => {
      const result = await updateUserAction(id, formData);
      if (result?.error) {
        setError(result.error);
        toast.error(result.error);
        return;
      }
      toast.success("Usuario actualizado.");
    });
  };

  const handleDelete = (id: string) => {
    setError(null);
    startTransition(async () => {
      const result = await deleteUserAction(id);
      if (result?.error) {
        setError(result.error);
        toast.error(result.error);
        return;
      }
      toast.success("Usuario eliminado.");
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
        className="grid gap-3 rounded-2xl border border-app bg-white/90 p-5 shadow-soft md:grid-cols-4"
      >
        <input
          name="username"
          placeholder="Nuevo usuario"
          className="rounded-lg border border-app px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-100"
        />
        <input
          name="password"
          type="password"
          placeholder="Contraseña"
          className="rounded-lg border border-app px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-100"
        />
        <input
          name="confirmPassword"
          type="password"
          placeholder="Confirmar"
          className="rounded-lg border border-app px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-100"
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
        {users.map((user) => (
          <form
            key={user.id}
            onSubmit={(event) => {
              event.preventDefault();
              const formData = new FormData(event.currentTarget);
              handleUpdate(user.id, formData);
            }}
            className="grid gap-3 rounded-xl border border-app bg-white/90 p-4 shadow-soft md:grid-cols-[1fr_1fr_1fr_auto_auto]"
          >
            <input
              name="username"
              defaultValue={user.username}
              className="rounded-lg border border-app px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-100"
            />
            <input
              name="password"
              type="password"
              placeholder="Nueva contraseña"
              className="rounded-lg border border-app px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-100"
            />
            <input
              name="confirmPassword"
              type="password"
              placeholder="Confirmar"
              className="rounded-lg border border-app px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-100"
            />
            <button
              type="submit"
              disabled={isPending}
              className="rounded-lg border border-app px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-amber-50/80"
            >
              Guardar
            </button>
            <button
              type="button"
              disabled={isPending || user.id === currentUserId}
              onClick={() => handleDelete(user.id)}
              className="rounded-lg border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-600 disabled:opacity-60"
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
