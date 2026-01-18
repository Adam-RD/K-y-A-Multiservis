export const formatCurrency = (value: number): string =>
  new Intl.NumberFormat("es-EC", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);

export const formatDate = (value: Date): string =>
  new Intl.DateTimeFormat("es-EC", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(value);
