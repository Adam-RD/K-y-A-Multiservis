"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { RiSearchLine } from "react-icons/ri";

type SearchInputProps = {
  name?: string;
  placeholder?: string;
  defaultValue?: string;
  liveSearch?: boolean;
  debounceMs?: number;
};

export const SearchInput = ({
  name = "q",
  placeholder = "Buscar...",
  defaultValue,
  liveSearch = false,
  debounceMs = 350,
}: SearchInputProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(defaultValue ?? "");

  useEffect(() => {
    setValue(defaultValue ?? "");
  }, [defaultValue]);

  useEffect(() => {
    if (!liveSearch) {
      return;
    }
    const params = new URLSearchParams(searchParams.toString());
    const current = params.get(name) ?? "";
    if (current === value) {
      return;
    }
    const handler = window.setTimeout(() => {
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      params.set("page", "1");
      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname);
    }, debounceMs);
    return () => window.clearTimeout(handler);
  }, [value, liveSearch, debounceMs, name, pathname, router, searchParams]);

  return (
    <label className="relative block">
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
        <RiSearchLine />
      </span>
      <input
        name={name}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-app bg-white/90 py-2 pl-10 pr-3 text-sm text-slate-700 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-100"
      />
    </label>
  );
};
