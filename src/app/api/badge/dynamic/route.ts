import { NextRequest, NextResponse } from 'next/server';
import { generateBadgeSvg } from '@/lib/svg-engine';

/**
 * Validates URLs against SSRF (Server-Side Request Forgery).
 * Blocks loopback, private networks, cloud metadata services, and non-http(s) protocols.
 */
function isSafeUrl(rawUrl: string): boolean {
  try {
    const parsed = new URL(rawUrl);

    // Only allow http: and https:
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return false;
    }

    const host = parsed.hostname.toLowerCase();

    // Block loopbacks and internal names
    if (
      host === 'localhost' ||
      host === '127.0.0.1' ||
      host === '0.0.0.0' ||
      host === '::1' ||
      host === '[::1]' ||
      host.endsWith('.local') ||
      host.endsWith('.internal') ||
      host.endsWith('.onion')
    ) {
      return false;
    }

    // Block cloud metadata services (AWS, GCP, Azure, Oracle, DigitalOcean)
    if (
      host === '169.254.169.254' ||
      host === 'metadata.google.internal' ||
      host === 'instance-data' ||
      host.startsWith('169.254.')
    ) {
      return false;
    }

    // Block private RFC 1918 IPv4 ranges
    if (
      /^10\./.test(host) ||
      /^192\.168\./.test(host) ||
      /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(host) ||
      /^127\./.test(host) ||
      /^0\./.test(host)
    ) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

/**
 * Traverses JSON object safely preventing Prototype Pollution.
 */
function extractJsonValue(obj: unknown, path: string): unknown {
  if (!obj || typeof obj !== 'object') return undefined;
  const cleanPath = path.replace(/^\$\.?/, '');
  const parts = cleanPath.split('.');
  const forbidden = new Set(['__proto__', 'constructor', 'prototype']);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let current: any = obj;

  for (const part of parts) {
    if (forbidden.has(part)) return undefined;
    if (current === undefined || current === null) return undefined;
    current = current[part];
  }
  return current;
}

const SECURITY_HEADERS = {
  'Content-Type': 'image/svg+xml; charset=utf-8',
  'Content-Security-Policy': "default-src 'none'; style-src 'unsafe-inline'; sandbox",
  'X-Content-Type-Options': 'nosniff',
  'Access-Control-Allow-Origin': '*',
  'Cache-Control': 'public, max-age=60, s-maxage=120, stale-while-revalidate=300',
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const targetUrl = searchParams.get('url');
  const query = searchParams.get('query') || 'status';
  const label = searchParams.get('label') || 'api';
  const color = searchParams.get('color') || 'blue';
  const logo = searchParams.get('logo') || undefined;
  const style = searchParams.get('style') || 'pro';

  if (!targetUrl) {
    return new NextResponse(
      generateBadgeSvg({
        label,
        status: 'missing ?url=',
        color: 'red',
        style,
      }),
      {
        status: 400,
        headers: SECURITY_HEADERS,
      }
    );
  }

  // SSRF Protection
  if (!isSafeUrl(targetUrl)) {
    return new NextResponse(
      generateBadgeSvg({
        label,
        status: 'blocked (ssrf)',
        color: 'red',
        style,
      }),
      {
        status: 403,
        headers: SECURITY_HEADERS,
      }
    );
  }

  try {
    let currentUrl = targetUrl;
    let res: Response | null = null;
    let hops = 0;
    const maxHops = 3;

    while (hops < maxHops) {
      const response = await fetch(currentUrl, {
        headers: {
          Accept: 'application/json',
          'User-Agent': 'ApexBadges-Dynamic/1.0',
        },
        signal: AbortSignal.timeout(4000),
        redirect: 'manual',
      });

      // If redirect response (301, 302, 303, 307, 308)
      if ([301, 302, 303, 307, 308].includes(response.status)) {
        const location = response.headers.get('location');
        if (!location) {
          throw new Error('Redirect missing Location header');
        }
        const resolvedUrl = new URL(location, currentUrl).toString();
        if (!isSafeUrl(resolvedUrl)) {
          return new NextResponse(
            generateBadgeSvg({
              label,
              status: 'blocked redirect (ssrf)',
              color: 'red',
              style,
            }),
            {
              status: 403,
              headers: SECURITY_HEADERS,
            }
          );
        }
        currentUrl = resolvedUrl;
        hops++;
        continue;
      }

      res = response;
      break;
    }

    if (!res) {
      throw new Error('Too many redirects');
    }

    if (!res.ok) {
      return new NextResponse(
        generateBadgeSvg({
          label,
          status: `HTTP ${res.status}`,
          color: 'red',
          style,
        }),
        {
          status: 502,
          headers: SECURITY_HEADERS,
        }
      );
    }

    // Protect against huge payload attacks
    const contentLength = res.headers.get('content-length');
    if (contentLength && parseInt(contentLength, 10) > 512 * 1024) {
      return new NextResponse(
        generateBadgeSvg({
          label,
          status: 'payload too large',
          color: 'red',
          style,
        }),
        {
          status: 413,
          headers: SECURITY_HEADERS,
        }
      );
    }

    const data = await res.json();
    const rawVal = extractJsonValue(data, query);

    let statusVal = 'not found';
    if (rawVal !== undefined && rawVal !== null) {
      statusVal = String(rawVal).slice(0, 40); // truncate length
    }

    const svg = generateBadgeSvg({
      label,
      status: statusVal,
      color,
      logo,
      style,
    });

    return new NextResponse(svg, {
      status: 200,
      headers: SECURITY_HEADERS,
    });
  } catch (err) {
    console.error('Dynamic fetch error:', err);
    return new NextResponse(
      generateBadgeSvg({
        label,
        status: 'fetch error',
        color: 'red',
        style,
      }),
      {
        status: 500,
        headers: SECURITY_HEADERS,
      }
    );
  }
}
