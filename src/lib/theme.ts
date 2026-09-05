/** Explicit preference wins; otherwise follow the device. */
export function resolveTheme(preference: string | null, systemDark: boolean): 'light' | 'dark' {
  return preference === 'dark' || (preference !== 'light' && systemDark) ? 'dark' : 'light';
}
