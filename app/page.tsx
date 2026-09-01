'use client';

import { useMemo, useState } from 'react';
import {
  Cable,
  ChevronRight,
  CircleGauge,
  RotateCcw,
  Ruler,
  ShieldCheck,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const cableWeights = {
  13: 0.85,
  15: 1.12,
  17: 1.45,
  19: 1.81,
  21: 2.24,
  23: 2.67,
  25: 3.09,
  28: 3.94,
  30: 4.46,
  32: 5.09,
  38: 7.21,
  40: 7.99,
  52: 13.5,
} as const;

const factors = [
  1.31, 1.34, 1.36, 1.39, 1.41, 1.44, 1.46, 1.49, 1.52, 1.54,
  1.57, 1.6, 1.63, 1.65, 1.68, 1.71, 1.74, 1.77, 1.8, 1.83, 1.87,
  1.9, 1.93, 1.96, 2, 2.03, 2.06, 2.1, 2.13, 2.17,
] as const;

type CableDiameter = keyof typeof cableWeights;
type LengthInput = number | '';

function readLengthInput(value: string): LengthInput {
  return value === '' ? '' : Number(value);
}

function lengthForCalculation(value: LengthInput) {
  return value === '' || !Number.isFinite(value) ? 0 : Math.max(0, value);
}

const integer = new Intl.NumberFormat('es-CL', { maximumFractionDigits: 0 });
const decimal = new Intl.NumberFormat('es-CL', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export default function Home() {
  const [mainBoom, setMainBoom] = useState<LengthInput>(70);
  const [additionalBoom, setAdditionalBoom] = useState<LengthInput>(28);
  const [diameter, setDiameter] = useState<CableDiameter>(28);
  const [reeving, setReeving] = useState(12);

  const result = useMemo(() => {
    const totalLength =
      lengthForCalculation(mainBoom) + lengthForCalculation(additionalBoom);
    const cableWeight = cableWeights[diameter];
    const factor = factors[reeving - 1];
    const rawWeight = totalLength * cableWeight * reeving * factor;
    const minimum = Math.round(rawWeight);
    const recommended = Math.round(minimum * 1.1);

    return {
      totalLength,
      cableWeight,
      factor,
      minimum,
      margin: recommended - minimum,
      recommended,
    };
  }, [additionalBoom, diameter, mainBoom, reeving]);

  function resetExample() {
    setMainBoom(70);
    setAdditionalBoom(28);
    setDiameter(28);
    setReeving(12);
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <header className="border-b border-white/10 bg-primary text-primary-foreground">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
          <div className="flex items-center gap-3">
            <img
              aria-hidden="true"
              alt=""
              className="size-10 rounded-xl shadow-sm"
              src="./icon.svg"
            />
            <div>
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-primary-foreground/60">
                Herramienta de campo
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-heading text-base font-bold tracking-tight sm:text-lg">
                  Calculadora de motón
                </p>
                <span className="rounded bg-primary-foreground px-2 py-0.5 text-[0.65rem] font-black tracking-[0.12em] text-primary shadow-sm">
                  LIEBHERR
                </span>
              </div>
            </div>
          </div>
          <span className="hidden items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-primary-foreground/75 sm:flex">
            <CircleGauge aria-hidden="true" className="size-3.5 text-accent" />
            G = L × M × N × F
          </span>
        </div>
      </header>

      <section className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-5 sm:px-8 sm:py-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.95fr)] lg:items-start">
        <div>
          <div className="mb-5 px-1">
            <p className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-accent-foreground">
              <span className="h-px w-8 bg-accent" /> Cálculo operativo
            </p>
            <h1 className="max-w-xl font-heading text-3xl font-black leading-[1.05] tracking-[-0.035em] sm:text-4xl">
              Peso mínimo requerido del motón de gancho
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              Ingresa la configuración de la grúa. El peso del cable y el factor se
              completan automáticamente según las tablas del fabricante.
            </p>
          </div>

          <Card className="border-0 bg-card py-0 shadow-[0_18px_50px_rgb(17_36_53/8%)] ring-1 ring-border">
            <CardContent className="p-4 sm:p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="main-boom">Pluma principal</FieldLabel>
                  <div className="relative">
                    <Ruler aria-hidden="true" className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="main-boom"
                      className="h-12 rounded-xl bg-background pl-10 pr-11 text-base font-semibold"
                      min="0"
                      inputMode="decimal"
                      step="0.1"
                      type="number"
                      value={mainBoom}
                      onChange={(event) =>
                        setMainBoom(readLengthInput(event.target.value))
                      }
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted-foreground">m</span>
                  </div>
                </Field>

                <Field>
                  <FieldLabel htmlFor="additional-boom">Pluma adicional</FieldLabel>
                  <div className="relative">
                    <Ruler aria-hidden="true" className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="additional-boom"
                      className="h-12 rounded-xl bg-background pl-10 pr-11 text-base font-semibold"
                      min="0"
                      inputMode="decimal"
                      step="0.1"
                      type="number"
                      value={additionalBoom}
                      onChange={(event) =>
                        setAdditionalBoom(readLengthInput(event.target.value))
                      }
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted-foreground">m</span>
                  </div>
                </Field>

                <Field>
                  <FieldLabel>Diámetro del cable</FieldLabel>
                  <Select
                    value={String(diameter)}
                    onValueChange={(value) =>
                      setDiameter(Number(value) as CableDiameter)
                    }
                  >
                    <SelectTrigger className="h-12 w-full rounded-xl bg-background px-3 text-base font-semibold">
                      <Cable aria-hidden="true" className="mr-1 size-4 text-muted-foreground" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(cableWeights).map(([size, weight]) => (
                        <SelectItem key={size} value={size}>
                          {size} mm · {decimal.format(weight)} kg/m
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>

                <Field>
                  <FieldLabel>Número de ramales</FieldLabel>
                  <Select
                    value={String(reeving)}
                    onValueChange={(value) => setReeving(Number(value))}
                  >
                    <SelectTrigger className="h-12 w-full rounded-xl bg-background px-3 text-base font-semibold">
                      <CircleGauge aria-hidden="true" className="mr-1 size-4 text-muted-foreground" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {factors.map((factor, index) => (
                        <SelectItem key={index + 1} value={String(index + 1)}>
                          {index + 1} {index === 0 ? 'ramal' : 'ramales'} · F {decimal.format(factor)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              </div>

              <div className="mt-5 grid gap-2 rounded-xl border border-border bg-muted/55 p-4 text-sm sm:grid-cols-3">
                <Metric label="Largo total L" value={`${decimal.format(result.totalLength)} m`} />
                <Metric label="Peso de cable M" value={`${decimal.format(result.cableWeight)} kg/m`} />
                <Metric label="Factor F" value={decimal.format(result.factor)} />
              </div>

              <Button
                className="mt-4 h-11 w-full rounded-xl sm:w-auto sm:px-4"
                type="button"
                variant="outline"
                onClick={resetExample}
              >
                <RotateCcw aria-hidden="true" />
                Restaurar ejemplo
              </Button>
            </CardContent>
          </Card>
        </div>

        <aside className="lg:sticky lg:top-6">
          <Card className="relative overflow-hidden border-0 bg-primary py-0 text-primary-foreground shadow-[0_22px_60px_rgb(17_36_53/22%)] ring-0">
            <div aria-hidden="true" className="absolute -right-20 -top-20 size-64 rounded-full border-[44px] border-white/[0.035]" />
            <CardContent className="relative p-5 sm:p-7">
              <div className="mb-7 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.15em] text-primary-foreground/55">Resultado</p>
                  <p className="mt-1 text-sm text-primary-foreground/75">Peso mínimo calculado</p>
                </div>
                <span className="grid size-11 place-items-center rounded-xl bg-white/10">
                  <ShieldCheck aria-hidden="true" className="size-5 text-accent" />
                </span>
              </div>

              <output aria-live="polite" aria-atomic="true">
                <div className="flex items-end gap-2 border-b border-white/12 pb-6">
                  <strong className="font-heading text-[clamp(3rem,13vw,5rem)] font-black leading-none tracking-[-0.06em]">
                    {integer.format(result.minimum)}
                  </strong>
                  <span className="mb-1.5 text-lg font-bold text-primary-foreground/55">kg</span>
                </div>

                <div className="my-5 flex items-center gap-3 text-sm text-primary-foreground/75">
                  <span className="rounded-lg bg-white/8 px-3 py-2 font-mono text-xs">
                    {decimal.format(result.totalLength)} × {decimal.format(result.cableWeight)} × {reeving} × {decimal.format(result.factor)}
                  </span>
                  <ChevronRight aria-hidden="true" className="size-4 shrink-0 text-accent" />
                </div>

                <div className="rounded-2xl bg-accent p-4 text-accent-foreground">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.12em] opacity-70">Recomendado +10%</p>
                      <p className="mt-1 font-heading text-3xl font-black tracking-[-0.03em]">
                        {integer.format(result.recommended)} kg
                      </p>
                    </div>
                    <span className="rounded-full bg-accent-foreground/10 px-2.5 py-1 text-xs font-bold">
                      +{integer.format(result.margin)} kg
                    </span>
                  </div>
                </div>
              </output>
            </CardContent>
          </Card>

          <div className="mt-4 flex gap-3 rounded-2xl border border-border bg-card p-4 text-xs leading-relaxed text-muted-foreground shadow-sm">
            <ShieldCheck aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-accent-foreground" />
            <p>
              Verifica que el aumento de peso no exceda la capacidad máxima de carga
              para la configuración de pluma utilizada.
            </p>
          </div>
        </aside>
      </section>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-border py-1 last:border-0 sm:block sm:border-b-0 sm:border-r sm:py-0 sm:pr-3 sm:last:border-r-0">
      <span className="text-xs text-muted-foreground">{label}</span>
      <strong className="block font-mono text-sm text-foreground sm:mt-1">{value}</strong>
    </div>
  );
}
