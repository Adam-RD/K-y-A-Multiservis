"use client";

import Link from "next/link";

type PaginationProps = {
  page: number;
  totalPages: number;
  totalItems: number;
  query?: Record<string, string | undefined>;
};

const buildHref = (
  page: number,
  query?: Record<string, string | undefined>
): string => {
  const params = new URLSearchParams();
  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      }
    });
  }
  params.set("page", page.toString());
  return `?${params.toString()}`;
};

export const Pagination = ({
  page,
  totalPages,
  totalItems,
  query,
}: PaginationProps) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-slate-600">
      <span>
        Pagina {page} de {totalPages} · {totalItems} registros
      </span>
      <div className="flex gap-2">
        {page > 1 ? (
          <Link
            href={buildHref(page - 1, query)}
            className="rounded-lg border border-teal-300 bg-teal-100/80 px-3 py-1 font-semibold text-teal-900 transition hover:border-teal-400 hover:bg-teal-200"
          >
            Anterior
          </Link>
        ) : (
          <span className="rounded-lg border border-teal-200 bg-teal-50/70 px-3 py-1 font-semibold text-teal-400 opacity-70">
            Anterior
          </span>
        )}
        {page < totalPages ? (
          <Link
            href={buildHref(page + 1, query)}
            className="rounded-lg border border-sky-300 bg-sky-100/80 px-3 py-1 font-semibold text-sky-900 transition hover:border-sky-400 hover:bg-sky-200"
          >
            Siguiente
          </Link>
        ) : (
          <span className="rounded-lg border border-sky-200 bg-sky-50/70 px-3 py-1 font-semibold text-sky-400 opacity-70">
            Siguiente
          </span>
        )}
      </div>
    </div>
  );
};
