import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Typography } from './Typography';
import { useTheme } from '../../hooks/useTheme';

export type IncidentStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';

interface IncidentStatusBadgeProps {
    status: IncidentStatus | string;
    style?: ViewStyle;
}

export const IncidentStatusBadge: React.FC<IncidentStatusBadgeProps> = ({ status, style }) => {
    const { colors, theme } = useTheme();

    const getStatusConfig = (s: string) => {
        switch (s) {
            case 'OPEN':
                return { color: colors.error, label: 'OPEN' };
            case 'IN_PROGRESS':
                return { color: colors.warning, label: 'IN PROGRESS' };
            case 'RESOLVED':
                return { color: colors.success, label: 'RESOLVED' };
            case 'CLOSED':
                return { color: colors.textDisabled, label: 'CLOSED' };
            default:
                return { color: colors.textSecondary, label: s };
        }
    };

    const config = getStatusConfig(status);

    return (
        <View style={[
            styles.badge,
            { backgroundColor: config.color + '20', borderColor: config.color + '50' },
            style
        ]}>
            <Typography
                variant="caption"
                style={{ color: config.color, fontWeight: '700', fontSize: 11, letterSpacing: 0.5 }}
            >
                {config.label}
            </Typography>
        </View>
    );
};

const styles = StyleSheet.create({
    badge: {
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 4,
        borderWidth: 1,
        alignSelf: 'flex-start',
    },
});
