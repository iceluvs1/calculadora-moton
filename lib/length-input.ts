/** Convierte un campo decimal a número: vacío → 0; dato inválido → null.
 * Se reutiliza en ambas calculadoras. Cada una decide si admite el valor cero.
 */
export function parseLengthInput(value: string): number | null {
  const trimmed = value.trim();
  if (trimmed === '') return 0;

  // No modifica el texto original del campo. Coma y punto son separadores
  // decimales, nunca de miles. Permite "12," mientras se escribe el siguiente dígito.
  if (!/^(?:\d+(?:[.,]\d*)?|[.,]\d+)$/.test(trimmed)) return null;

  // JavaScript necesita un punto para convertir correctamente el número.
  const length = Number(trimmed.replace(',', '.'));
  return Number.isFinite(length) ? length : null;
}
