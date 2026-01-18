"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginInput } from "@/lib/validators";
import { loginAction } from "./actions";
import { RiLockLine, RiUser3Line } from "react-icons/ri";
import Image from "next/image";

const LoginPage = () => {
  const [serverError, setServerError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginInput) => {
    setServerError(null);
    const formData = new FormData();
    formData.append("username", data.username);
    formData.append("password", data.password);
    startTransition(async () => {
      const result = await loginAction(formData);
      if (result?.error) {
        setServerError(result.error);
      }
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-amber-50 via-orange-50 to-emerald-50 px-4">
      <div className="w-full max-w-md rounded-2xl border border-app bg-white/80 p-8 shadow-soft backdrop-blur">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <Image
                src="/K y A Multiservis.png"
                alt="K y A Multiservis"
                width={48}
                height={48}
                className="h-full w-full object-contain"
                priority
              />
            </div>
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
              Inventario
            </span>
          </div>
          <h1 className="text-2xl font-semibold text-slate-900">
            K y A Multiservis
          </h1>
          <p className="text-sm text-slate-500">
            Inicia sesión para administrar el inventario.
          </p>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-6 flex flex-col gap-4"
        >
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Usuario
            </label>
            <div className="relative mt-2">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <RiUser3Line />
              </span>
              <input
                {...register("username")}
                className="w-full rounded-lg border border-app bg-white/90 py-2 pl-10 pr-3 text-sm text-slate-700 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-100"
                placeholder="admin"
              />
            </div>
            {errors.username ? (
              <p className="mt-1 text-xs text-rose-500">
                {errors.username.message}
              </p>
            ) : null}
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Contraseña
            </label>
            <div className="relative mt-2">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <RiLockLine />
              </span>
              <input
                type="password"
                {...register("password")}
                className="w-full rounded-lg border border-app bg-white/90 py-2 pl-10 pr-3 text-sm text-slate-700 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-100"
                placeholder="••••••••"
              />
            </div>
            {errors.password ? (
              <p className="mt-1 text-xs text-rose-500">
                {errors.password.message}
              </p>
            ) : null}
          </div>
          {serverError ? (
            <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-600">
              {serverError}
            </p>
          ) : null}
          <button
            type="submit"
            disabled={isPending}
            className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-teal-700 hover:cursor-pointer disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isPending ? "Ingresando..." : "Ingresar"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
