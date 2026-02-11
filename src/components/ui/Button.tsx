// Button.js
import React from 'react';
import { TouchableOpacity, StyleSheet, ActivityIndicator, ViewStyle, TextStyle, View } from 'react-native';
import { theme } from '../../theme/theme';
import { Typography } from './Typography';

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
    disabled?: boolean;
    loading?: boolean;
    style?: ViewStyle;
}

export const Button: React.FC<ButtonProps> = ({
    title,
    onPress,
    variant = 'primary',
    disabled = false,
    loading = false,
    style
}) => {
    const getBackgroundColor = () => {
        if (disabled) return theme.colors.surfaceHighlight;
        switch (variant) {
            case 'primary': return theme.colors.primary;
            case 'secondary': return theme.colors.surfaceHighlight;
            case 'danger': return theme.colors.error;
            case 'ghost': return 'transparent';
            default: return theme.colors.primary;
        }
    };

    const getTextColor = () => {
        if (disabled) return theme.colors.textDisabled;
        switch (variant) {
            case 'primary': return theme.colors.textInverse;
            case 'secondary': return theme.colors.textPrimary;
            case 'danger': return theme.colors.textInverse;
            case 'ghost': return theme.colors.primary;
            default: return theme.colors.textInverse;
        }
    };

    return (
        <TouchableOpacity
            style={[
                styles.container,
                { backgroundColor: getBackgroundColor() },
                variant === 'ghost' && { borderWidth: 0, shadowOpacity: 0 }, // No shadow for ghost
                style,
            ]}
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.7}
        >
            {loading ? (
                <ActivityIndicator color={getTextColor()} />
            ) : (
                <Typography
                    variant="button"
                    color={getTextColor()}
                    style={{ textTransform: variant === 'ghost' ? 'none' : 'uppercase' }}
                >
                    {title}
                </Typography>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 56, // Taller touch target
        borderRadius: theme.borderRadius.xl, // Pill shape or very rounded
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.lg,
        ...theme.shadows.md,
        marginVertical: theme.spacing.xs,
    },
});
