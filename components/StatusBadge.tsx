type StatusBadgeProps = {
  status: "OK" | "Bajo";
};

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const styles =
    status === "OK"
      ? "bg-emerald-100 text-emerald-700"
      : "bg-amber-100 text-amber-700";
  return (
    <span className={`rounded-full px-2 py-1 text-xs font-semibold ${styles}`}>
      {status}
    </span>
  );
};
