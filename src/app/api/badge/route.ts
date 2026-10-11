import { NextRequest, NextResponse } from 'next/server';
import { generateBadgeSvg } from '@/lib/svg-engine';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const label = searchParams.get('label') ?? '';
  const status = searchParams.get('status') ?? 'passing';
  const color = searchParams.get('color') ?? 'green';
  const labelColor = searchParams.get('labelColor') ?? undefined;
  const logo = searchParams.get('logo') ?? undefined;
  const logoColor = searchParams.get('logoColor') ?? undefined;
  const style = searchParams.get('style') ?? 'pro';
  const radius = searchParams.get('radius') ? Number(searchParams.get('radius')) : undefined;
  const height = searchParams.get('height') ? Number(searchParams.get('height')) : 20;

  const svg = generateBadgeSvg({
    label,
    status,
    color,
    labelColor,
    logo,
    logoColor,
    style,
    radius,
    height,
  });

  return new NextResponse(svg, {
    status: 200,
    headers: {
      'Content-Type': 'image/svg+xml; charset=utf-8',
      'Content-Security-Policy': "default-src 'none'; style-src 'unsafe-inline'; sandbox",
      'X-Content-Type-Options': 'nosniff',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400',
      'Access-Control-Allow-Origin': '*',
      'X-Badge-Engine': 'ApexBadges',
    },
  });
}
