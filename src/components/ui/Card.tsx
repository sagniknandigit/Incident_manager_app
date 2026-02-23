import React from 'react';
import { View, StyleSheet, ViewStyle, TouchableOpacity } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

interface CardProps {
    children: React.ReactNode;
    style?: ViewStyle;
    variant?: 'elevated' | 'outlined' | 'flat' | 'glass';
    padding?: 'none' | 'sm' | 'md' | 'lg';
    onPress?: () => void;
}

export const Card: React.FC<CardProps> = ({
    children,
    style,
    variant = 'elevated',
    padding = 'md',
    onPress
}) => {
    const { theme, colors } = useTheme();

    const getPadding = () => {
        switch (padding) {
            case 'none': return 0;
            case 'sm': return theme.spacing.sm;
            case 'md': return theme.spacing.md;
            case 'lg': return theme.spacing.lg;
            default: return theme.spacing.md;
        }
    };

    const CardContent = (
        <View style={[
            styles.container,
            {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                padding: getPadding(),
                borderRadius: theme.borderRadius.lg,
            },
            variant === 'elevated' && {
                ...theme.shadows.md,
                borderWidth: 0,
            },
            variant === 'outlined' && {
                backgroundColor: 'transparent',
                borderWidth: 1,
                borderColor: colors.border,
            },
            variant === 'flat' && {
                backgroundColor: colors.surfaceHighlight,
                borderWidth: 0,
            },
            variant === 'glass' && {
                backgroundColor: colors.surface + '80', // Transparent overlay
                borderWidth: 1,
                borderColor: colors.surfaceHighlight,
            },
            style
        ]}>
            {children}
        </View>
    );

    if (onPress) {
        return (
            <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={{ borderRadius: theme.borderRadius.lg }}>
                {CardContent}
            </TouchableOpacity>
        );
    }

    return CardContent;
};

const styles = StyleSheet.create({
    container: {
        overflow: 'hidden',
    }
});
