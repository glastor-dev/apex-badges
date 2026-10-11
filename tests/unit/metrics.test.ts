import { describe, it } from 'node:test';
import assert from 'node:assert';
import { measureTextWidth } from '../../src/lib/text-metrics';

describe('Unit: Text Metrics & Kerning Calculator', () => {
  it('returns zero width for empty strings', () => {
    assert.strictEqual(measureTextWidth(''), 0);
  });

  it('calculates width proportionally based on character count', () => {
    const w1 = measureTextWidth('a');
    const w5 = measureTextWidth('aaaaa');
    assert.ok(w5 > w1 * 4, 'Multiple characters should scale proportionally');
  });

  it('correctly distinguishes between narrow and wide characters', () => {
    // Narrow characters: 'i', 'l', '1', '.'
    // Wide characters: 'M', 'W', 'm', 'w'
    const narrowWidth = measureTextWidth('iiii');
    const wideWidth = measureTextWidth('MMMM');

    assert.ok(wideWidth > narrowWidth * 2, 'Wide characters should be significantly wider than narrow characters');
  });

  it('handles custom font sizes and letter spacing', () => {
    const standard = measureTextWidth('Hello', 11);
    const large = measureTextWidth('Hello', 14);
    const withSpacing = measureTextWidth('Hello', 11, 2);

    assert.ok(large > standard, 'Larger font size should yield greater width');
    assert.ok(withSpacing > standard, 'Extra letter spacing should increase width');
  });

  it('gracefully handles non-ascii and unicode characters', () => {
    const unicodeWidth = measureTextWidth('🛡️ 🚀 ⚡');
    assert.ok(unicodeWidth > 0, 'Unicode characters should calculate fallback width without crashing');
  });
});
