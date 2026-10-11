import { describe, it } from 'node:test';
import assert from 'node:assert';
import { generateBadgeSvg } from '../../src/lib/svg-engine';
import { resolveColor } from '../../src/lib/themes';

describe('Unit: Security & Input Sanitization', () => {
  it('escapes dangerous XML characters in label and status', () => {
    const attacks = [
      { input: '<script>alert("xss")</script>', expected: '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;' },
      { input: '"><svg onload=alert(1)>', expected: '&quot;&gt;&lt;svg onload=alert(1)&gt;' },
      { input: 'A & B', expected: 'A &amp; B' },
      { input: "it's dangerous", expected: 'it&apos;s dangerous' },
    ];

    for (const { input, expected } of attacks) {
      const svg = generateBadgeSvg({ label: input, status: input });
      assert.ok(!svg.includes('<script>'), `SVG should not contain unescaped script tag: ${input}`);
      assert.ok(!svg.includes('<svg onload='), `SVG should not contain unescaped svg onload tag: ${input}`);
      assert.ok(svg.includes(expected), `SVG should contain escaped entity: ${expected}`);
    }
  });

  it('rejects CSS/SVG attribute injection in color parameter', () => {
    const maliciousColors = [
      'red"><script>alert(1)</script><path d="',
      '#fff; background: url(javascript:alert(1))',
      'rgba(0,0,0); alert(1);',
      'url("http://attacker.com")',
      'red" onmouseover="alert(1)"',
    ];

    for (const malicious of maliciousColors) {
      const resolved = resolveColor(malicious, '#007ec6');
      assert.strictEqual(resolved, '#007ec6', `Should reject malicious color: ${malicious}`);
    }
  });

  it('safely handles extremely long string inputs without crash', () => {
    const hugeLabel = 'A'.repeat(5000);
    const hugeStatus = 'B'.repeat(5000);

    const svg = generateBadgeSvg({ label: hugeLabel, status: hugeStatus });
    assert.ok(svg.startsWith('<svg'), 'Should generate SVG even with large inputs');
    assert.ok(svg.length > 10000, 'SVG length should reflect text length');
  });

  it('accepts valid colors without false positives', () => {
    assert.strictEqual(resolveColor('#121212'), '#121212');
    assert.strictEqual(resolveColor('007ec6'), '#007ec6');
    assert.strictEqual(resolveColor('rgb(255, 0, 128)'), 'rgb(255, 0, 128)');
    assert.strictEqual(resolveColor('rgba(0, 126, 198, 0.5)'), 'rgba(0, 126, 198, 0.5)');
    assert.strictEqual(resolveColor('hsl(120, 100%, 50%)'), 'hsl(120, 100%, 50%)');
  });
});
