import React from 'react';
import { TextInput, StyleSheet, View, TextInputProps } from 'react-native';
import { theme } from '../../theme/theme';
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

    return (
        <View style={styles.container}>
            {label && (
                <Typography
                    variant="caption"
                    color={isFocused ? theme.colors.primary : theme.colors.textSecondary}
                    style={styles.label}
                >
                    {label}
                </Typography>
            )}
            <View style={[
                styles.inputContainer,
                isFocused && styles.inputFocused,
                !!error && styles.inputError
            ]}>
                <TextInput
                    style={[styles.input, style]}
                    placeholderTextColor={theme.colors.placeholder}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    selectionColor={theme.colors.primary}
                    {...props}
                />
            </View>
            {error && (
                <Typography
                    variant="caption"
                    color={theme.colors.error}
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
        marginBottom: theme.spacing.md,
    },
    label: {
        marginBottom: theme.spacing.xs,
        marginLeft: theme.spacing.xs,
        fontWeight: '600',
    },
    inputContainer: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.lg,
        borderWidth: 1.5,
        borderColor: theme.colors.border,
        ...theme.shadows.sm,
    },
    input: {
        color: theme.colors.textPrimary,
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.md, // Increased padding
        fontSize: 16,
        height: 54, // Fixed height for consistency
    },
    inputFocused: {
        borderColor: theme.colors.primary,
        backgroundColor: theme.colors.surfaceHighlight, // Subtle highlight on focus
        ...theme.shadows.md,
    },
    inputError: {
        borderColor: theme.colors.error,
    },
    error: {
        marginTop: theme.spacing.xs,
        marginLeft: theme.spacing.xs,
    },
});
