import React from 'react';
import { TouchableOpacity, StyleSheet, ActivityIndicator, ViewStyle } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
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
    const { theme, colors } = useTheme();

    const getBackgroundColor = () => {
        if (disabled) return colors.surfaceHighlight;
        switch (variant) {
            case 'primary': return colors.primary;
            case 'secondary': return colors.surfaceHighlight;
            case 'danger': return colors.error;
            case 'ghost': return 'transparent';
            default: return colors.primary;
        }
    };

    const getTextColor = () => {
        if (disabled) return colors.textDisabled;
        switch (variant) {
            case 'primary': return colors.textInverse;
            case 'secondary': return colors.textPrimary;
            case 'danger': return colors.textInverse;
            case 'ghost': return colors.primary;
            default: return colors.textInverse;
        }
    };

    return (
        <TouchableOpacity
            style={[
                styles.container,
                {
                    backgroundColor: getBackgroundColor(),
                    borderRadius: theme.borderRadius.xl,
                    paddingHorizontal: theme.spacing.lg,
                    ...theme.shadows.md
                },
                variant === 'ghost' && { borderWidth: 0, shadowOpacity: 0 },
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
        height: 56,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 4,
    },
});
