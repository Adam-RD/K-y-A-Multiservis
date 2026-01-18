"use client";

import { useEffect, useState } from "react";
import { DataTable } from "./DataTable";

type PaginatedTableProps<T> = {
  headers: string[];
  data: T[];
  pageSize?: number;
  renderRow: (item: T) => React.ReactNode;
  emptyMessage?: string;
};

export const PaginatedTable = <T,>({
  headers,
  data,
  pageSize = 7,
  renderRow,
  emptyMessage = "Sin resultados",
}: PaginatedTableProps<T>) => {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(data.length / pageSize));

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const start = (page - 1) * pageSize;
  const pageItems = data.slice(start, start + pageSize);

  return (
    <div className="flex flex-col gap-3">
      <DataTable headers={headers}>
        {pageItems.length === 0 ? (
          <tr>
            <td
              colSpan={headers.length}
              className="px-4 py-6 text-center text-sm text-slate-500"
            >
              {emptyMessage}
            </td>
          </tr>
        ) : (
          pageItems.map(renderRow)
        )}
      </DataTable>
      <div className="flex items-center justify-between text-sm text-slate-600">
        <span>
          Pagina {page} de {totalPages} · {data.length} registros
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            disabled={page === 1}
            className="rounded-lg border border-app px-3 py-1 disabled:opacity-50"
          >
            Anterior
          </button>
          <button
            type="button"
            onClick={() =>
              setPage((current) => Math.min(totalPages, current + 1))
            }
            disabled={page === totalPages}
            className="rounded-lg border border-app px-3 py-1 disabled:opacity-50"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
};
