import React from 'react';
import { Heading, Text } from '@gluestack-ui/themed';
import { useTheme } from '../../hooks/useTheme';

interface TypographyProps {
    variant?: 'h1' | 'h2' | 'h3' | 'subtitle' | 'body' | 'caption' | 'button';
    color?: string;
    align?: 'auto' | 'left' | 'right' | 'center' | 'justify';
    style?: any;
    children?: React.ReactNode;
    numberOfLines?: number;
    ellipsizeMode?: 'head' | 'middle' | 'tail' | 'clip';
}

export const Typography: React.FC<TypographyProps> = ({
    children,
    variant = 'body',
    color,
    align = 'left',
    style,
    ...props
}) => {
    const { colors } = useTheme();

    const isHeading = ['h1', 'h2', 'h3'].includes(variant);
    const Component = isHeading ? Heading : Text;

    // Mapping variants to Gluestack sizes
    const sizeMap: Record<string, any> = {
        h1: '2xl',
        h2: 'xl',
        h3: 'lg',
        subtitle: 'md',
        body: 'sm',
        caption: 'xs',
    };

    return (
        <Component
            size={sizeMap[variant]}
            color={color || colors.textPrimary}
            textAlign={align}
            sx={{
                _dark: {
                    color: color || colors.textPrimary,
                },
                ...style,
            }}
            {...(props as any)}
        >
            {children}
        </Component>
    );
};
