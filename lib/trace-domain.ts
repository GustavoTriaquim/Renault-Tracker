export type AlertLevel = "Atenção" | "Crítico";

export function isJustificationValid(value: string, minimumLength = 12) {
  return value.trim().length >= minimumLength;
}

export function getAlertLevel(daysRemaining: number): AlertLevel {
  return daysRemaining <= 20 ? "Crítico" : "Atenção";
}

export function sortByUrgency<T extends { daysRemaining: number }>(items: T[]) {
  return [...items].sort((a, b) => a.daysRemaining - b.daysRemaining);
}
