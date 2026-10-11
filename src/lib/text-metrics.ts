/**
 * Character width metrics for Verdana / System font at 11px size.
 * Allows calculating exact SVG text widths without heavy DOM or canvas dependencies.
 */

// Precise widths per character at font-size 11px (in pixels)
const CHAR_WIDTHS_11PX: Record<string, number> = {
  ' ': 3.8,
  '!': 4.1,
  '"': 5.2,
  '#': 8.6,
  '$': 7.1,
  '%': 11.2,
  '&': 8.9,
  "'": 3.4,
  '(': 4.7,
  ')': 4.7,
  '*': 5.5,
  '+': 8.2,
  ',': 3.8,
  '-': 4.6,
  '.': 3.8,
  '/': 5.2,
  '0': 7.1,
  '1': 6.2,
  '2': 7.1,
  '3': 7.1,
  '4': 7.1,
  '5': 7.1,
  '6': 7.1,
  '7': 6.9,
  '8': 7.1,
  '9': 7.1,
  ':': 4.1,
  ';': 4.1,
  '<': 8.2,
  '=': 8.2,
  '>': 8.2,
  '?': 6.3,
  '@': 11.1,
  'A': 8.0,
  'B': 7.9,
  'C': 7.9,
  'D': 8.6,
  'E': 7.4,
  'F': 7.0,
  'G': 8.6,
  'H': 8.9,
  'I': 4.5,
  'J': 5.9,
  'K': 8.1,
  'L': 6.8,
  'M': 10.1,
  'N': 8.8,
  'O': 8.9,
  'P': 7.5,
  'Q': 8.9,
  'R': 8.2,
  'S': 7.4,
  'T': 7.3,
  'U': 8.5,
  'V': 8.0,
  'W': 11.4,
  'X': 8.0,
  'Y': 7.6,
  'Z': 7.4,
  '[': 4.8,
  '\\': 5.2,
  ']': 4.8,
  '^': 8.2,
  '_': 6.8,
  '`': 5.4,
  'a': 6.6,
  'b': 7.0,
  'c': 6.0,
  'd': 7.0,
  'e': 6.6,
  'f': 4.5,
  'g': 7.0,
  'h': 7.1,
  'i': 3.4,
  'j': 3.8,
  'k': 6.8,
  'l': 3.4,
  'm': 10.9,
  'n': 7.1,
  'o': 7.0,
  'p': 7.1,
  'q': 7.0,
  'r': 5.0,
  's': 5.9,
  't': 4.6,
  'u': 7.1,
  'v': 6.6,
  'w': 9.8,
  'x': 6.5,
  'y': 6.6,
  'z': 6.1,
  '{': 4.8,
  '|': 4.1,
  '}': 4.8,
  '~': 8.2,
};

/**
 * Calculates the width in pixels for a string rendered at a given font-size.
 * @param text The text to measure
 * @param fontSize Font size in px (defaults to 11)
 * @param letterSpacing Extra spacing in px (defaults to 0)
 */
export function measureTextWidth(text: string, fontSize = 11, letterSpacing = 0): number {
  if (!text) return 0;

  const scale = fontSize / 11;
  let totalWidth = 0;

  for (const char of text) {
    const charWidth = CHAR_WIDTHS_11PX[char] ?? 7.0; // fallback width for unknown unicode
    totalWidth += charWidth * scale + letterSpacing;
  }

  // Add small kerning buffer
  return Math.ceil(totalWidth);
}
