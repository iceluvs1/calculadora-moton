/** Fórmulas del manual aportado: LTM 1400-6.1, sección 2.04, pp. 55–57.
 * Estos coeficientes corresponden a las placas del ejemplo, no a todas las placas.
 * Se calcula sin redondeos intermedios; el ejemplo impreso sí redondea las áreas.
 */
// areaFactor convierte l² en superficie geométrica; bearingFactor determina
// qué fracción de esa superficie se considera portante (80 % o 95 %).
export const plateModels = {
  square: { label: 'Cuadrada', areaFactor: 1, bearingFactor: 0.8 },
  octagonal: { label: 'Octagonal', areaFactor: 0.83, bearingFactor: 0.95 },
} as const;

export type PlateShape = keyof typeof plateModels;

// Rechaza datos ausentes, cero, negativos e infinitos antes de multiplicar/dividir.
const positiveFinite = (value: number | null): value is number =>
  value !== null && Number.isFinite(value) && value > 0;

/** Obtiene las áreas y la presión por apoyo. null significa que no se puede calcular. */
export function calculatePlate(
  forceKn: number | null,
  dimensionMm: number | null,
  shape: PlateShape | null,
) {
  if (
    !positiveFinite(forceKn) ||
    !positiveFinite(dimensionMm) ||
    !shape ||
    !(shape in plateModels)
  )
    return null;
  const model = plateModels[shape];
  // El formulario usa mm; el área debe quedar en m² para obtener presión en kN/m².
  const dimensionM = dimensionMm / 1000;
  const area = model.areaFactor * dimensionM * dimensionM;
  const bearingArea = area * model.bearingFactor;
  // Presión = fuerza de ese apoyo / superficie portante de su placa.
  const pressure = forceKn / bearingArea;
  if (![area, bearingArea, pressure].every(positiveFinite)) return null;
  return { dimensionM, area, bearingArea, pressure, ...model };
}

/** Superficie necesaria = fuerza / presión admisible. No depende de la placa elegida. */
export function calculateRequiredArea(
  forceKn: number | null,
  allowablePressure: number | null,
) {
  if (!positiveFinite(forceKn) || !positiveFinite(allowablePressure))
    return null;
  const area = forceKn / allowablePressure;
  return positiveFinite(area) ? area : null;
}

/** Estima el lado de una almohadilla cuadrada con el factor del ejemplo (0,80). */
export function calculateSquarePad(requiredBearingArea: number | null) {
  if (!positiveFinite(requiredBearingArea)) return null;
  // La superficie portante es el 80 % de la superficie geométrica.
  const totalArea = requiredBearingArea / plateModels.square.bearingFactor;
  if (!positiveFinite(totalArea)) return null;
  return { totalArea, sideM: Math.sqrt(totalArea) };
}

/** Redondea hacia arriba a centésimas, solo para la presentación.
 * El desplazamiento decimal evita que 0.28 pase a 0.29 por el error binario
 * de una multiplicación como 0.28 × 100 = 28.000000000000004.
 */
export function roundUpToHundredth(value: number) {
  const [coefficient, exponent = '0'] = value.toString().split('e');
  const hundredths = Number(`${coefficient}e${Number(exponent) + 2}`);
  return Number.isFinite(hundredths) ? Math.ceil(hundredths) / 100 : value;
}

/** Compara los valores sin redondear. 'within' es una comparación, no una aprobación técnica. */
export function comparePressure(
  pressure: number | null,
  allowablePressure: number | null,
) {
  if (!positiveFinite(pressure) || !positiveFinite(allowablePressure))
    return null;
  return pressure > allowablePressure ? 'exceeds' : 'within';
}

/** Tabla de consulta: no rellena automáticamente la capacidad real de un terreno. */
export const soilReferences = [
  { soil: 'Materias orgánicas: turba, charco, lodo', pressure: '0' },
  { soil: 'Terraplén no compacto: escombros', pressure: '0 hasta 100' },
  { soil: 'No adherentes: arena, grava, piedras y mixto', pressure: '200' },
  {
    soil: 'Adherentes: suelo pantano-arcilloso, mezclado con el suelo madre',
    pressure: '120',
  },
  {
    soil: 'Adherentes: pantano compuesto de charcos de aluviones y arcilla',
    pressure: '130',
  },
  {
    soil: 'Enriquecido en arcilla, compuesto de arcilla y relleno de tierra · Endurecido',
    pressure: '90',
  },
  {
    soil: 'Enriquecido en arcilla, compuesto de arcilla y relleno de tierra · Medio resistente',
    pressure: '140',
  },
  {
    soil: 'Enriquecido en arcilla, compuesto de arcilla y relleno de tierra · Resistente',
    pressure: '200',
  },
  {
    soil: 'Mixto desde arcilla hasta arena, grava y piedras · Endurecido',
    pressure: '150',
  },
  {
    soil: 'Mixto desde arcilla hasta arena, grava y piedras · Medio resistente',
    pressure: '220',
  },
  {
    soil: 'Mixto desde arcilla hasta arena, grava y piedras · Resistente',
    pressure: '330',
  },
  {
    soil: 'Rocoso permanente sin evolución · Rompible, con trazas de desintegración',
    pressure: '1.500',
  },
  { soil: 'Rocoso permanente sin evolución · Irrompible', pressure: '4.000' },
] as const;
