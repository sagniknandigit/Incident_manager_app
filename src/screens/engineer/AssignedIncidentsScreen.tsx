import { View, FlatList, StyleSheet, RefreshControl } from 'react-native';
import { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Layout } from '../../components/ui/Layout';
import { Typography } from '../../components/ui/Typography';
import { Header } from '../../components/ui/Header';
import { Card } from '../../components/ui/Card';
import { IncidentStatusBadge } from '../../components/ui/IncidentStatusBadge';
import { getAssignedIncidentsApi } from '../../api/incidentApi';
import { useTheme } from '../../hooks/useTheme';

export default function AssignedIncidentsScreen() {
    const navigation = useNavigation<any>();
    const [incidents, setIncidents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { colors, theme } = useTheme();

    useEffect(() => {
        fetchIncidents();
    }, []);

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

    const renderItem = ({ item }: { item: any }) => (
        <Card
            style={[styles.card, { marginBottom: theme.spacing.md }] as any}
            onPress={() => navigation.navigate('UpdateStatus', { incidentId: item.id })}
        >
            <View style={[styles.cardHeader, { marginBottom: theme.spacing.sm }]}>
                <IncidentStatusBadge status={item.status} />
                <Typography variant="caption" color={colors.textSecondary}>
                    {new Date(item.createdAt).toLocaleDateString()}
                </Typography>
            </View>

            <Typography variant="h3" style={[styles.cardTitle, { marginBottom: theme.spacing.md }]} color={colors.textPrimary}>{item.title}</Typography>

            <View style={[styles.footer, { borderTopColor: colors.border, paddingTop: theme.spacing.sm }]}>
                <View style={styles.reporterInfo}>
                    <Typography variant="caption" color={colors.textDisabled}>Reported by:</Typography>
                    <Typography variant="caption" style={[styles.reporterName, { color: colors.textPrimary }]}>{item.reporter?.name || 'User'}</Typography>
                </View>
                <Typography variant="caption" color={colors.primary} style={{ fontWeight: '700' }}>
                    UPDATE STATUS →
                </Typography>
            </View>
        </Card>
    );

    return (
        <Layout>
            <Header title="Assigned Tasks" showBack />
            <FlatList
                data={incidents}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                contentContainerStyle={[styles.listContainer, { paddingBottom: theme.spacing.xl }]}
                refreshControl={
                    <RefreshControl
                        refreshing={loading}
                        onRefresh={fetchIncidents}
                        tintColor={colors.primary}
                    />
                }
                ListEmptyComponent={
                    !loading ? (
                        <View style={styles.emptyContainer}>
                            <Typography variant="body" color={colors.textSecondary}>No incidents assigned to you.</Typography>
                        </View>
                    ) : null
                }
            />
        </Layout>
    );
}

const styles = StyleSheet.create({
    listContainer: {
    },
    card: {
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cardTitle: {
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        marginTop: 4,
    },
    reporterInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    reporterName: {
        marginLeft: 4,
        fontWeight: '600',
    },
    emptyContainer: {
        marginTop: 40,
        alignItems: 'center',
    }
});

