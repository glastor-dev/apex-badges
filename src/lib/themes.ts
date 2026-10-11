export type BadgeStyle = 'pro' | 'flat' | 'pill' | 'glass' | 'cyber' | 'gradient';

export interface ColorPreset {
  name: string;
  hex: string;
  label: string;
}

export const COLOR_PRESETS: Record<string, string> = {
  // Brand & Classic
  blue: '#007ec6',
  docker: '#007ec6',
  brightgreen: '#4c1',
  green: '#2ea44f',
  passing: '#2ea44f',
  success: '#3fb950',
  enabled: '#3fb950',
  purple: '#8a2be2',
  visitas: '#8a2be2',
  violet: '#8250df',
  black: '#12151a',
  dark: '#1e2228',
  charcoal: '#24292e',
  gray: '#6e7681',
  orange: '#fe7d37',
  license: '#c4704f',
  red: '#cf222e',
  danger: '#e05d44',
  yellow: '#dfb317',
  warning: '#dfb317',
  cyan: '#0891b2',
  emerald: '#10b981',
  pink: '#ec4899',
  indigo: '#6366f1',
};

export const GRADIENT_PRESETS: Record<string, [string, string]> = {
  cyber: ['#00f2fe', '#4facfe'],
  sunset: ['#ff0844', '#ffb199'],
  emerald: ['#0ba360', '#3cba92'],
  purple: ['#7f00ff', '#e100ff'],
  gold: ['#f6d365', '#fda085'],
  cosmic: ['#8e2de2', '#4a00e0'],
  darkness: ['#232526', '#414345'],
};

/**
 * Resolves color string with strict validation to prevent SVG attribute injection.
 */
export function resolveColor(input?: string | null, defaultColor = '#007ec6'): string {
  if (!input) return defaultColor;

  const clean = input.trim();

  // Block any attempt to break out of SVG attributes
  if (/[<>"';\\()]/.test(clean) && !/^(rgba?|hsla?)\(/.test(clean)) {
    return defaultColor;
  }

  const lower = clean.toLowerCase();

  // If matches preset name
  if (COLOR_PRESETS[lower]) {
    return COLOR_PRESETS[lower];
  }

  // If valid hex without hash: e.g. "007ec6" or "fff"
  if (/^[0-9a-fA-F]{3,8}$/.test(clean)) {
    return `#${clean}`;
  }

  // If valid hex with hash: e.g. "#007ec6"
  if (/^#[0-9a-fA-F]{3,8}$/.test(clean)) {
    return clean;
  }

  // Strict RGB / RGBA validation: rgb(0, 126, 198) or rgba(0, 126, 198, 0.8)
  if (/^rgba?\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}(\s*,\s*(0|1|0?\.\d+))?\s*\)$/i.test(clean)) {
    return clean;
  }

  // Strict HSL / HSLA validation
  if (/^hsla?\(\s*\d{1,3}\s*,\s*\d{1,3}%\s*,\s*\d{1,3}%(\s*,\s*(0|1|0?\.\d+))?\s*\)$/i.test(clean)) {
    return clean;
  }

  // Standard safe CSS color names (alphanumeric only, 3-20 chars)
  if (/^[a-zA-Z]{3,20}$/.test(clean)) {
    return clean;
  }

  return defaultColor;
}
