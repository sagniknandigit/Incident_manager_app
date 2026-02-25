import React from 'react';
import { Box, Pressable } from '@gluestack-ui/themed';
import { useTheme } from '../../hooks/useTheme';

interface CardProps {
    children: React.ReactNode;
    style?: any;
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

    const paddingMap: Record<string, string> = {
        none: '$0',
        sm: '$2',
        md: '$4',
        lg: '$6',
    };

    const variantStyles: any = {
        elevated: {
            backgroundColor: colors.surface,
            ...theme.shadows.md,
            borderWidth: 0,
        },
        outlined: {
            backgroundColor: 'transparent',
            borderWidth: 1,
            borderColor: colors.border,
        },
        flat: {
            backgroundColor: colors.surfaceHighlight,
            borderWidth: 0,
        },
        glass: {
            backgroundColor: colors.surface + '80',
            borderWidth: 1,
            borderColor: colors.surfaceHighlight,
        },
    };

    const CardContent = (
        <Box
            p={paddingMap[padding] as any}
            borderRadius={theme.borderRadius.lg}
            sx={{
                ...variantStyles[variant],
                overflow: 'hidden',
                ...style,
            }}
        >
            {children}
        </Box>
    );

    if (onPress) {
        return (
            <Pressable
                onPress={onPress}
                sx={{
                    borderRadius: theme.borderRadius.lg,
                    ':active': {
                        opacity: 0.9,
                        transform: [{ scale: 0.99 }],
                    },
                }}
            >
                {CardContent}
            </Pressable>
        );
    }

    return CardContent;
};
