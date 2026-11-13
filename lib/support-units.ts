// Una tonelada-fuerza métrica equivale a 1000 kgf (9,80665 kN).
// Factores de conversión a las unidades que usan las fórmulas: kN, mm y kN/m².
const kilonewtonsPerTonneForce = 9.80665;

export const forceUnits = { kN: 1, tf: kilonewtonsPerTonneForce };
export const dimensionUnits = { mm: 1, cm: 10, m: 1000 };
export const pressureUnits = {
  'kN/m²': 1,
  'tf/m²': kilonewtonsPerTonneForce,
  'kgf/cm²': 98.0665,
};

export type SupportMeasurement<Unit extends string> = {
  unit: Unit;
  text: string;
  baseValue: number | null;
};

export function usesNativeUnitPicker(userAgent: string, platform: string) {
  return platform === 'iPhone' || /\biPhone\b/.test(userAgent);
}

const inputFormat = new Intl.NumberFormat('es-CL', {
  useGrouping: false,
  maximumSignificantDigits: 15,
});

export function changeSupportUnit<Unit extends string>(
  measurement: SupportMeasurement<Unit>,
  unit: Unit,
  factors: Record<Unit, number>,
): SupportMeasurement<Unit> {
  if (unit === measurement.unit) return measurement;
  if (measurement.baseValue === null || measurement.text.trim() === '') {
    return { ...measurement, unit };
  }

  const converted = measurement.baseValue / factors[unit];
  // Conserva el dato base al cambiar de unidad para evitar acumular redondeos.
  if (converted === 0 && measurement.baseValue > 0) return measurement;
  return { ...measurement, unit, text: inputFormat.format(converted) };
}
