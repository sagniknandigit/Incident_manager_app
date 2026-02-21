import React from 'react';
import { View, StyleSheet, ViewStyle, TouchableOpacity } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

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
    const { theme, colors } = useTheme();

    const CardContent = (
        <View style={[
            styles.container,
            {
                backgroundColor: colors.surface,
                borderColor: colors.surfaceHighlight
            },
            variant === 'elevated' && { ...theme.shadows.md },
            variant === 'outlined' && {
                backgroundColor: 'transparent',
                borderColor: colors.border,
            },
            variant === 'flat' && {
                backgroundColor: colors.surfaceHighlight,
                borderWidth: 0,
            },
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
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
    }
});
