import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Typography } from './Typography';
import { Button } from './Button';
import { useTheme } from '../../hooks/useTheme';

interface EmptyStateProps {
    title: string;
    description: string;
    icon?: string;
    actionLabel?: string;
    onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
    title,
    description,
    icon = '🔍',
    actionLabel,
    onAction
}) => {
    const { colors, theme } = useTheme();

    return (
        <View style={styles.container}>
            <View style={[styles.iconWrapper, { backgroundColor: colors.surfaceHighlight }]}>
                <Typography style={styles.icon}>{icon}</Typography>
            </View>
            <Typography variant="h2" align="center" style={styles.title}>
                {title}
            </Typography>
            <Typography variant="body" color={colors.textSecondary} align="center" style={styles.description}>
                {description}
            </Typography>
            {actionLabel && onAction && (
                <View style={styles.actionContainer}>
                    <Button
                        title={actionLabel}
                        onPress={onAction}
                        variant="primary"
                        fullWidth={false}
                        style={styles.button}
                    />
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
        paddingVertical: 60,
    },
    iconWrapper: {
        width: 100,
        height: 100,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    icon: {
        fontSize: 48,
    },
    title: {
        marginBottom: 8,
    },
    description: {
        lineHeight: 22,
        opacity: 0.7,
    },
    actionContainer: {
        marginTop: 32,
        width: '100%',
        alignItems: 'center',
    },
    button: {
        paddingHorizontal: 32,
        borderRadius: 16,
    }
});
