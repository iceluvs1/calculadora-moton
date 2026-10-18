/** Empty lengths count as zero; malformed or non-finite lengths are invalid. */
export function parseLengthInput(value: string): number | null {
  const trimmed = value.trim();
  if (trimmed === '') return 0;

  // Keep the original text in the input. Both separators mean decimal,
  // never thousands; accept a trailing separator while the user is typing.
  if (!/^(?:\d+(?:[.,]\d*)?|[.,]\d+)$/.test(trimmed)) return null;

  const length = Number(trimmed.replace(',', '.'));
  return Number.isFinite(length) ? length : null;
}
