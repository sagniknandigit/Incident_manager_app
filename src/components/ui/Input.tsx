import React from 'react';
import { TextInput, StyleSheet, View, TextInputProps } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { Typography } from './Typography';
import { useState } from 'react';

interface InputProps extends TextInputProps {
    label?: string;
    error?: string;
}

export const Input: React.FC<InputProps> = ({
    label,
    error,
    style,
    ...props
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const { colors, theme } = useTheme();

    return (
        <View style={styles.container}>
            {label && (
                <Typography
                    variant="caption"
                    color={isFocused ? colors.primary : colors.textSecondary}
                    style={styles.label}
                >
                    {label}
                </Typography>
            )}
            <View style={[
                styles.inputContainer,
                {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                    borderRadius: theme.borderRadius.lg,
                },
                isFocused && { borderColor: colors.primary, backgroundColor: colors.surfaceHighlight },
                !!error && { borderColor: colors.error }
            ]}>
                <TextInput
                    style={[
                        styles.input,
                        { color: colors.textPrimary },
                        style
                    ]}
                    placeholderTextColor={colors.placeholder}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    selectionColor={colors.primary}
                    {...props}
                />
            </View>
            {error && (
                <Typography
                    variant="caption"
                    color={colors.error}
                    style={styles.error}
                >
                    {error}
                </Typography>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    label: {
        marginBottom: 4,
        marginLeft: 4,
        fontWeight: '600',
    },
    inputContainer: {
        borderWidth: 1.5,
    },
    input: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 16,
        height: 54,
    },
    error: {
        marginTop: 4,
        marginLeft: 4,
    },
});
