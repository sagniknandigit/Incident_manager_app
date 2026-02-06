import React from 'react';
import { View, StyleSheet, ViewStyle, TouchableOpacity } from 'react-native';
import { theme } from '../../theme/theme';

interface CardProps {
    children: React.ReactNode;
    style?: ViewStyle;
    onPress?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, style, onPress }) => {
    const Container = onPress ? TouchableOpacity : View;

    return (
        <Container
            style={[styles.container, style]}
            activeOpacity={onPress ? 0.7 : 1}
            onPress={onPress}
        >
            {children}
        </Container>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.lg,
        ...theme.shadows.sm,
    },
});
