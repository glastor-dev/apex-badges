/**
 * High-performance standalone HTTP microservice.
 * Runs natively in Bun, Deno, or Node with sub-millisecond response times.
 *
 * To run:
 *   bun server.ts
 *   deno run --allow-net server.ts
 */

import { generateBadgeSvg } from './src/lib/svg-engine';
import { getRepoInfo, getLatestRelease, formatNumber, formatBytes } from './src/lib/github';

const PORT = Number(process.env.PORT) || 3001;

// In-memory counter for standalone server
const standaloneViews = new Map<string, number>();

export async function handleRequest(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const { pathname, searchParams } = url;

  // Health check
  if (pathname === '/health') {
    const globalObj = globalThis as Record<string, unknown>;
    const runtime = typeof globalObj.Bun !== 'undefined'
      ? 'bun'
      : typeof globalObj.Deno !== 'undefined'
      ? 'deno'
      : 'node';

    return new Response(JSON.stringify({ status: 'ok', runtime, port: PORT }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Primary Badge: /api/badge
  if (pathname === '/api/badge') {
    const label = searchParams.get('label') ?? '';
    const status = searchParams.get('status') ?? 'passing';
    const color = searchParams.get('color') ?? 'green';
    const labelColor = searchParams.get('labelColor') ?? undefined;
    const logo = searchParams.get('logo') ?? undefined;
    const style = searchParams.get('style') ?? 'pro';
    const height = searchParams.get('height') ? Number(searchParams.get('height')) : 20;

    const svg = generateBadgeSvg({
      label,
      status,
      color,
      labelColor,
      logo,
      style,
      height,
    });

    return new Response(svg, {
      status: 200,
      headers: {
        'Content-Type': 'image/svg+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=86400',
        'Access-Control-Allow-Origin': '*',
        'X-Powered-By': 'ApexBadges-Microservice',
      },
    });
  }

  // Views Counter: /api/badge/views
  if (pathname === '/api/badge/views') {
    const id = searchParams.get('id') || 'default-repo';
    const label = searchParams.get('label') ?? 'Visitas';
    const color = searchParams.get('color') ?? 'purple';
    const logo = searchParams.get('logo') ?? 'visitas';
    const style = searchParams.get('style') ?? 'pro';

    const current = standaloneViews.get(id) ?? 1429;
    const next = current + 1;
    standaloneViews.set(id, next);

    const svg = generateBadgeSvg({
      label,
      status: next.toLocaleString('en-US'),
      color,
      logo,
      style,
    });

    return new Response(svg, {
      status: 200,
      headers: {
        'Content-Type': 'image/svg+xml; charset=utf-8',
        'Cache-Control': 'max-age=0, no-cache, no-store, must-revalidate',
        'Surrogate-Control': 'no-store',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }

  // GitHub Metrics: /api/badge/github/:owner/:repo/:metric
  if (pathname.startsWith('/api/badge/github/')) {
    const parts = pathname.replace('/api/badge/github/', '').split('/');
    if (parts.length >= 3) {
      const [owner, repo, metric] = parts;
      const customLabel = searchParams.get('label');
      const customColor = searchParams.get('color');
      const style = searchParams.get('style') ?? 'pro';
      const logo = searchParams.get('logo') ?? 'github';

      const labelText = customLabel ?? metric;
      let statusText = 'unknown';
      let statusColor = customColor ?? 'blue';

      if (metric === 'release') {
        const release = await getLatestRelease(owner, repo);
        statusText = release || 'none';
        statusColor = customColor ?? (release ? 'black' : 'gray');
      } else {
        const repoData = await getRepoInfo(owner, repo);
        if (repoData) {
          if (metric === 'stars') statusText = formatNumber(repoData.stargazers_count);
          else if (metric === 'forks') statusText = formatNumber(repoData.forks_count);
          else if (metric === 'license') statusText = repoData.license?.spdx_id || 'none';
          else if (metric === 'size') statusText = formatBytes(repoData.size);
        }
      }

      const svg = generateBadgeSvg({
        label: labelText,
        status: statusText,
        color: statusColor,
        logo,
        style,
      });

      return new Response(svg, {
        status: 200,
        headers: {
          'Content-Type': 'image/svg+xml; charset=utf-8',
          'Cache-Control': 'public, max-age=300',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }
  }

  // 404
  return new Response('Not Found. Endpoints: /api/badge, /api/badge/views, /health', {
    status: 404,
    headers: { 'Content-Type': 'text/plain' },
  });
}

interface BunGlobal {
  serve: (options: { port: number; fetch: (req: Request) => Promise<Response> | Response }) => void;
}

interface DenoGlobal {
  serve: (options: { port: number }, handler: (req: Request) => Promise<Response> | Response) => void;
}

const bunGlobal = (globalThis as unknown as { Bun?: BunGlobal }).Bun;
const denoGlobal = (globalThis as unknown as { Deno?: DenoGlobal }).Deno;

const isMain = Boolean((import.meta as unknown as { main?: boolean }).main);

if (isMain) {
  if (bunGlobal) {
    bunGlobal.serve({
      port: PORT,
      fetch: handleRequest,
    });
    console.log(`⚡ Bun Microservice running at: http://localhost:${PORT}`);
  } else if (denoGlobal) {
    denoGlobal.serve({ port: PORT }, handleRequest);
    console.log(`🦕 Deno Microservice running at: http://localhost:${PORT}`);
  }
}
