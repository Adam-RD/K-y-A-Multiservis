type MovementType = "IN" | "OUT" | "ADJUST" | "RETURN";
type MovementReason =
  | "PURCHASE"
  | "SALE"
  | "DAMAGE"
  | "LOSS"
  | "COUNT"
  | "RETURN"
  | "OTHER";

const typeLabels: Record<MovementType, string> = {
  IN: "Entrada",
  OUT: "Salida",
  ADJUST: "Ajuste",
  RETURN: "Devolucion",
};

const reasonLabels: Record<MovementReason, string> = {
  PURCHASE: "Compra",
  SALE: "Venta",
  DAMAGE: "Dano",
  LOSS: "Perdida",
  COUNT: "Conteo",
  RETURN: "Devolucion",
  OTHER: "Otro",
};

export const formatMovementType = (value: MovementType): string =>
  typeLabels[value] ?? value;

export const formatMovementReason = (value: MovementReason): string =>
  reasonLabels[value] ?? value;
