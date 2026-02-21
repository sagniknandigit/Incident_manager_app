import React from 'react';
import { Text, TextProps, TextStyle } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

interface TypographyProps extends TextProps {
    variant?: 'h1' | 'h2' | 'h3' | 'subtitle' | 'body' | 'caption' | 'button';
    color?: string;
    align?: 'auto' | 'left' | 'right' | 'center' | 'justify';
}

export const Typography: React.FC<TypographyProps> = ({
    children,
    variant = 'body',
    color,
    align = 'left',
    style,
    ...props
}) => {
    const { theme, colors } = useTheme();

    const textStyle = {
        ...(theme.typography[variant] as any),
        color: color || colors.textPrimary,
        textAlign: align,
    } as TextStyle;

    return (
        <Text style={[textStyle, style]} {...props}>
            {children}
        </Text>
    );
};
