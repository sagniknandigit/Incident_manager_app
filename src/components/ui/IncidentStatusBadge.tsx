import React from 'react';
import { Badge, BadgeText, Box } from '@gluestack-ui/themed';
import { useTheme } from '../../hooks/useTheme';

export type IncidentStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';

interface IncidentStatusBadgeProps {
    status: IncidentStatus | string;
    style?: any;
}

export const IncidentStatusBadge: React.FC<IncidentStatusBadgeProps> = ({ status, style }) => {
    const { colors } = useTheme();

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
        <Badge
            sx={{
                backgroundColor: config.bg,
                borderColor: config.color + '20',
                borderRadius: '$full',
                borderWidth: 1,
                paddingHorizontal: 10,
                paddingVertical: 4,
                flexDirection: 'row',
                alignItems: 'center',
                ...style,
            }}
        >
            <Box
                sx={{
                    width: 6,
                    height: 6,
                    borderRadius: '$full',
                    backgroundColor: config.color,
                    marginRight: 6,
                }}
            />
            <BadgeText
                sx={{
                    color: config.color,
                    fontWeight: '$bold',
                    fontSize: 10,
                    textTransform: 'uppercase',
                    letterSpacing: '$md',
                }}
            >
                {config.label}
            </BadgeText>
        </Badge>
    );
};
