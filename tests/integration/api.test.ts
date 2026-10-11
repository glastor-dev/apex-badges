import { describe, it } from 'node:test';
import assert from 'node:assert';
import { NextRequest } from 'next/server';
import { GET as getBadge } from '../../src/app/api/badge/route';
import { GET as getViews } from '../../src/app/api/badge/views/route';
import { GET as getDynamic } from '../../src/app/api/badge/dynamic/route';
import { GET as getGithub } from '../../src/app/api/badge/github/[...slug]/route';
import { GET as getNpm } from '../../src/app/api/badge/npm/[...slug]/route';
import { handleRequest as handleStandaloneRequest } from '../../server';

describe('Integration: API Route Handlers', () => {
  it('GET /api/badge returns valid SVG with security and caching headers', async () => {
    const req = new NextRequest('http://localhost:3000/api/badge?label=Docker&status=ready&color=007ec6&logo=docker');
    const res = await getBadge(req);

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.headers.get('content-type'), 'image/svg+xml; charset=utf-8');
    assert.ok(res.headers.get('content-security-policy')?.includes('sandbox'), 'Should include CSP sandbox');
    assert.strictEqual(res.headers.get('x-content-type-options'), 'nosniff');

    const svg = await res.text();
    assert.ok(svg.includes('<svg'), 'Response body should be SVG');
    assert.ok(svg.includes('Docker'), 'SVG should contain label');
    assert.ok(svg.includes('ready'), 'SVG should contain status');
  });

  it('GET /api/badge/views increments counter and sets Camo cache-busting headers', async () => {
    const testId = `integration-test-${Date.now()}`;
    const req1 = new NextRequest(`http://localhost:3000/api/badge/views?id=${testId}&label=Visitas&color=purple`);
    const res1 = await getViews(req1);

    assert.strictEqual(res1.status, 200);
    assert.strictEqual(res1.headers.get('surrogate-control'), 'no-store', 'Must bust GitHub Camo cache');
    assert.ok(res1.headers.get('cache-control')?.includes('no-store'), 'Cache-Control must contain no-store');

    const svg1 = await res1.text();
    assert.ok(svg1.includes('Visitas'), 'SVG should include Visitas label');

    // Second call should increment
    const req2 = new NextRequest(`http://localhost:3000/api/badge/views?id=${testId}&label=Visitas&color=purple`);
    const res2 = await getViews(req2);
    const svg2 = await res2.text();
    assert.notStrictEqual(svg1, svg2, 'Consecutive calls should increment count');
  });

  it('GET /api/badge/dynamic blocks SSRF attacks against cloud metadata', async () => {
    // AWS metadata attempt
    const reqAws = new NextRequest('http://localhost:3000/api/badge/dynamic?url=http://169.254.169.254/latest/meta-data/');
    const resAws = await getDynamic(reqAws);
    assert.strictEqual(resAws.status, 403, 'Should block AWS metadata IP');

    const svgAws = await resAws.text();
    assert.ok(svgAws.includes('blocked (ssrf)'), 'SVG status should indicate blocked SSRF');

    // Localhost loopback attempt
    const reqLocal = new NextRequest('http://localhost:3000/api/badge/dynamic?url=http://127.0.0.1:8080/admin');
    const resLocal = await getDynamic(reqLocal);
    assert.strictEqual(resLocal.status, 403, 'Should block 127.0.0.1');

    // Missing URL parameter
    const reqMissing = new NextRequest('http://localhost:3000/api/badge/dynamic');
    const resMissing = await getDynamic(reqMissing);
    assert.strictEqual(resMissing.status, 400, 'Missing url should return 400');
  });

  it('GET /api/badge/github validates slug and blocks malicious paths', async () => {
    // Missing parameters
    const reqShort = new NextRequest('http://localhost:3000/api/badge/github/only-one');
    const resShort = await getGithub(reqShort, { params: Promise.resolve({ slug: ['only-one'] }) });
    assert.strictEqual(resShort.status, 400);

    // Malicious characters in repo name
    const reqMalicious = new NextRequest('http://localhost:3000/api/badge/github/user/repo;rm -rf/stars');
    const resMalicious = await getGithub(reqMalicious, {
      params: Promise.resolve({ slug: ['user', 'repo;rm -rf', 'stars'] }),
    });
    assert.strictEqual(resMalicious.status, 400, 'Should reject non-alphanumeric repo name');
  });

  it('GET /api/badge/npm handles non-existent packages gracefully', async () => {
    const req = new NextRequest('http://localhost:3000/api/badge/npm/this-package-definitely-does-not-exist-xyz123');
    const res = await getNpm(req, {
      params: Promise.resolve({ slug: ['this-package-definitely-does-not-exist-xyz123'] }),
    });
    assert.strictEqual(res.status, 404);
    const svg = await res.text();
    assert.ok(svg.includes('not found'), 'Should render not found status in SVG');
  });

  it('Standalone microservice handleRequest serves health and badges', async () => {
    // Health check
    const healthReq = new Request('http://localhost:3001/health');
    const healthRes = await handleStandaloneRequest(healthReq);
    assert.strictEqual(healthRes.status, 200);
    const healthData = await healthRes.json() as { status: string };
    assert.strictEqual(healthData.status, 'ok');

    // Badge endpoint
    const badgeReq = new Request('http://localhost:3001/api/badge?label=Deno&status=v2.0&color=blue');
    const badgeRes = await handleStandaloneRequest(badgeReq);
    assert.strictEqual(badgeRes.status, 200);
    assert.strictEqual(badgeRes.headers.get('content-type'), 'image/svg+xml; charset=utf-8');
    const svg = await badgeRes.text();
    assert.ok(svg.includes('Deno'));
  });
});
