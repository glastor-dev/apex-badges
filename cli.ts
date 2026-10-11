#!/usr/bin/env bun
/**
 * Universal CLI tool to generate SVG badges locally.
 * Works seamlessly with Bun, Deno, and Node.js.
 *
 * Usage:
 *   bun cli.ts --label "Docker" --status "ready" --color "007ec6" --logo "docker" --out badge.svg
 *   deno run -A cli.ts --label "Coverage" --status "98%" --color "passing" --out cov.svg
 */

import { generateBadgeSvg } from './src/lib/svg-engine';
import { writeFileSync } from 'node:fs';

function parseArgs(args: string[]) {
  const result: Record<string, string> = {};
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg.startsWith('--')) {
      const key = arg.slice(2);
      const next = args[i + 1];
      if (next && !next.startsWith('--')) {
        result[key] = next;
        i++;
      } else {
        result[key] = 'true';
      }
    }
  }
  return result;
}

const args = parseArgs(process.argv.slice(2));

if (args.help || (!args.label && !args.status)) {
  console.log(`
🛡️ Apex Badges CLI - Multi-runtime Badge Generator

Usage:
  bun cli.ts [options]
  deno run -A cli.ts [options]

Options:
  --label <text>        Left label (e.g. "Docker", "Coverage", "Deno")
  --status <text>       Right status (e.g. "ready", "98%", "^1.40.0")
  --color <hex/name>    Status color (e.g. "007ec6", "green", "purple", "passing")
  --labelColor <hex>    Label background color (default: "#1f2328")
  --logo <name>         Vector icon (e.g. "docker", "deno", "github", "visitas")
  --style <name>        Style: pro | flat | pill | glass | cyber | gradient
  --out <filename>      File path to save the SVG (e.g. "badge.svg")

Examples:
  bun cli.ts --label Docker --status ready --color 007ec6 --logo docker --out docker.svg
  deno run -A cli.ts --label Deno --status "^1.40.0" --color black --logo deno --out deno.svg
`);
  process.exit(0);
}

const svg = generateBadgeSvg({
  label: args.label || '',
  status: args.status || 'passing',
  color: args.color || 'green',
  labelColor: args.labelColor,
  logo: args.logo,
  style: args.style || 'pro',
});

if (args.out) {
  writeFileSync(args.out, svg, 'utf-8');
  console.log(`✅ Badge saved to: ${args.out}`);
} else {
  // Print SVG directly to stdout
  console.log(svg);
}
