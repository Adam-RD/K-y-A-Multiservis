import React from "react";

type KpiCardProps = {
  title: string;
  value: string;
  icon: React.ReactNode;
  helper?: string;
};

export const KpiCard = ({ title, value, icon, helper }: KpiCardProps) => (
  <div className="group rounded-2xl border border-app bg-gradient-to-br from-white via-sky-50/50 to-rose-50/70 p-5 shadow-soft ring-1 ring-sky-100/70 transition hover:-translate-y-0.5 hover:shadow-lg">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-sky-700">
          {title}
        </p>
        <p className="mt-2 text-2xl font-semibold text-slate-900">{value}</p>
      </div>
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-sky-100 to-rose-100 text-indigo-700 shadow-sm ring-1 ring-indigo-200/70 transition group-hover:scale-105">
        {icon}
      </div>
    </div>
    {helper ? <p className="mt-3 text-xs text-slate-600">{helper}</p> : null}
  </div>
);
