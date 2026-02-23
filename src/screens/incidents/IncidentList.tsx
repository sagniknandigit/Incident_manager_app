import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { Layout } from '../../components/ui/Layout';
import { Typography } from '../../components/ui/Typography';
import { Card } from '../../components/ui/Card';
import { EmptyState } from '../../components/ui/EmptyState';
import { IncidentStatusBadge } from '../../components/ui/IncidentStatusBadge';
import { useState, useCallback } from 'react';
import { getIncidentsApi } from '../../api/incidentApi';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Header } from '../../components/ui/Header';
import { useTheme } from '../../hooks/useTheme';

export default function IncidentList() {
    const [incidents, setIncidents] = useState([]);
    const [loading, setLoading] = useState(true);
    const { colors, theme } = useTheme();
    const navigation = useNavigation<any>();

    const fetchIncidents = async () => {
        setLoading(true);
        try {
            const response = await getIncidentsApi();
            setIncidents(response.data);
        } catch (error) {
            console.error('Fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchIncidents();
        }, [])
    );

    const renderItem = ({ item }: { item: any }) => {
        return (
            <Card style={styles.card as any} onPress={() => navigation.navigate('IncidentDetails', { incident: item })}>
                <View style={styles.cardHeader}>
                    <IncidentStatusBadge status={item.status} />
                    <Typography variant="caption" color={colors.textDisabled}>
                        {new Date(item.createdAt || Date.now()).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </Typography>
                </View>

                <Typography variant="h3" style={styles.cardTitle} numberOfLines={1}>{item.title}</Typography>

                <Typography variant="body" color={colors.textSecondary} numberOfLines={2} style={styles.description}>
                    {item.description}
                </Typography>

                <View style={[styles.footer, { borderTopColor: colors.border }]}>
                    <View style={styles.priorityContainer}>
                        <View style={[
                            styles.priorityDot,
                            { backgroundColor: item.priority === 'CRITICAL' ? colors.error : colors.primaryLight }
                        ]} />
                        <Typography variant="caption" color={colors.textSecondary} style={{ fontWeight: '600' }}>
                            {item.priority}
                        </Typography>
                    </View>
                    <Typography variant="caption" color={colors.primary} style={{ fontWeight: '700' }}>
                        VIEW DETAILS →
                    </Typography>
                </View>
            </Card>
        );
    };

    return (
        <Layout>
            <Header title="Incident Feed" showBack />
            <FlatList
                data={incidents}
                renderItem={renderItem}
                keyExtractor={item => item.id.toString()}
                contentContainerStyle={[styles.listContent, { paddingBottom: theme.spacing.xl }]}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={!loading ? (
                    <EmptyState
                        title="No Incidents Reported"
                        description="Your operational feed is currently clear. Any new reports will appear here in real-time."
                        icon="🛡️"
                        actionLabel="Report Incident"
                        onAction={() => navigation.navigate('CreateIncident')}
                    />
                ) : null}
                refreshControl={
                    <RefreshControl
                        refreshing={loading}
                        onRefresh={fetchIncidents}
                        tintColor={colors.primary}
                        colors={[colors.primary]}
                    />
                }
            />
        </Layout>
    );
}

const styles = StyleSheet.create({
    listContent: {
        paddingHorizontal: 16,
        paddingTop: 8,
        flexGrow: 1,
    },
    card: {
        marginBottom: 16,
        borderRadius: 20,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    cardTitle: {
        marginBottom: 6,
        fontWeight: '700',
    },
    description: {
        marginBottom: 16,
        lineHeight: 20,
        fontSize: 14,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 12,
        borderTopWidth: 1,
    },
    priorityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    priorityDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 6,
    },
});
