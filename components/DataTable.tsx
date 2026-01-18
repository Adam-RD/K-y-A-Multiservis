import React from "react";

type DataTableProps = {
  headers: string[];
  children: React.ReactNode;
};

export const DataTable = ({ headers, children }: DataTableProps) => (
  <div className="overflow-x-auto rounded-xl border border-app bg-white/90 shadow-soft">
    <table className="min-w-full text-sm">
      <thead className="bg-amber-50/80 text-left text-xs uppercase tracking-wide text-amber-700">
        <tr>
          {headers.map((header) => (
            <th key={header} className="px-4 py-3">
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-amber-100/70">{children}</tbody>
    </table>
  </div>
);
