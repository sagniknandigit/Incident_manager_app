import React from 'react';
import {
    Input as GSInput,
    InputField,
    FormControl,
    FormControlLabel,
    FormControlLabelText,
    FormControlError,
    FormControlErrorText,
} from '@gluestack-ui/themed';
import { useTheme } from '../../hooks/useTheme';

interface InputProps {
    label?: string;
    error?: string;
    placeholder?: string;
    value?: string;
    onChangeText?: (text: string) => void;
    secureTextEntry?: boolean;
    multiline?: boolean;
    numberOfLines?: number;
    style?: any;
    [key: string]: any;
}

export const Input: React.FC<InputProps> = ({
    label,
    error,
    placeholder,
    value,
    onChangeText,
    secureTextEntry,
    multiline,
    numberOfLines,
    style,
    ...props
}) => {
    const { colors, theme } = useTheme();

    return (
        <FormControl isInvalid={!!error} style={{ marginBottom: 20 }}>
            {label && (
                <FormControlLabel mb="$1">
                    <FormControlLabelText
                        fontSize="$xs"
                        fontWeight="$bold"
                        color={colors.textSecondary}
                        style={{ letterSpacing: 1 }}
                    >
                        {label.toUpperCase()}
                    </FormControlLabelText>
                </FormControlLabel>
            )}
            <GSInput
                variant="outline"
                size="lg"
                isDisabled={props.disabled}
                isReadOnly={props.readOnly}
                sx={{
                    borderRadius: theme.borderRadius.md,
                    minHeight: multiline ? 100 : 56,
                    borderColor: colors.border,
                    ':focus': {
                        borderColor: colors.primary,
                        borderWidth: 2,
                    },
                    ...style,
                }}
            >
                <InputField
                    placeholder={placeholder}
                    value={value}
                    onChangeText={onChangeText}
                    secureTextEntry={secureTextEntry}
                    multiline={multiline}
                    numberOfLines={numberOfLines}
                    placeholderTextColor={colors.placeholder}
                    color={colors.textPrimary}
                    sx={{
                        paddingHorizontal: 16,
                        textAlignVertical: multiline ? 'top' : 'center',
                    }}
                    {...props}
                />
            </GSInput>
            {error && (
                <FormControlError mt="$1">
                    <FormControlErrorText color={colors.error} fontWeight="$semibold">
                        {error}
                    </FormControlErrorText>
                </FormControlError>
            )}
        </FormControl>
    );
};
