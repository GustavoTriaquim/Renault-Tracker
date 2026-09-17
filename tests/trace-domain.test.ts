import { describe, expect, it } from "vitest";

import { getAlertLevel, isJustificationValid, sortByUrgency } from "../lib/trace-domain";

describe("regras do fluxo de rastreabilidade", () => {
  it("exige justificativa mínima para devolver ou cancelar uma peça", () => {
    expect(isJustificationValid("Danificada")).toBe(false);
    expect(isJustificationValid("Peça danificada no recebimento")).toBe(true);
    expect(isJustificationValid("   Peça danificada   ")).toBe(true);
  });

  it("classifica prazos de até 20 dias como críticos", () => {
    expect(getAlertLevel(20)).toBe("Crítico");
    expect(getAlertLevel(6)).toBe("Crítico");
    expect(getAlertLevel(21)).toBe("Atenção");
  });

  it("ordena alertas pelo menor prazo restante", () => {
    const source = [{ id: "A", daysRemaining: 42 }, { id: "B", daysRemaining: 6 }, { id: "C", daysRemaining: 17 }];
    expect(sortByUrgency(source).map((item) => item.id)).toEqual(["B", "C", "A"]);
    expect(source.map((item) => item.id)).toEqual(["A", "B", "C"]);
  });
});
