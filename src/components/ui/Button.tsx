import React from 'react';
import { TouchableOpacity, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
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
        if (disabled) return theme.colors.textSecondary;
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
                style,
            ]}
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.8}
        >
            {loading ? (
                <ActivityIndicator color={getTextColor()} />
            ) : (
                <Typography
                    variant="button"
                    color={getTextColor()}
                >
                    {title}
                </Typography>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 48,
        borderRadius: theme.borderRadius.lg,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.lg,
        ...theme.shadows.sm
    },
});
