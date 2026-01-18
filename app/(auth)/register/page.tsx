"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, RegisterInput } from "@/lib/validators";
import { registerAction } from "./actions";
import { RiLockLine, RiUser3Line } from "react-icons/ri";
import Link from "next/link";

const RegisterPage = () => {
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: RegisterInput) => {
    setServerError(null);
    const formData = new FormData();
    formData.append("username", data.username);
    formData.append("password", data.password);
    formData.append("confirmPassword", data.confirmPassword);
    startTransition(async () => {
      const result = await registerAction(formData);
      if (result?.error) {
        setServerError(result.error);
      }
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-emerald-50 px-4">
      <div className="w-full max-w-md rounded-2xl border border-app bg-white/80 p-8 shadow-soft backdrop-blur">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold text-slate-900">
            Crear usuario
          </h1>
          <p className="text-sm text-slate-500">
            Registra un usuario nuevo para el inventario.
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
                placeholder="nuevo_usuario"
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
                type={showPassword ? "text" : "password"}
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
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Confirmar contrasena
            </label>
            <div className="relative mt-2">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <RiLockLine />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                {...register("confirmPassword")}
                className="w-full rounded-lg border border-app bg-white/90 py-2 pl-10 pr-3 text-sm text-slate-700 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-100"
                placeholder="••••••••"
              />
            </div>
            {errors.confirmPassword ? (
              <p className="mt-1 text-xs text-rose-500">
                {errors.confirmPassword.message}
              </p>
            ) : null}
          </div>
          <label className="flex items-center gap-2 text-sm text-slate-600">
            <input
              type="checkbox"
              checked={showPassword}
              onChange={(event) => setShowPassword(event.target.checked)}
            />
            Mostrar contrasena
          </label>
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
            {isPending ? "Creando..." : "Crear usuario"}
          </button>
        </form>
        <p className="mt-4 text-sm text-slate-500">
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" className="font-semibold text-slate-900">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
