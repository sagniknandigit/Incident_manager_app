import React from 'react';
import { TextInput, StyleSheet, View, TextInputProps } from 'react-native';
import { theme } from '../../theme/theme';
import { Typography } from './Typography';

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
    return (
        <View style={styles.container}>
            {label && (
                <Typography
                    variant="caption"
                    color={theme.colors.textSecondary}
                    style={styles.label}
                >
                    {label}
                </Typography>
            )}
            <TextInput
                style={[
                    styles.input,
                    error ? styles.inputError : null,
                    style
                ]}
                placeholderTextColor={theme.colors.placeholder}
                {...props}
            />
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
    },
    input: {
        backgroundColor: theme.colors.surface,
        color: theme.colors.textPrimary,
        borderRadius: theme.borderRadius.lg,
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.md,
        fontSize: 16,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    inputError: {
        borderColor: theme.colors.error,
    },
    error: {
        marginTop: theme.spacing.xs,
        marginLeft: theme.spacing.xs,
    },
});
