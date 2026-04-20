colors_ts = '''export const colors = {
// Primary colors
primary: '#FF6B35',
primaryDark: '#E85A2B',
primaryLight: '#FF8F6B',

// Secondary colors
secondary: '#4ECDC4',
secondaryDark: '#3DBDB5',

// Background colors
background: '#0A0A0A',
backgroundLight: '#141414',
backgroundLighter: '#1E1E1E',

// Surface colors
surface: '#252525',
surfaceLight: '#2D2D2D',

// Text colors
text: '#FFFFFF',
textSecondary: '#B0B0B0',
textMuted: '#6B7280',

// Accent colors
accent: '#FFD93D',
success: '#22C55E',
error: '#EF4444',
warning: '#F59E0B',
info: '#3B82F6',

// Gradient colors
gradient: {
start: '#FF6B35',
end: '#FF8F6B',
},

// Glassmorphism
glass: {
background: 'rgba(255, 255, 255, 0.05)',
border: 'rgba(255, 255, 255, 0.1)',
},

// Neon glows
glow: {
primary: 'rgba(255, 107, 53, 0.5)',
success: 'rgba(34, 197, 94, 0.5)',
error: 'rgba(239, 68, 68, 0.5)',
},
};

export const gradients = {
primary: ['#FF6B35', '#FF8F6B'],
secondary: ['#4ECDC4', '#44A08D'],
dark: ['#0A0A0A', '#141414'],
glass: ['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)'],
success: ['#22C55E', '#16A34A'],
warning: ['#F59E0B', '#D97706'],
};

export const shadows = {
small: {
shadowColor: '#000',
shadowOffset: { width: 0, height: 2 },
shadowOpacity: 0.25,
shadowRadius: 3.84,
elevation: 5,
},
medium: {
shadowColor: '#000',
shadowOffset: { width: 0, height: 4 },
shadowOpacity: 0.3,
shadowRadius: 4.65,
elevation: 8,
},
large: {
shadowColor: colors.primary,
shadowOffset: { width: 0, height: 0 },
shadowOpacity: 0.4,
shadowRadius: 10,
elevation: 10,
},
glow: {
shadowColor: colors.primary,
shadowOffset: { width: 0, height: 0 },
shadowOpacity: 0.6,
shadowRadius: 15,
elevation: 15,
},
};

export const spacing = {
xs: 4,
sm: 8,
md: 16,
lg: 24,
xl: 32,
xxl: 48,
};

export const borderRadius = {
sm: 8,
md: 12,
lg: 16,
xl: 24,
full: 9999,
};
'''

with open("/mnt/kimi/output/foodflow-ecosystem/customer-app/src/constants/colors.ts", "w") as f:
f.write(colors_ts)
