import { NextRequest, NextResponse } from 'next/server';
import { generateBadgeSvg } from '@/lib/svg-engine';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  const { slug } = await params;
  const { searchParams } = new URL(request.url);

  if (!slug || slug.length === 0) {
    return new NextResponse('Missing package name', { status: 400 });
  }

  // Handle scoped packages like @glastor-dev/readmegen
  const pkgName = slug.join('/');
  const customLabel = searchParams.get('label') ?? 'npm';
  const customColor = searchParams.get('color') ?? 'red';
  const style = searchParams.get('style') ?? 'pro';
  const logo = searchParams.get('logo') ?? 'npm';

  try {
    const res = await fetch(`https://registry.npmjs.org/${encodeURIComponent(pkgName).replace('%40', '@')}`, {
      headers: { Accept: 'application/json' },
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      const svg = generateBadgeSvg({
        label: customLabel,
        status: 'not found',
        color: 'gray',
        logo,
        style,
      });
      return new NextResponse(svg, {
        status: 404,
        headers: { 'Content-Type': 'image/svg+xml; charset=utf-8' },
      });
    }

    const data = await res.json();
    const latestVersion = data['dist-tags']?.latest || 'unknown';

    const svg = generateBadgeSvg({
      label: customLabel,
      status: `v${latestVersion}`,
      color: customColor,
      logo,
      style,
    });

    return new NextResponse(svg, {
      status: 200,
      headers: {
        'Content-Type': 'image/svg+xml; charset=utf-8',
        'Content-Security-Policy': "default-src 'none'; style-src 'unsafe-inline'; sandbox",
        'X-Content-Type-Options': 'nosniff',
        'Cache-Control': 'public, max-age=300, s-maxage=3600, stale-while-revalidate=86400',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (err) {
    console.error('NPM fetch error:', err);
    const svg = generateBadgeSvg({
      label: customLabel,
      status: 'error',
      color: 'gray',
      logo,
      style,
    });
    return new NextResponse(svg, {
      status: 500,
      headers: { 'Content-Type': 'image/svg+xml; charset=utf-8' },
    });
  }
}
