import React from 'react';
import { Text, TextProps, StyleSheet, TextStyle } from 'react-native';
import { theme } from '../../theme/theme';

interface TypographyProps extends TextProps {
    variant?: 'h1' | 'h2' | 'h3' | 'subtitle' | 'body' | 'caption' | 'button';
    color?: string;
    align?: 'auto' | 'left' | 'right' | 'center' | 'justify';
}

export const Typography: React.FC<TypographyProps> = ({
    children,
    variant = 'body',
    color = theme.colors.textPrimary,
    align = 'left',
    style,
    ...props
}) => {
    const textStyle: TextStyle = {
        ...theme.typography[variant],
        color,
        textAlign: align,
    };

    return (
        <Text style={[textStyle, style]} {...props}>
            {children}
        </Text>
    );
};
