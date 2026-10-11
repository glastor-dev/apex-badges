import { NextRequest, NextResponse } from 'next/server';
import { generateBadgeSvg } from '@/lib/svg-engine';
import { formatNumber } from '@/lib/github';

// In-memory fallback counter
const localCounter = new Map<string, number>();

async function getAndIncrementCount(id: string, hit = true): Promise<number> {
  const upstashUrl = process.env.UPSTASH_REDIS_REST_URL;
  const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (upstashUrl && upstashToken) {
    try {
      const endpoint = hit ? `${upstashUrl}/incr/badge_views:${encodeURIComponent(id)}` : `${upstashUrl}/get/badge_views:${encodeURIComponent(id)}`;
      const res = await fetch(endpoint, {
        headers: { Authorization: `Bearer ${upstashToken}` },
        cache: 'no-store',
      });
      if (res.ok) {
        const json = await res.json();
        const count = typeof json.result === 'number' ? json.result : parseInt(json.result || '1', 10);
        return isNaN(count) ? 1 : count;
      }
    } catch (e) {
      console.error('Upstash Redis error:', e);
    }
  }

  // Fallback in-memory
  const current = localCounter.get(id) ?? 1429;
  const next = hit ? current + 1 : current;
  localCounter.set(id, next);
  return next;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const id = searchParams.get('id') || 'apex-badges-repo';
  const label = searchParams.get('label') ?? 'Visitas';
  const color = searchParams.get('color') ?? 'purple';
  const labelColor = searchParams.get('labelColor') ?? undefined;
  const logo = searchParams.get('logo') ?? 'visitas';
  const logoColor = searchParams.get('logoColor') ?? undefined;
  const style = searchParams.get('style') ?? 'pro';
  const hit = searchParams.get('hit') !== 'false';
  const format = searchParams.get('format') ?? 'comma'; // 'comma' | 'compact'

  const count = await getAndIncrementCount(id, hit);
  const formattedStatus = format === 'compact' ? formatNumber(count) : count.toLocaleString('en-US');

  const svg = generateBadgeSvg({
    label,
    status: formattedStatus,
    color,
    labelColor,
    logo,
    logoColor,
    style,
  });

  return new NextResponse(svg, {
    status: 200,
    headers: {
      'Content-Type': 'image/svg+xml; charset=utf-8',
      'Content-Security-Policy': "default-src 'none'; style-src 'unsafe-inline'; sandbox",
      'X-Content-Type-Options': 'nosniff',
      'Cache-Control': 'max-age=0, no-cache, no-store, must-revalidate',
      'Surrogate-Control': 'no-store',
      'Pragma': 'no-cache',
      'Expires': '0',
      'Access-Control-Allow-Origin': '*',
      'X-Badge-Type': 'views-counter',
    },
  });
}
