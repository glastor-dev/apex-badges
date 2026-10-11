import { measureTextWidth } from './text-metrics';
import { getIcon } from './icons';
import { resolveColor, GRADIENT_PRESETS, type BadgeStyle } from './themes';

export interface BadgeOptions {
  label?: string;
  status?: string;
  color?: string;
  labelColor?: string;
  logo?: string;
  logoColor?: string;
  style?: BadgeStyle | string;
  radius?: number;
  height?: number;
  iconOnly?: boolean;
  id?: string;
}

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '&':
        return '&amp;';
      case '\'':
        return '&apos;';
      case '"':
        return '&quot;';
      default:
        return c;
    }
  });
}

function hashString(str: string): string {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash).toString(36);
}

/**
 * Generates an ultra-crisp, GitHub-Camo-compliant dynamic SVG badge.
 */
export function generateBadgeSvg(options: BadgeOptions): string {
  const {
    label = '',
    status = 'passing',
    color = 'green',
    labelColor,
    logo,
    logoColor,
    style = 'pro',
    height = 20,
  } = options;

  const badgeStyle: BadgeStyle = (['pro', 'flat', 'pill', 'glass', 'cyber', 'gradient'].includes(style)
    ? style
    : 'pro') as BadgeStyle;

  // Resolve Colors
  const statusColor = resolveColor(color, '#2ea44f');
  const defaultLabelBg = badgeStyle === 'flat' ? '#555555' : '#1f2328';
  const labelBg = labelColor ? resolveColor(labelColor, defaultLabelBg) : defaultLabelBg;

  // Icon Resolution
  const iconData = getIcon(logo);
  const iconSize = 13;
  const hasIcon = !!iconData;
  const resolvedLogoColor = logoColor ? resolveColor(logoColor, '#ffffff') : (hasIcon ? '#ffffff' : '');

  // Metrics Calculation
  const fontSize = 11;
  const textY = Math.round(height / 2) + 3; // Vertical centering for Verdana 11px
  const textShadowY = textY + 1;

  // Horizontal Padding
  const padH = 6;
  const iconSpacing = hasIcon ? iconSize + 4 : 0;

  const labelTextWidth = label ? measureTextWidth(label, fontSize) : 0;
  const statusTextWidth = status ? measureTextWidth(status, fontSize) : 0;

  // If label is empty, leftWidth is 0 or only icon
  let leftWidth = 0;
  if (label || hasIcon) {
    leftWidth = padH + iconSpacing + labelTextWidth + (labelTextWidth > 0 ? padH : (hasIcon ? padH : 0));
  }

  const rightWidth = status ? padH + statusTextWidth + padH : 0;
  const totalWidth = Math.max(leftWidth + rightWidth, 24);

  // Border Radius
  let rx = 4;
  if (badgeStyle === 'pill') rx = Math.round(height / 2);
  else if (badgeStyle === 'flat') rx = 3;
  else if (options.radius !== undefined) rx = Number(options.radius);

  // Icon Position
  const iconX = padH;
  const iconY = Math.round((height - iconSize) / 2);

  // Label text X (centered in label area or right of icon)
  const labelTextX = hasIcon
    ? iconX + iconSize + 4 + Math.round(labelTextWidth / 2)
    : Math.round(leftWidth / 2);

  // Status text X (centered in status area)
  const statusTextX = leftWidth + Math.round(rightWidth / 2);

  // Accessible Label
  const ariaLabel = [label, status].filter(Boolean).join(': ');

  // Gradient support if requested
  const gradientPair = GRADIENT_PRESETS[color.toLowerCase()] || null;
  const isGradient = badgeStyle === 'gradient' || !!gradientPair;
  const gradStart = gradientPair ? gradientPair[0] : statusColor;
  const gradEnd = gradientPair ? gradientPair[1] : statusColor;

  // Collision-free unique element IDs for inline SVG embedding (deterministic for Next.js prerender)
  const uid = options.id
    ? options.id.replace(/[^a-zA-Z0-9_-]/g, '')
    : hashString(`${label}_${status}_${color}_${labelColor || ''}_${badgeStyle}_${height}_${logo || ''}`);
  const clipId = `r-${uid}`;
  const sheenId = `sheen-${uid}`;
  const gradId = `statusGrad-${uid}`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="${height}" viewBox="0 0 ${totalWidth} ${height}" role="img" aria-label="${escapeXml(ariaLabel)}">
  <title>${escapeXml(ariaLabel)}</title>
  <defs>
    <clipPath id="${clipId}">
      <rect width="${totalWidth}" height="${height}" rx="${rx}" fill="#fff"/>
    </clipPath>
    <linearGradient id="${sheenId}" x2="0" y2="100%">
      <stop offset="0" stop-color="#fff" stop-opacity=".15"/>
      <stop offset="1" stop-color="#000" stop-opacity=".15"/>
    </linearGradient>
    ${
      isGradient
        ? `<linearGradient id="${gradId}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${gradStart}"/>
      <stop offset="100%" stop-color="${gradEnd}"/>
    </linearGradient>`
        : ''
    }
  </defs>

  <g clip-path="url(#${clipId})">
    ${leftWidth > 0 ? `<rect width="${leftWidth}" height="${height}" fill="${labelBg}"/>` : ''}
    <rect x="${leftWidth}" width="${rightWidth || totalWidth}" height="${height}" fill="${isGradient ? `url(#${gradId})` : statusColor}"/>
    ${badgeStyle !== 'flat' ? `<rect width="${totalWidth}" height="${height}" fill="url(#${sheenId})"/>` : ''}
  </g>

  ${
    badgeStyle === 'pro'
      ? `<rect width="${totalWidth}" height="${height}" rx="${rx}" fill="none" stroke="rgba(255,255,255,0.12)" stroke-width="1"/>`
      : badgeStyle === 'glass'
      ? `<rect width="${totalWidth}" height="${height}" rx="${rx}" fill="none" stroke="rgba(255,255,255,0.28)" stroke-width="1"/>`
      : badgeStyle === 'cyber'
      ? `<path d="M0 ${height - 1} L${totalWidth} ${height - 1}" stroke="${isGradient ? gradStart : statusColor}" stroke-width="2"/>`
      : ''
  }

  ${
    leftWidth > 0 && rightWidth > 0 && badgeStyle !== 'flat'
      ? `<line x1="${leftWidth}" y1="0" x2="${leftWidth}" y2="${height}" stroke="rgba(0,0,0,0.22)" stroke-width="1"/>`
      : ''
  }

  ${
    hasIcon && iconData
      ? `<svg x="${iconX}" y="${iconY}" width="${iconSize}" height="${iconSize}" viewBox="${iconData.viewBox || '0 0 24 24'}">
    <path fill="${resolvedLogoColor}" d="${iconData.path}"/>
  </svg>`
      : ''
  }

  <g aria-hidden="true" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" font-size="${fontSize}">
    ${
      label
        ? `<!-- Label -->
    <text x="${labelTextX}" y="${textShadowY}" fill="#010101" fill-opacity=".3" text-anchor="middle">${escapeXml(label)}</text>
    <text x="${labelTextX}" y="${textY}" fill="#fff" text-anchor="middle">${escapeXml(label)}</text>`
        : ''
    }
    ${
      status
        ? `<!-- Status -->
    <text x="${statusTextX}" y="${textShadowY}" fill="#010101" fill-opacity=".3" text-anchor="middle">${escapeXml(status)}</text>
    <text x="${statusTextX}" y="${textY}" fill="#fff" text-anchor="middle">${escapeXml(status)}</text>`
        : ''
    }
  </g>
</svg>`;
}
