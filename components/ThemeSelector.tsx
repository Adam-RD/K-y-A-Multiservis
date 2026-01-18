"use client";

import { useEffect, useState } from "react";

const THEME_KEY = "kya-theme";

type ThemeOption = {
  value: string;
  label: string;
};

const themes: ThemeOption[] = [
  { value: "ocean", label: "Azul/Agua" },
  { value: "sand", label: "Arena/Teal" },
  { value: "slate", label: "Gris/Indigo" },
  { value: "forest", label: "Verde/Bosque" },
  { value: "sunset", label: "Coral/Dorado" },
  { value: "graphite", label: "Grafito/Acero" },
];

export const ThemeSelector = () => {
  const [theme, setTheme] = useState<string>("ocean");

  useEffect(() => {
    const stored = localStorage.getItem(THEME_KEY);
    const initial = stored || "ocean";
    setTheme(initial);
    document.documentElement.dataset.theme = initial;
  }, []);

  const onChange = (value: string) => {
    setTheme(value);
    localStorage.setItem(THEME_KEY, value);
    document.documentElement.dataset.theme = value;
  };

  return (
    <label className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white/80 px-2.5 py-1.5 text-xs text-slate-700 shadow-sm sm:px-3 sm:py-2 sm:text-sm">
      <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 sm:text-xs">
        Tema
      </span>
      <select
        value={theme}
        onChange={(event) => onChange(event.target.value)}
        className="bg-transparent text-xs font-semibold text-slate-700 focus:outline-none sm:text-sm"
        aria-label="Tema"
      >
        {themes.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
};
