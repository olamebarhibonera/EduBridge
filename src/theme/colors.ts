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
    bgSecondary: '#fdf2f8',
    textPrimary: '#111827',
    textSecondary: '#4b5563',
    textTertiary: '#9ca3af',
    border: '#fce7f3',
    accent: '#ec4899',
    accentHover: '#db2777',
    card: '#ffffff',
  },
  dark: {
    bgPrimary: '#0f0f13',
    bgSecondary: '#18181b',
    textPrimary: '#fafafa',
    textSecondary: '#d4d4d8',
    textTertiary: '#a1a1aa',
    border: '#27272a',
    accent: '#f472b6',
    accentHover: '#f9a8d4',
    card: '#18181b',
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
