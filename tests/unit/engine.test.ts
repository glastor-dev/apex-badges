import { describe, it } from 'node:test';
import assert from 'node:assert';
import { generateBadgeSvg } from '../../src/lib/svg-engine';
import { getIcon } from '../../src/lib/icons';
import { GRADIENT_PRESETS } from '../../src/lib/themes';

describe('Unit: Badge SVG Engine', () => {
  it('generates all 6 visual styles without syntax errors', () => {
    const styles = ['pro', 'flat', 'pill', 'glass', 'cyber', 'gradient'] as const;

    for (const style of styles) {
      const svg = generateBadgeSvg({
        label: 'Style',
        status: style,
        color: 'blue',
        style,
      });

      assert.ok(svg.startsWith('<svg'), `Style ${style} should produce an SVG`);
      assert.ok(svg.endsWith('</svg>'), `Style ${style} should close SVG`);
      assert.ok(svg.includes(style), `Style ${style} should include status text`);
    }
  });

  it('correctly replicates the 7 reference badges from the image', () => {
    // 1. Deno ^1.40.0
    const deno = generateBadgeSvg({ label: 'Deno', status: '^1.40.0', color: '#111317', logo: 'deno', style: 'pro' });
    assert.ok(deno.includes('Deno') && deno.includes('^1.40.0'));

    // 2. Docker ready
    const docker = generateBadgeSvg({ label: 'Docker', status: 'ready', color: '#007ec6', logo: 'docker', style: 'pro' });
    assert.ok(docker.includes('Docker') && docker.includes('ready'));

    // 3. lefthook enabled
    const lefthook = generateBadgeSvg({ label: 'lefthook', status: 'enabled', color: '#3fb950', logo: 'lefthook', style: 'pro' });
    assert.ok(lefthook.includes('lefthook') && lefthook.includes('enabled'));

    // 4. CodeQL passing
    const codeql = generateBadgeSvg({ label: 'CodeQL', status: 'passing', color: '#2ea44f', logo: 'github', style: 'pro' });
    assert.ok(codeql.includes('CodeQL') && codeql.includes('passing'));

    // 5. Code License GPLv3
    const lic1 = generateBadgeSvg({ label: 'Code License', status: 'GPLv3', color: '#0969da', style: 'pro' });
    assert.ok(lic1.includes('Code License') && lic1.includes('GPLv3'));

    // 6. Text License CC BY 4.0
    const lic2 = generateBadgeSvg({ label: 'Text License', status: 'CC BY 4.0', color: '#6e7681', style: 'pro' });
    assert.ok(lic2.includes('Text License') && lic2.includes('CC BY 4.0'));

    // 7. Visitas 1,430
    const views = generateBadgeSvg({ label: 'Visitas', status: '1,430', color: '#8a2be2', logo: 'visitas', style: 'pro' });
    assert.ok(views.includes('Visitas') && views.includes('1,430'));
  });

  it('handles badge without label (status only) and icon only', () => {
    const statusOnly = generateBadgeSvg({ status: 'v2.0.0', color: 'green' });
    assert.ok(statusOnly.includes('v2.0.0'));

    const iconStatus = generateBadgeSvg({ status: 'ready', logo: 'docker' });
    assert.ok(iconStatus.includes('ready') && iconStatus.includes('<path'));
  });

  it('resolves built-in and simple-icons correctly', () => {
    assert.ok(getIcon('docker') !== null);
    assert.ok(getIcon('deno') !== null);
    assert.ok(getIcon('github') !== null);
    assert.ok(getIcon('visitas') !== null);
    assert.ok(getIcon('license') !== null);
    assert.ok(getIcon('non-existent-xyz') === null);
  });

  it('resolves gradient presets correctly', () => {
    for (const gradName of Object.keys(GRADIENT_PRESETS)) {
      const svg = generateBadgeSvg({ label: 'Grad', status: 'Vibrant', color: gradName });
      assert.ok(svg.includes('id="statusGrad-'), `Gradient ${gradName} should use gradient def with unique ID`);
    }

    // Explicit custom ID test
    const customSvg = generateBadgeSvg({ label: 'A', status: 'B', id: 'custom-badge-id' });
    assert.ok(customSvg.includes('id="r-custom-badge-id"'), 'Should respect explicit custom id');
  });

  it('supports custom radius and custom badge heights', () => {
    const customH = generateBadgeSvg({ label: 'H', status: '28px', height: 28, radius: 8 });
    assert.ok(customH.includes('height="28"'));
    assert.ok(customH.includes('rx="8"'));
  });
});
