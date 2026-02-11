import React from 'react';
import { View, StyleSheet, ViewStyle, TouchableOpacity } from 'react-native';
import { theme } from '../../theme/theme';

interface CardProps {
    children: React.ReactNode;
    style?: ViewStyle;
    variant?: 'elevated' | 'outlined' | 'flat';
    onPress?: () => void;
}

export const Card: React.FC<CardProps> = ({
    children,
    style,
    variant = 'elevated',
    onPress
}) => {
    const CardContent = (
        <View style={[
            styles.container,
            variant === 'elevated' && styles.elevated,
            variant === 'outlined' && styles.outlined,
            variant === 'flat' && styles.flat,
            style
        ]}>
            {children}
        </View>
    );

    if (onPress) {
        return (
            <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
                {CardContent}
            </TouchableOpacity>
        );
    }

    return CardContent;
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.xl,
        padding: theme.spacing.lg,
        borderWidth: 1,
        borderColor: theme.colors.surfaceHighlight, // Subtle border even for elevated
    },
    elevated: {
        ...theme.shadows.md,
    },
    outlined: {
        backgroundColor: 'transparent',
        borderColor: theme.colors.border,
        borderWidth: 1,
    },
    flat: {
        backgroundColor: theme.colors.surfaceHighlight,
        borderWidth: 0,
    }
});
