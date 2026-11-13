'use client';

import { useState } from 'react';
import { ArrowDownToLine, RotateCcw } from 'lucide-react';
import { CalculatorSelect } from '@/components/calculators/calculator-select';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { parseLengthInput } from '@/lib/length-input';
import {
  changeSupportUnit,
  dimensionUnits,
  forceUnits,
  pressureUnits,
  type SupportMeasurement,
} from '@/lib/support-units';
import {
  calculatePlate,
  calculateRequiredArea,
  calculateSquarePad,
  comparePressure,
  plateModels,
  soilReferences,
  roundUpToHundredth,
  type PlateShape,
} from '@/lib/support-calculations';

// Estos formatos solo cambian cómo se muestran los números, no el cálculo.
const number = new Intl.NumberFormat('es-CL', { maximumFractionDigits: 6 });
const pressureNumber = new Intl.NumberFormat('es-CL', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
// Redondeamos solo para mostrar las áreas y el lado, después de calcularlos.
function formatRoundedUp(value: number) {
  return pressureNumber.format(roundUpToHundredth(value));
}

export function SupportCalculator() {
  // Cada campo guarda el texto editable y el valor convertido para las fórmulas.
  const [force, setForce] = useState<
    SupportMeasurement<keyof typeof forceUnits>
  >({
    text: '',
    unit: 'kN',
    baseValue: 0,
  });
  const [shape, setShape] = useState<PlateShape | null>(null);
  const [dimension, setDimension] = useState<
    SupportMeasurement<keyof typeof dimensionUnits>
  >({ text: '', unit: 'mm', baseValue: 0 });
  const [soilPressure, setSoilPressure] = useState<
    SupportMeasurement<keyof typeof pressureUnits>
  >({ text: '', unit: 'kN/m²', baseValue: 0 });
  const forceValue = force.baseValue;
  const dimensionValue = dimension.baseValue;
  const soilValue = soilPressure.baseValue;
  // Los dos cálculos son independientes: F y q bastan para obtener la superficie.
  const plate = calculatePlate(forceValue, dimensionValue, shape);
  const requiredArea = calculateRequiredArea(forceValue, soilValue);
  const squarePad = calculateSquarePad(requiredArea);
  const squarePadFactor = plateModels.square.bearingFactor;
  const comparison = comparePressure(plate?.pressure ?? null, soilValue);
  const soilIsZero = soilPressure.text.trim() !== '' && soilValue === 0;

  // Limpia únicamente esta herramienta; no cambia los datos del motón.
  function clear() {
    setForce({ ...force, text: '', baseValue: 0 });
    setShape(null);
    setDimension({ ...dimension, text: '', baseValue: 0 });
    setSoilPressure({ ...soilPressure, text: '', baseValue: 0 });
  }

  return (
    <section className="calculator-section" aria-labelledby="supports-title">
      <div>
        <div className="section-intro">
          <p className="section-eyebrow">
            <span /> Apoyos y suelo
          </p>
          <h1 id="supports-title" className="section-title">
            Presión y superficie de apoyo
          </h1>
          <p className="section-description">
            Calcula la presión de una placa sobre el suelo y la superficie
            necesaria para distribuir la fuerza de ese apoyo.
          </p>
        </div>

        <Card className="border-0 bg-card py-0 ring-1 ring-border">
          <CardContent className="space-y-6 p-4 sm:p-6">
            <div>
              <StepTitle number="01" title="Fuerza del apoyo" />
              <DecimalField
                id="support-force"
                label="Fuerza de apoyo F"
                units={forceUnits}
                unitLabel="Unidad de fuerza"
                value={force}
                onChange={setForce}
              />
            </div>

            <div className="border-t border-border pt-5">
              <StepTitle number="02" title="Presión bajo la placa" />
              <fieldset>
                <legend className="mb-2 text-sm font-medium">
                  Tipo de placa
                </legend>
                <div className="grid grid-cols-2 gap-3">
                  {(Object.keys(plateModels) as PlateShape[]).map((type) => (
                    <label
                      key={type}
                      className={`plate-choice ${shape === type ? 'plate-choice-selected' : ''}`}
                    >
                      <input
                        className="sr-only"
                        type="radio"
                        name="plate-shape"
                        value={type}
                        checked={shape === type}
                        onChange={() => setShape(type)}
                      />
                      <PlateDiagram shape={type} />
                      <span className="font-semibold">
                        {plateModels[type].label}
                      </span>
                      <span className="mt-1 block text-xs text-muted-foreground">
                        {type === 'square' ? '80 % portante' : '95 % portante'}
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>
              <div className="mt-4">
                <DecimalField
                  id="plate-dimension"
                  label="Dimensión exterior l"
                  units={dimensionUnits}
                  unitLabel="Unidad de dimensión"
                  value={dimension}
                  onChange={setDimension}
                />
              </div>
            </div>

            <div className="border-t border-border pt-5">
              <StepTitle number="03" title="Superficie necesaria" />
              <DecimalField
                id="soil-pressure"
                label="Presión admisible del suelo q"
                units={pressureUnits}
                unitLabel="Unidad de presión"
                value={soilPressure}
                onChange={setSoilPressure}
              />
              {soilIsZero && (
                <p
                  role="alert"
                  className="mt-3 rounded-xl border border-red-400/30 bg-red-950/40 p-3 text-sm text-red-200"
                >
                  Con q = 0 no existe una superficie finita que soporte una
                  fuerza positiva. Se requiere evaluación del terreno; no se
                  puede calcular dividiendo entre cero.
                </p>
              )}
            </div>

            <Button
              type="button"
              variant="outline"
              className="h-11 w-full rounded-xl sm:w-auto"
              onClick={clear}
            >
              <RotateCcw aria-hidden="true" /> Limpiar apoyos
            </Button>
          </CardContent>
        </Card>

        <details className="reference-details mt-5 rounded-2xl border border-border bg-card">
          <summary className="cursor-pointer p-4 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-accent">
            Tabla orientativa de suelos{' '}
            <span className="text-muted-foreground">· kN/m²</span>
          </summary>
          <div className="px-4 pb-4">
            <p className="mb-4 text-xs leading-relaxed text-muted-foreground">
              Son ejemplos del manual, no una certificación del terreno. No se
              cargan automáticamente. Si hay dudas, se requiere análisis por un
              especialista. El rango 0–100 no significa que pueda usarse siempre
              100.
            </p>
            <table className="soil-table w-full text-left text-xs">
              <caption className="sr-only">
                Presión admisible orientativa según tipo de suelo, en kN/m²
              </caption>
              <thead>
                <tr>
                  <th scope="col">Tipo de suelo</th>
                  <th scope="col">kN/m²</th>
                </tr>
              </thead>
              <tbody>
                {soilReferences.map((row) => (
                  <tr key={row.soil}>
                    <td>{row.soil}</td>
                    <td>{row.pressure}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
      </div>

      {/* Los estilos result-* también se usan en la sección de motón. */}
      <aside
        className="space-y-4 lg:sticky lg:top-6"
        aria-label="Resultados de apoyos y suelo"
      >
        <Card className="overflow-hidden border-0 bg-primary py-0 ring-1 ring-white/10">
          <CardContent className="p-5 sm:p-7">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <p className="result-label">Resultado por apoyo</p>
                <h2 className="result-caption">Presión sobre el suelo</h2>
              </div>
              <ArrowDownToLine
                aria-hidden="true"
                className="size-6 shrink-0 text-accent"
              />
            </div>
            <output
              className="@container flex items-baseline gap-2"
              aria-live="polite"
              aria-atomic="true"
              aria-label="Presión calculada"
            >
              <strong className="result-primary-value pressure-result-value min-w-0">
                {plate
                  ? pressureNumber.format(
                      plate.pressure / pressureUnits[soilPressure.unit],
                    )
                  : '—'}
              </strong>
              <span className="shrink-0 whitespace-nowrap text-sm font-semibold text-muted-foreground sm:text-base">
                {soilPressure.unit}
              </span>
            </output>
            {plate ? (
              <dl className="mt-6 space-y-3 border-t border-white/10 pt-4 text-sm">
                <ResultRow
                  label="Dimensión l en metros"
                  value={`${number.format(plate.dimensionM)} m`}
                />
                <ResultRow
                  label="Superficie geométrica A"
                  value={`${number.format(plate.area)} m²`}
                />
                <ResultRow
                  label={`Superficie portante (${Math.round(plate.bearingFactor * 100)} %)`}
                  value={`${number.format(plate.bearingArea)} m²`}
                />
              </dl>
            ) : (
              <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
                Ingresa una fuerza y una dimensión mayores que 0, y selecciona
                la placa.
              </p>
            )}
            {plate && (
              <div className="mt-4 rounded-xl bg-white/5 p-3 font-mono text-xs leading-relaxed text-muted-foreground">
                A = {shape === 'octagonal' ? '0,83 × ' : ''}
                {number.format(plate.dimensionM)} ×{' '}
                {number.format(plate.dimensionM)}
                <br />
                A portante = A × {number.format(plate.bearingFactor)}
                <br />
                p = {number.format(forceValue!)} kN /{' '}
                {number.format(plate.bearingArea)} m²
              </div>
            )}
          </CardContent>
        </Card>

        <div className="rounded-2xl bg-accent p-5 text-accent-foreground sm:p-6">
          <p className="result-highlight-label">
            Superficie necesaria por apoyo
          </p>
          <output
            className="mt-3 block"
            aria-live="polite"
            aria-atomic="true"
            aria-label="Superficie necesaria"
          >
            <strong className="result-secondary-value">
              {requiredArea === null ? '—' : formatRoundedUp(requiredArea)} m²
            </strong>
            <span className="mt-3 block text-sm font-semibold">
              {requiredArea === null
                ? 'A necesaria = F / q'
                : `${number.format(forceValue!)} kN / ${number.format(soilValue!)} kN/m²`}
            </span>
          </output>
          <p className="mt-3 text-xs leading-relaxed">
            {requiredArea === null
              ? 'Completa la fuerza y una presión admisible mayor que 0.'
              : 'Superficie portante · redondeada hacia arriba.'}
          </p>
          {squarePad && (
            <output
              className="mt-4 block border-t border-accent-foreground/20 pt-3"
              aria-label="Dimensión teórica de la almohadilla cuadrada"
              aria-live="polite"
            >
              <span className="block text-xs font-semibold">
                Almohadilla cuadrada · {number.format(squarePadFactor * 100)} %
                portante
              </span>
              <span className="mt-1 block break-words text-xs">
                Superficie portante ÷ {pressureNumber.format(squarePadFactor)} ≈{' '}
                {formatRoundedUp(squarePad.totalArea)} m² de área total
              </span>
              <strong className="mt-1 block break-words text-sm">
                Lado teórico ≈ {formatRoundedUp(squarePad.sideM)} m
              </strong>
            </output>
          )}
        </div>

        {comparison && (
          <div
            role="status"
            className={`rounded-2xl border p-4 text-sm leading-relaxed ${comparison === 'exceeds' ? 'border-red-400/40 bg-red-950/90 text-red-100' : 'border-emerald-400/40 bg-emerald-950/90 text-emerald-100'}`}
          >
            <p className="font-bold">
              {comparison === 'exceeds'
                ? 'La presión calculada supera el valor admisible ingresado.'
                : 'La presión calculada no supera el valor admisible ingresado.'}
            </p>
            <p className="mt-2 text-xs">
              Comparación numérica solamente. No certifica la seguridad del
              apoyo ni autoriza la operación.
            </p>
          </div>
        )}
      </aside>
    </section>
  );
}

// El selector cambia la representación del dato. Escribir cambia su valor.
function DecimalField<Unit extends string>({
  id,
  label,
  units,
  unitLabel,
  value,
  onChange,
}: {
  id: string;
  label: string;
  units: Record<Unit, number>;
  unitLabel: string;
  value: SupportMeasurement<Unit>;
  onChange: (value: SupportMeasurement<Unit>) => void;
}) {
  const invalid =
    value.text.trim() !== '' &&
    (value.baseValue === null || value.baseValue <= 0);

  function edit(text: string) {
    const parsed = parseLengthInput(text);
    const converted = parsed === null ? null : parsed * units[value.unit];
    const baseValue = Number.isFinite(converted) ? converted : null;
    onChange({ ...value, text, baseValue });
  }

  function changeUnit(unit: Unit | null) {
    if (unit !== null) onChange(changeSupportUnit(value, unit, units));
  }

  return (
    <Field>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <div className="flex gap-2">
        <Input
          id={id}
          className="h-12 rounded-xl bg-background px-3 text-base font-semibold"
          type="text"
          inputMode="decimal"
          autoComplete="off"
          placeholder="0"
          value={value.text}
          onChange={(event) => edit(event.target.value)}
          aria-invalid={invalid}
          aria-describedby={invalid ? `${id}-error` : undefined}
        />
        <CalculatorSelect
          ariaLabel={unitLabel}
          className="w-28 shrink-0 data-[size=default]:h-12"
          value={value.unit}
          onValueChange={changeUnit}
          options={(Object.keys(units) as Unit[]).map((unit) => ({
            value: unit,
            label: unit,
          }))}
        />
      </div>
      {invalid && (
        <p id={`${id}-error`} role="alert" className="text-xs text-red-300">
          Ingresa un número válido mayor que 0.
        </p>
      )}
    </Field>
  );
}

// Encabezado numerado de cada grupo de datos.
function StepTitle({ number, title }: { number: string; title: string }) {
  return (
    <h2 className="mb-4 flex items-center gap-3 text-base font-bold">
      <span className="text-xs font-bold tracking-widest text-accent">
        {number}
      </span>
      {title}
    </h2>
  );
}

// Fila del desglose: nombre a la izquierda y valor calculado a la derecha.
function ResultRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-wrap justify-between gap-2">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-semibold">{value}</dd>
    </div>
  );
}

// Dibujo SVG de la placa. La cota l indica el ancho exterior que se debe ingresar.
function PlateDiagram({ shape }: { shape: PlateShape }) {
  return (
    <svg
      viewBox="0 0 100 85"
      aria-hidden="true"
      className="mx-auto mb-2 h-16 w-20 text-accent"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      {shape === 'square' ? (
        <rect x="23" y="8" width="54" height="54" rx="2" />
      ) : (
        <polygon points="39,8 61,8 77,24 77,46 61,62 39,62 23,46 23,24" />
      )}
      <circle cx="50" cy="35" r="11" opacity="0.5" />
      <path d="M23 67v12m54-12v12M23 73h54m-49-3-5 3 5 3m44-6 5 3-5 3" />
      <rect x="44" y="67" width="12" height="12" fill="#171717" stroke="none" />
      <text
        x="50"
        y="78"
        textAnchor="middle"
        fill="currentColor"
        stroke="none"
        fontSize="14"
        fontStyle="italic"
      >
        l
      </text>
    </svg>
  );
}
