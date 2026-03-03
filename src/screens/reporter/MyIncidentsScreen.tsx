import { FlatList, RefreshControl } from 'react-native';
import { useEffect, useState, useCallback } from 'react';
import { Layout } from '../../components/ui/Layout';
import { Typography } from '../../components/ui/Typography';
import { getMyIncidentsApi } from '../../api/incidentApi';
import { useTheme } from '../../hooks/useTheme';
import { Header } from '../../components/ui/Header';
import { Card } from '../../components/ui/Card';
import { EmptyState } from '../../components/ui/EmptyState';
import { IncidentStatusBadge } from '../../components/ui/IncidentStatusBadge';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { VStack, HStack, Box, Center, Spinner } from '@gluestack-ui/themed';

export default function MyIncidentsScreen() {
    const [incidents, setIncidents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { colors } = useTheme();
    const navigation = useNavigation<any>();

    const fetchIncidents = async () => {
        setLoading(true);
        try {
            const res = await getMyIncidentsApi();
            setIncidents(res.data);
        }
        catch (error) {
            console.log('Failed to fetch reporter incidents', error);
        }
        finally {
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
            onPress={() => navigation.navigate('IncidentDetails', { incident: item })}
        >
            <HStack sx={{ justifyContent: 'space-between', alignItems: 'center', mb: '$3' }}>
                <IncidentStatusBadge status={item.status} />
                <Typography variant="caption" color={colors.textDisabled}>
                    ID: #{item.id.toString().padStart(4, '0')}
                </Typography>
            </HStack>

            <Typography variant="h3" style={{ fontSize: 18, fontWeight: '700', marginBottom: 8 }}>
                {item.title}
            </Typography>

            <HStack sx={{ alignItems: 'center', mb: '$4' }}>
                <Typography variant="caption" color={colors.textSecondary}>Priority: </Typography>
                <Typography variant="caption" style={{ color: item.priority === 'CRITICAL' ? colors.error : colors.primary, fontWeight: '700' }}>
                    {item.priority}
                </Typography>
            </HStack>

            <Box sx={{ h: 1, bg: colors.border, mb: '$3', opacity: 0.5 }} />

            <HStack sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                <HStack sx={{ alignItems: 'center', gap: '$1' }}>
                    <Typography variant="caption" color={colors.textDisabled}>Assigned: </Typography>
                    <Typography variant="caption" color={colors.textPrimary} style={{ fontWeight: '600' }}>
                        {item.engineer?.name || 'Searching...'}
                    </Typography>
                </HStack>
                <Typography variant="caption" color={colors.primary} style={{ fontWeight: '700' }}>
                    TRACK →
                </Typography>
            </HStack>
        </Card>
    );

    return (
        <Layout>
            <Header title="My Reports" showBack />
            <FlatList
                data={incidents}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 40, flexGrow: 1 }}
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={loading}
                        onRefresh={fetchIncidents}
                        tintColor={colors.primary}
                    />
                }
                ListEmptyComponent={!loading ? (
                    <EmptyState
                        title="No Active Reports"
                        description="You haven't reported any incidents yet. Your system status is currently optimal."
                        icon="✨"
                        actionLabel="Report New Incident"
                        onAction={() => navigation.navigate('CreateIncident')}
                    />
                ) : (
                    <Center flex={1}>
                        <Spinner size="large" color={colors.primary} />
                    </Center>
                )}
            />
        </Layout>
    );
}
