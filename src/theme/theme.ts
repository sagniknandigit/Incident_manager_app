const common = {
    spacing: {
        none: 0,
        xxs: 2,
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32,
        xxl: 48,
        xxxl: 64,
    },
    borderRadius: {
        none: 0,
        xs: 4,
        sm: 8,
        md: 12,
        lg: 20,
        xl: 28,
        round: 9999,
    },
    typography: {
        h1: { fontSize: 34, fontWeight: '800', lineHeight: 42, letterSpacing: -1 },
        h2: { fontSize: 26, fontWeight: '700', lineHeight: 34, letterSpacing: -0.5 },
        h3: { fontSize: 20, fontWeight: '600', lineHeight: 28, letterSpacing: -0.25 },
        subtitle: { fontSize: 18, fontWeight: '500', lineHeight: 26 },
        body: { fontSize: 16, fontWeight: '400', lineHeight: 24 },
        caption: { fontSize: 13, fontWeight: '500', lineHeight: 18, letterSpacing: 0.2 },
        button: { fontSize: 15, fontWeight: '700', lineHeight: 22, letterSpacing: 1 },
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
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 4,
            elevation: 2,
        },
        md: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 12,
            elevation: 5,
        },
        lg: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.15,
            shadowRadius: 24,
            elevation: 10,
        },
    },
};

export const lightTheme = {
    ...common,
    colors: {
        primary: '#4F46E5', // Indigo 600
        primaryDark: '#3730A3', // Indigo 800
        primaryLight: '#818CF8', // Indigo 400
        secondary: '#0EA5E9', // Sky 600
        accent: '#F43F5E', // Rose 500
        background: '#F1F5F9', // Slate 100
        surface: '#FFFFFF',
        surfaceHighlight: '#F8FAFC', // Slate 50
        modal: '#FFFFFF',
        textPrimary: '#0F172A', // Slate 900
        textSecondary: '#475569', // Slate 600
        textInverse: '#FFFFFF',
        textDisabled: '#94A3B8', // Slate 400
        success: '#10B981',
        successLight: '#D1FAE5',
        error: '#EF4444',
        errorLight: '#FEE2E2',
        warning: '#F59E0B',
        warningLight: '#FEF3C7',
        info: '#3B82F6',
        infoLight: '#DBEAFE',
        border: '#E2E8F0', // Slate 200
        placeholder: '#94A3B8',
        backdrop: 'rgba(15, 23, 42, 0.4)',
    },
};

export const darkTheme = {
    ...common,
    colors: {
        primary: '#6366F1', // Indigo 500
        primaryDark: '#4F46E5',
        primaryLight: '#A5B4FC',
        secondary: '#38BDF8', // Sky 400
        accent: '#FB7185', // Rose 400
        background: '#0F172A', // Slate 900
        surface: '#1E293B', // Slate 800
        surfaceHighlight: '#334155', // Slate 700
        modal: '#1E293B',
        textPrimary: '#F8FAFC', // Slate 50
        textSecondary: '#94A3B8', // Slate 400
        textInverse: '#FFFFFF',
        textDisabled: '#475569', // Slate 600
        success: '#34D399',
        successLight: 'rgba(52, 211, 153, 0.1)',
        error: '#F87171',
        errorLight: 'rgba(248, 113, 113, 0.1)',
        warning: '#FBBF24',
        warningLight: 'rgba(251, 191, 36, 0.1)',
        info: '#60A5FA',
        infoLight: 'rgba(96, 165, 250, 0.1)',
        border: '#334155', // Slate 700
        placeholder: '#64748B',
        backdrop: 'rgba(0, 0, 0, 0.7)',
    },
};

export const theme = darkTheme;
