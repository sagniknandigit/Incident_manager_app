import React from 'react';
import { Card } from '../../components/ui/Card';
import { Typography } from '../../components/ui/Typography';
import { IncidentStatusBadge } from '../../components/ui/IncidentStatusBadge';
import { useTheme } from '../../hooks/useTheme';
import { VStack, HStack, Box } from '@gluestack-ui/themed';

interface Props {
    title: string;
    priority: string;
    status: string;
    reporter: string;
    onPress: () => void;
}

export default function IncidentCard({ title, priority, status, reporter, onPress }: Props) {
    const { colors } = useTheme();

    return (
        <Card
            variant="elevated"
            onPress={onPress}
            padding="md"
            style={{ marginBottom: 12, borderRadius: 16 }}
        >
            <VStack sx={{ gap: '$2' }}>
                <HStack sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h3" color={colors.textPrimary} style={{ flex: 1 }}>{title}</Typography>
                    <IncidentStatusBadge status={status} />
                </HStack>

                <Typography variant="caption" color={colors.textSecondary}>
                    Reporter: {reporter}
                </Typography>

                <HStack sx={{ justifyContent: 'space-between', alignItems: 'center', mt: '$1' }}>
                    <Typography variant="caption" style={{ fontWeight: '600' }}>
                        Priority: <Typography variant="caption" color={priority === 'CRITICAL' ? colors.error : colors.primary}>{priority}</Typography>
                    </Typography>
                    <Typography variant="caption" color={colors.primary} style={{ fontWeight: '700' }}>
                        Details →
                    </Typography>
                </HStack>
            </VStack>
        </Card>
    );
}