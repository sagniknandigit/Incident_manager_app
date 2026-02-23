import React, { useRef } from 'react';
import { StyleSheet, ActivityIndicator, ViewStyle, Animated, Pressable } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { Typography } from './Typography';

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
    disabled?: boolean;
    loading?: boolean;
    fullWidth?: boolean;
    style?: ViewStyle;
}

export const Button: React.FC<ButtonProps> = ({
    title,
    onPress,
    variant = 'primary',
    disabled = false,
    loading = false,
    fullWidth = true,
    style
}) => {
    const { theme, colors } = useTheme();
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const getBackgroundColor = () => {
        if (disabled) return colors.surfaceHighlight;
        switch (variant) {
            case 'primary': return colors.primary;
            case 'secondary': return colors.surfaceHighlight;
            case 'danger': return colors.error;
            case 'success': return colors.success;
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
            case 'success': return colors.textInverse;
            case 'ghost': return colors.primary;
            default: return colors.textInverse;
        }
    };

    const handlePressIn = () => {
        Animated.spring(scaleAnim, {
            toValue: 0.97,
            useNativeDriver: true,
            tension: 40,
            friction: 7,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            useNativeDriver: true,
            tension: 40,
            friction: 7,
        }).start();
    };

    return (
        <Animated.View style={[{ transform: [{ scale: scaleAnim }], width: fullWidth ? '100%' : 'auto' }]}>
            <Pressable
                style={({ pressed }) => [
                    styles.container,
                    {
                        backgroundColor: getBackgroundColor(),
                        borderRadius: theme.borderRadius.lg,
                        paddingHorizontal: theme.spacing.xl,
                        opacity: (disabled || loading) ? 0.6 : (pressed ? 0.9 : 1),
                    },
                    variant === 'primary' && theme.shadows.sm,
                    variant === 'secondary' && { borderWidth: 1, borderColor: colors.border },
                    style,
                ]}
                onPress={onPress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                disabled={disabled || loading}
            >
                {loading ? (
                    <ActivityIndicator color={getTextColor()} />
                ) : (
                    <Typography
                        variant="button"
                        color={getTextColor()}
                        style={styles.text}
                    >
                        {title}
                    </Typography>
                )}
            </Pressable>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 52,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 4,
    },
    text: {
        letterSpacing: 1.25,
        fontWeight: '700',
    }
});
