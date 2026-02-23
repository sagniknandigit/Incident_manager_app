import { FlatList, View, StyleSheet, RefreshControl } from 'react-native';
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

export default function MyIncidentsScreen() {
    const [incidents, setIncidents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { colors, theme } = useTheme();
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
            style={styles.card as any}
            onPress={() => navigation.navigate('IncidentDetails', { incident: item })}
        >
            <View style={styles.cardHeader}>
                <IncidentStatusBadge status={item.status} />
                <Typography variant="caption" color={colors.textDisabled}>
                    ID: #{item.id.toString().padStart(4, '0')}
                </Typography>
            </View>

            <Typography variant="h3" style={styles.cardTitle}>{item.title}</Typography>

            <View style={styles.infoRow}>
                <Typography variant="caption" color={colors.textSecondary}>Priority: </Typography>
                <Typography variant="caption" style={{ color: item.priority === 'CRITICAL' ? colors.error : colors.primary, fontWeight: '700' }}>
                    {item.priority}
                </Typography>
            </View>

            <View style={[styles.footer, { borderTopColor: colors.border }]}>
                <View style={styles.engineerGroup}>
                    <Typography variant="caption" color={colors.textDisabled}>Assigned: </Typography>
                    <Typography variant="caption" color={colors.textPrimary} style={{ fontWeight: '600' }}>
                        {item.engineer?.name || 'Searching...'}
                    </Typography>
                </View>
                <Typography variant="caption" color={colors.primary} style={{ fontWeight: '700' }}>
                    TRACK →
                </Typography>
            </View>
        </Card>
    );

    return (
        <Layout>
            <Header title="My Reports" showBack />
            <FlatList
                data={incidents}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={[styles.listContainer, { paddingBottom: theme.spacing.xl }]}
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
                ) : null}
            />
        </Layout>
    );
}

const styles = StyleSheet.create({
    listContainer: {
        paddingHorizontal: 16,
        paddingTop: 8,
        flexGrow: 1,
    },
    card: {
        marginBottom: 16,
        borderRadius: 24,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 8,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        paddingTop: 12,
    },
    engineerGroup: {
        flexDirection: 'row',
        alignItems: 'center',
    }
});
