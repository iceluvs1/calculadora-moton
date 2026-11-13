export function isIPhone(userAgent: string, platform: string) {
  return platform === 'iPhone' || /\biPhone\b/.test(userAgent);
}
