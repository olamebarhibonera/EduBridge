export type ThemeId = 'light' | 'dark' | 'chocolate' | 'pink';

export const themeColors: Record<
  ThemeId,
  {
    bgPrimary: string;
    bgSecondary: string;
    textPrimary: string;
    textSecondary: string;
    textTertiary: string;
    border: string;
    accent: string;
    accentHover: string;
    card: string;
  }
> = {
  light: {
    bgPrimary: '#ffffff',
    bgSecondary: '#f9fafb',
    textPrimary: '#111827',
    textSecondary: '#4b5563',
    textTertiary: '#9ca3af',
    border: '#e5e7eb',
    accent: '#8b5cf6',
    accentHover: '#7c3aed',
    card: '#ffffff',
  },
  dark: {
    bgPrimary: '#111827',
    bgSecondary: '#1f2937',
    textPrimary: '#f3f4f6',
    textSecondary: '#d1d5db',
    textTertiary: '#9ca3af',
    border: '#374151',
    accent: '#60a5fa',
    accentHover: '#93c5fd',
    card: '#1f2937',
  },
  chocolate: {
    bgPrimary: '#443329',
    bgSecondary: '#573e2d',
    textPrimary: '#fffaf0',
    textSecondary: '#ffebcd',
    textTertiary: '#d2b48c',
    border: '#785438',
    accent: '#f59e0b',
    accentHover: '#d97706',
    card: '#573e2d',
  },
  pink: {
    bgPrimary: '#fdf2f8',
    bgSecondary: '#fce7f3',
    textPrimary: '#831843',
    textSecondary: '#9f1239',
    textTertiary: '#be185d',
    border: '#fbcfe8',
    accent: '#ec4899',
    accentHover: '#db2777',
    card: '#ffffff',
  },
};
