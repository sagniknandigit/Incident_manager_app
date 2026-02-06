export const theme = {
    colors: {
        // Brand
        primary: '#6366f1', // Indigo 500
        primaryDark: '#4f46e5', // Indigo 600
        secondary: '#10b981', // Emerald 500

        // Backgrounds
        background: '#0f172a', // Slate 900
        surface: '#1e293b', // Slate 800
        surfaceHighlight: '#334155', // Slate 700

        // Text
        textPrimary: '#f8fafc', // Slate 50
        textSecondary: '#94a3b8', // Slate 400
        textInverse: '#ffffff',

        // Status
        success: '#22c55e', // Green 500
        error: '#ef4444', // Red 500
        warning: '#f59e0b', // Amber 500
        info: '#3b82f6', // Blue 500

        // UI
        border: '#334155', // Slate 700
        placeholder: '#64748b', // Slate 500
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
        sm: 4,
        md: 8,
        lg: 12,
        xl: 20,
        round: 9999,
    },
    typography: {
        h1: { fontSize: 32, fontWeight: '700', lineHeight: 40 },
        h2: { fontSize: 24, fontWeight: '600', lineHeight: 32 },
        h3: { fontSize: 20, fontWeight: '600', lineHeight: 28 },
        body: { fontSize: 16, fontWeight: '400', lineHeight: 24 },
        caption: { fontSize: 14, fontWeight: '400', lineHeight: 20 },
        button: { fontSize: 16, fontWeight: '600', lineHeight: 24 },
    },
    shadows: {
        sm: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.18,
            shadowRadius: 1.0,
            elevation: 1,
        },
        md: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
        },
    },
} as const;
