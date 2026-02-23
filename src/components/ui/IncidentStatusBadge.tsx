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
                return { color: colors.error, bg: colors.errorLight, label: 'OPEN' };
            case 'IN_PROGRESS':
                return { color: colors.warning, bg: colors.warningLight, label: 'IN PROGRESS' };
            case 'RESOLVED':
                return { color: colors.success, bg: colors.successLight, label: 'RESOLVED' };
            case 'CLOSED':
                return { color: colors.textDisabled, bg: colors.surfaceHighlight, label: 'CLOSED' };
            default:
                return { color: colors.textSecondary, bg: colors.surfaceHighlight, label: s };
        }
    };

    const config = getStatusConfig(status);

    return (
        <View style={[
            styles.badge,
            { backgroundColor: config.bg, borderColor: config.color + '20' },
            style
        ]}>
            <View style={[styles.dot, { backgroundColor: config.color }]} />
            <Typography
                variant="caption"
                style={{ color: config.color, fontWeight: '800', fontSize: 10, letterSpacing: 0.8 }}
            >
                {config.label}
            </Typography>
        </View>
    );
};

const styles = StyleSheet.create({
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 12,
        borderWidth: 1,
        alignSelf: 'flex-start',
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        marginRight: 6,
    }
});
