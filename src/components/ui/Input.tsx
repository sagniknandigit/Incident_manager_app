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
                    {label.toUpperCase()}
                </Typography>
            )}
            <View style={[
                styles.inputContainer,
                {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                    borderRadius: theme.borderRadius.md,
                },
                isFocused && {
                    borderColor: colors.primary,
                    backgroundColor: colors.surfaceHighlight,
                    borderWidth: 2,
                },
                !!error && { borderColor: colors.error, borderWidth: 2 }
            ]}>
                <TextInput
                    style={[
                        styles.input,
                        {
                            color: colors.textPrimary,
                            paddingTop: isFocused || props.value ? 10 : 0,
                        },
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
                    style={styles.errorText}
                >
                    {error}
                </Typography>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
    },
    label: {
        marginBottom: 8,
        marginLeft: 2,
        fontWeight: '700',
        letterSpacing: 1,
        fontSize: 11,
    },
    inputContainer: {
        borderWidth: 1.5,
        minHeight: 56,
        justifyContent: 'center',
    },
    input: {
        paddingHorizontal: 16,
        fontSize: 16,
        fontWeight: '500',
    },
    errorText: {
        marginTop: 6,
        marginLeft: 4,
        fontWeight: '600',
    },
});
