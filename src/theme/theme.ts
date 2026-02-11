export const theme = {
    colors: {
        // Brand - Vibrant & Premium
        primary: '#6366f1', // Indigo 500 - Main action color
        primaryDark: '#4338ca', // Indigo 700 - Pressed states
        primaryLight: '#818cf8', // Indigo 400 - Accents
        secondary: '#06b6d4', // Cyan 500 - Secondary actions
        accent: '#f472b6', // Pink 400 - Highlights

        // Backgrounds - Deep & Rich
        background: '#0f172a', // Slate 900 - Main background
        surface: '#1e293b', // Slate 800 - Card background
        surfaceHighlight: '#334155', // Slate 700 - Hover/Pressed items
        modal: '#1e293b',

        // Text - High Contrast
        textPrimary: '#f8fafc', // Slate 50 - Title text
        textSecondary: '#94a3b8', // Slate 400 - Body/Label text
        textInverse: '#ffffff', // Text on primary buttons
        textDisabled: '#475569', // Slate 600

        // Status
        success: '#10b981', // Emerald 500
        error: '#ef4444', // Red 500
        warning: '#f59e0b', // Amber 500
        info: '#3b82f6', // Blue 500

        // UI Elements
        border: '#334155', // Slate 700
        placeholder: '#64748b', // Slate 500
        backdrop: 'rgba(0, 0, 0, 0.5)',
    },
    spacing: {
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32,
        xxl: 48,
    },
    borderRadius: {
        sm: 6,
        md: 12,
        lg: 16,
        xl: 24,
        round: 9999,
    },
    typography: {
        h1: { fontSize: 32, fontWeight: '800', lineHeight: 40, letterSpacing: -0.5 },
        h2: { fontSize: 24, fontWeight: '700', lineHeight: 32, letterSpacing: -0.25 },
        h3: { fontSize: 20, fontWeight: '600', lineHeight: 28 },
        subtitle: { fontSize: 18, fontWeight: '500', lineHeight: 26 },
        body: { fontSize: 16, fontWeight: '400', lineHeight: 24 },
        caption: { fontSize: 14, fontWeight: '400', lineHeight: 20 },
        button: { fontSize: 16, fontWeight: '600', lineHeight: 24, letterSpacing: 0.5 },
    },
    shadows: {
        none: {
            shadowColor: 'transparent',
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0,
            shadowRadius: 0,
            elevation: 0,
        },
        sm: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.2,
            shadowRadius: 1.41,
            elevation: 2,
        },
        md: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
        },
        lg: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.30,
            shadowRadius: 4.65,
            elevation: 8,
        },
    },
} as const;
