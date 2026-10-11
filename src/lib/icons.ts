import * as simpleIcons from 'simple-icons';

export interface IconData {
  title: string;
  path: string;
  hex: string;
  viewBox?: string;
}

// Built-in utility and developer icons
const BUILTIN_ICONS: Record<string, IconData> = {
  // Visitor / Views Eye
  eye: {
    title: 'Visitas',
    hex: '8a2be2',
    viewBox: '0 0 24 24',
    path: 'M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z',
  },
  visitas: {
    title: 'Visitas',
    hex: '8a2be2',
    viewBox: '0 0 24 24',
    path: 'M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z',
  },
  views: {
    title: 'Views',
    hex: '8a2be2',
    viewBox: '0 0 24 24',
    path: 'M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z',
  },

  // License / Scale
  license: {
    title: 'License',
    hex: '0969da',
    viewBox: '0 0 24 24',
    path: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z',
  },
  scale: {
    title: 'Scale',
    hex: '0969da',
    viewBox: '0 0 24 24',
    path: 'M12 3v2m0 14v2m-9-9h18M5 14l2-6 2 6a3 3 0 01-4 0zm10 0l2-6 2 6a3 3 0 01-4 0z',
  },

  // CodeQL / Security
  codeql: {
    title: 'CodeQL',
    hex: '2ea44f',
    viewBox: '0 0 24 24',
    path: 'M12 2L3 7v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5zm-1 15l-4-4 1.41-1.41L11 14.17l6.59-6.59L19 9l-8 8z',
  },

  // Star & Fork for GitHub
  star: {
    title: 'Star',
    hex: 'e3b341',
    viewBox: '0 0 24 24',
    path: 'M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z',
  },
  fork: {
    title: 'Fork',
    hex: '8b949e',
    viewBox: '0 0 24 24',
    path: 'M7 5a2 2 0 11-4 0 2 2 0 014 0zm10 0a2 2 0 11-4 0 2 2 0 014 0zM5 8v3a3 3 0 003 3h4a3 3 0 003-3V8m-5 9a2 2 0 11-4 0 2 2 0 014 0zm0-3v3',
  },

  // Check / Success
  check: {
    title: 'Check',
    hex: '2ea44f',
    viewBox: '0 0 24 24',
    path: 'M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z',
  },

  // Heart / Sponsor
  heart: {
    title: 'Sponsor',
    hex: 'ea4aaa',
    viewBox: '0 0 24 24',
    path: 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z',
  },

  // Bolt / Fast
  bolt: {
    title: 'Fast',
    hex: 'f59e0b',
    viewBox: '0 0 24 24',
    path: 'M11 21h-1l1-7H7.5c-.88 0-.33-.75-.31-.78C8.48 10.94 10.42 7.54 13 3h1l-1 7h3.5c.49 0 .73.27.5.7l-6 10.3z',
  },
};

// Lazy cache for normalized lookup
let iconMapCache: Map<string, IconData> | null = null;

function getIconMap(): Map<string, IconData> {
  if (iconMapCache) return iconMapCache;

  const map = new Map<string, IconData>();

  // Add built-ins first
  for (const [key, icon] of Object.entries(BUILTIN_ICONS)) {
    map.set(key.toLowerCase(), icon);
  }

  // Populate from simple-icons
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const iconsRecord = simpleIcons as Record<string, any>;
  for (const exportKey in iconsRecord) {
    if (exportKey.startsWith('si') && exportKey.length > 2) {
      const item = iconsRecord[exportKey];
      if (item && item.slug && item.path) {
        const iconData: IconData = {
          title: item.title,
          path: item.path,
          hex: item.hex,
          viewBox: '0 0 24 24',
        };

        const slugKey = item.slug.toLowerCase().replace(/[^a-z0-9]/g, '');
        const titleKey = item.title.toLowerCase().replace(/[^a-z0-9]/g, '');

        if (!map.has(slugKey)) map.set(slugKey, iconData);
        if (!map.has(titleKey)) map.set(titleKey, iconData);
      }
    }
  }

  iconMapCache = map;
  return map;
}

/**
 * Finds an icon by name or slug (e.g. "docker", "deno", "lefthook", "github", "eye", "visitas").
 */
export function getIcon(name?: string | null): IconData | null {
  if (!name) return null;

  const clean = name.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
  if (!clean) return null;

  const map = getIconMap();
  return map.get(clean) || null;
}

/**
 * Returns a list of popular tech icons for autocomplete and presets.
 */
export const POPULAR_ICONS = [
  'deno',
  'docker',
  'lefthook',
  'github',
  'codeql',
  'visitas',
  'license',
  'typescript',
  'javascript',
  'react',
  'nextdotjs',
  'vuedotjs',
  'tailwindcss',
  'python',
  'rust',
  'go',
  'nodedotjs',
  'bun',
  'pnpm',
  'npm',
  'vercel',
  'postgresql',
  'redis',
  'linux',
  'git',
  'vitest',
  'jest',
  'kubernetes',
  'aws',
  'cloudflare',
  'star',
  'heart',
];
