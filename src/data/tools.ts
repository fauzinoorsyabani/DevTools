export interface Tool {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
}

export const tools: Tool[] = [
  {
    id: 'qr-generator',
    name: 'QR Code Generator',
    description: 'Generate QR codes from text or URLs',
    category: 'Image Tools',
    icon: 'QrCode',
  },
  {
    id: 'color-contrast',
    name: 'Color Contrast Checker',
    description: 'Check WCAG color contrast ratios',
    category: 'Web Tools',
    icon: 'Palette',
  },
  {
    id: 'jwt-decoder',
    name: 'JWT Decoder',
    description: 'Decode and inspect JWT tokens',
    category: 'Crypto Tools',
    icon: 'Key',
  },
  {
    id: 'url-encoder',
    name: 'URL Encoder',
    description: 'Encode and decode URLs',
    category: 'Text Tools',
    icon: 'Link',
  },
  {
    id: 'cron-calculator',
    name: 'Cron Calculator',
    description: 'Generate and validate cron expressions',
    category: 'Data Tools',
    icon: 'Clock',
  },
  {
    id: 'base64-encoder',
    name: 'Base64 Encoder',
    description: 'Encode and decode Base64 strings',
    category: 'Text Tools',
    icon: 'Binary',
  },
  {
    id: 'json-formatter',
    name: 'JSON Formatter',
    description: 'Format and validate JSON data',
    category: 'Data Tools',
    icon: 'Braces',
  },
  {
    id: 'uuid-generator',
    name: 'UUID Generator',
    description: 'Generate unique identifiers',
    category: 'Data Tools',
    icon: 'Fingerprint',
  },
];

export const categories = [
  'All',
  'Text Tools',
  'Image Tools',
  'Crypto Tools',
  'Data Tools',
  'Web Tools',
];
