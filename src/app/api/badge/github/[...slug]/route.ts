import { NextRequest, NextResponse } from 'next/server';
import { generateBadgeSvg } from '@/lib/svg-engine';
import { getRepoInfo, getLatestRelease, formatNumber, formatBytes } from '@/lib/github';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  const { slug } = await params;
  const { searchParams } = new URL(request.url);

  if (!slug || slug.length < 3) {
    return new NextResponse(
      generateBadgeSvg({
        label: 'github',
        status: 'invalid path: :owner/:repo/:metric',
        color: 'red',
        logo: 'github',
      }),
      {
        status: 400,
        headers: { 'Content-Type': 'image/svg+xml; charset=utf-8' },
      }
    );
  }

  const [owner, repo, metric] = slug;

  // Sanitize owner and repo
  if (!/^[a-zA-Z0-9_.-]+$/.test(owner) || !/^[a-zA-Z0-9_.-]+$/.test(repo)) {
    return new NextResponse(
      generateBadgeSvg({
        label: 'github',
        status: 'invalid repo name',
        color: 'red',
        logo: 'github',
      }),
      {
        status: 400,
        headers: {
          'Content-Type': 'image/svg+xml; charset=utf-8',
          'Content-Security-Policy': "default-src 'none'; style-src 'unsafe-inline'; sandbox",
          'X-Content-Type-Options': 'nosniff',
        },
      }
    );
  }

  const customLabel = searchParams.get('label');
  const customColor = searchParams.get('color');
  const style = searchParams.get('style') ?? 'pro';
  const logo = searchParams.get('logo') ?? 'github';

  let statusText = 'unknown';
  let labelText = customLabel ?? metric;
  let statusColor = customColor ?? 'blue';

  if (metric === 'release' || metric === 'version') {
    const release = await getLatestRelease(owner, repo);
    labelText = customLabel ?? 'release';
    statusText = release || 'none';
    statusColor = customColor ?? (release ? 'black' : 'gray');
  } else {
    const repoData = await getRepoInfo(owner, repo);

    if (!repoData) {
      return new NextResponse(
        generateBadgeSvg({
          label: customLabel ?? repo,
          status: 'not found',
          color: 'red',
          logo: 'github',
          style,
        }),
        {
          status: 404,
          headers: {
            'Content-Type': 'image/svg+xml; charset=utf-8',
            'Cache-Control': 'public, max-age=60',
          },
        }
      );
    }

    switch (metric) {
      case 'stars':
        labelText = customLabel ?? 'stars';
        statusText = formatNumber(repoData.stargazers_count);
        statusColor = customColor ?? 'yellow';
        break;
      case 'forks':
        labelText = customLabel ?? 'forks';
        statusText = formatNumber(repoData.forks_count);
        statusColor = customColor ?? 'blue';
        break;
      case 'issues':
        labelText = customLabel ?? 'issues';
        statusText = `${repoData.open_issues_count} open`;
        statusColor = customColor ?? (repoData.open_issues_count > 0 ? 'yellow' : 'green');
        break;
      case 'license':
        labelText = customLabel ?? 'license';
        statusText = repoData.license?.spdx_id || repoData.license?.name || 'none';
        statusColor = customColor ?? 'blue';
        break;
      case 'size':
        labelText = customLabel ?? 'size';
        statusText = formatBytes(repoData.size);
        statusColor = customColor ?? 'gray';
        break;
      case 'language':
        labelText = customLabel ?? 'lang';
        statusText = repoData.language || 'none';
        statusColor = customColor ?? 'indigo';
        break;
      case 'watchers':
        labelText = customLabel ?? 'watchers';
        statusText = formatNumber(repoData.watchers_count);
        statusColor = customColor ?? 'purple';
        break;
      default:
        labelText = customLabel ?? metric;
        statusText = 'invalid';
        statusColor = 'red';
    }
  }

  const svg = generateBadgeSvg({
    label: labelText,
    status: statusText,
    color: statusColor,
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
      'X-Badge-Source': 'GitHub-API',
    },
  });
}
