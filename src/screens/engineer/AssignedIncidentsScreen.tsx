import { View, FlatList, StyleSheet, RefreshControl } from 'react-native';
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

export default function AssignedIncidentsScreen() {
    const navigation = useNavigation<any>();
    const [incidents, setIncidents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { colors, theme } = useTheme();

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
            style={styles.card as any}
            onPress={() => navigation.navigate('UpdateStatus', { incidentId: item.id })}
        >
            <View style={styles.cardHeader}>
                <IncidentStatusBadge status={item.status} />
                <Typography variant="caption" color={colors.textDisabled}>
                    {new Date(item.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                </Typography>
            </View>

            <Typography variant="h3" style={styles.cardTitle}>{item.title}</Typography>
            <Typography variant="body" color={colors.textSecondary} numberOfLines={2} style={styles.description}>
                {item.description || 'Action required for this incident.'}
            </Typography>

            <View style={[styles.footer, { borderTopColor: colors.border }]}>
                <View style={styles.reporterInfo}>
                    <View style={[styles.reporterAvatar, { backgroundColor: colors.surfaceHighlight }]}>
                        <Typography variant="caption" style={{ fontWeight: '700' }}>{item.reporter?.name?.charAt(0) || 'U'}</Typography>
                    </View>
                    <Typography variant="caption" color={colors.textSecondary}>{item.reporter?.name || 'Authorized User'}</Typography>
                </View>
                <Typography variant="caption" color={colors.primary} style={{ fontWeight: '800' }}>
                    EXECUTE →
                </Typography>
            </View>
        </Card>
    );

    return (
        <Layout>
            <Header title="Active Missions" showBack />
            <FlatList
                data={incidents}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                contentContainerStyle={[styles.listContainer, { paddingBottom: theme.spacing.xl }]}
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
                    ) : null
                }
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
        marginBottom: 16,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 8,
    },
    description: {
        lineHeight: 20,
        marginBottom: 20,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        paddingTop: 16,
    },
    reporterInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    reporterAvatar: {
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
    }
});

