import React, { useRef } from 'react';
import { Animated, ViewStyle } from 'react-native';
import {
    Button as GSButton,
    ButtonText,
    ButtonSpinner,
} from '@gluestack-ui/themed';
import { useTheme } from '../../hooks/useTheme';

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
    disabled?: boolean;
    loading?: boolean;
    fullWidth?: boolean;
    style?: any;
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
    const { colors, theme } = useTheme();
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const actionMap: Record<string, "primary" | "secondary" | "positive" | "negative" | "default"> = {
        primary: 'primary',
        secondary: 'secondary',
        success: 'positive',
        danger: 'negative',
        ghost: 'default',
    };

    const gsVariant: "solid" | "outline" | "link" = (variant === 'secondary') ? 'outline' : (variant === 'ghost' ? 'link' : 'solid');

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
            <GSButton
                size={"lg" as any}
                variant={gsVariant}
                action={actionMap[variant]}
                isDisabled={disabled || loading}
                onPress={onPress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                sx={{
                    borderRadius: theme.borderRadius.lg,
                    height: 52,
                    marginVertical: 4,
                    width: '100%',
                    ...style,
                    ':active': {
                        opacity: 0.8,
                    },
                }}
            >
                {loading ? (
                    <ButtonSpinner color={colors.textInverse} />
                ) : (
                    <ButtonText fontWeight="$bold" style={{ letterSpacing: 1.25 }}>
                        {title}
                    </ButtonText>
                )}
            </GSButton>
        </Animated.View>
    );
};
