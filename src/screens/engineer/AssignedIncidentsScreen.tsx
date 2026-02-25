import { FlatList, RefreshControl } from 'react-native';
import { useEffect, useState, useCallback } from 'react';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Layout } from '../../components/ui/Layout';
import { Typography } from '../../components/ui/Typography';
import { Header } from '../../components/ui/Header';
import { Card } from '../../components/ui/Card';
import { EmptyState } from '../../components/ui/EmptyState';
import { IncidentStatusBadge } from '../../components/ui/IncidentStatusBadge';
import { getAssignedIncidentsApi } from '../../api/incidentApi';
import { useTheme } from '../../hooks/useTheme';
import { VStack, HStack, Box, Center, Spinner, Avatar, AvatarFallbackText } from '@gluestack-ui/themed';

export default function AssignedIncidentsScreen() {
    const navigation = useNavigation<any>();
    const [incidents, setIncidents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { colors } = useTheme();

    const fetchIncidents = async () => {
        setLoading(true);
        try {
            const res = await getAssignedIncidentsApi();
            setIncidents(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchIncidents();
        }, [])
    );

    const renderItem = ({ item }: { item: any }) => (
        <Card
            variant="elevated"
            padding="lg"
            style={{ marginBottom: 16, borderRadius: 24 }}
            onPress={() => navigation.navigate('UpdateStatus', { incidentId: item.id })}
        >
            <HStack sx={{ justifyContent: 'space-between', alignItems: 'center', mb: '$4' }}>
                <IncidentStatusBadge status={item.status} />
                <Typography variant="caption" color={colors.textDisabled}>
                    {new Date(item.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                </Typography>
            </HStack>

            <Typography variant="h3" style={{ fontSize: 18, fontWeight: '700', marginBottom: 8 }}>
                {item.title}
            </Typography>
            <Typography variant="body" color={colors.textSecondary} numberOfLines={2} style={{ lineHeight: 20, marginBottom: 20 }}>
                {item.description || 'Action required for this incident.'}
            </Typography>

            <Box sx={{ h: 1, bg: colors.border, mb: '$4', opacity: 0.5 }} />

            <HStack sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                <HStack sx={{ alignItems: 'center', gap: '$2' }}>
                    <Avatar size="xs" borderRadius="$full" bg={colors.surfaceHighlight}>
                        <AvatarFallbackText>{item.reporter?.name || 'U'}</AvatarFallbackText>
                    </Avatar>
                    <Typography variant="caption" color={colors.textSecondary}>{item.reporter?.name || 'Authorized User'}</Typography>
                </HStack>
                <Typography variant="caption" color={colors.primary} style={{ fontWeight: '800' }}>
                    EXECUTE →
                </Typography>
            </HStack>
        </Card>
    );

    return (
        <Layout>
            <Header title="Active Missions" showBack />
            <FlatList
                data={incidents}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 40, flexGrow: 1 }}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={loading}
                        onRefresh={fetchIncidents}
                        tintColor={colors.primary}
                    />
                }
                ListEmptyComponent={
                    !loading ? (
                        <EmptyState
                            title="Mission Status: Clear"
                            description="No assignments found in your queue. Enjoy the calm before the next storm."
                            icon="🛸"
                        />
                    ) : (
                        <Center flex={1}>
                            <Spinner size="large" color={colors.primary} />
                        </Center>
                    )
                }
            />
        </Layout>
    );
}

export default AssignedIncidentsScreen;
