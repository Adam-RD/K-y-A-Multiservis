type SelectOption = {
  value: string;
  label: string;
};

type SelectFilterProps = {
  name: string;
  label: string;
  options: SelectOption[];
  defaultValue?: string;
};

export const SelectFilter = ({
  name,
  label,
  options,
  defaultValue,
}: SelectFilterProps) => (
  <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
    {label}
    <select
      name={name}
      defaultValue={defaultValue ?? ""}
      className="mt-1 block w-full rounded-lg border border-app bg-white/90 px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-100"
    >
      <option value="">Todos</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </label>
);
