import { View, StyleSheet, FlatList } from 'react-native';
import { Layout } from '../../components/ui/Layout';
import { Typography } from '../../components/ui/Typography';
import { Card } from '../../components/ui/Card';
import { theme } from '../../theme/theme';
import { useState } from 'react';

import { getIncidentsApi } from '../../api/incidentApi';
import { useEffect } from 'react';

export default function IncidentList() {
    const [incidents, setIncidents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchIncidents();
    }, []);

    const fetchIncidents = async () => {
        try {
            const response = await getIncidentsApi();
            setIncidents(response.data);
        } catch (error) {
            console.error('Fetch error:', error);
        } finally {
            setLoading(false);
        }
    };


    const getStatusColor = (status: string) => {
        switch (status) {
            case 'OPEN': return theme.colors.error;
            case 'IN_PROGRESS': return theme.colors.warning;
            case 'RESOLVED': return theme.colors.success;
            default: return theme.colors.textSecondary;
        }
    };

    const renderItem = ({ item }: { item: any }) => (
        <Card style={styles.card}>
            <View style={styles.cardHeader}>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
                    <Typography variant="caption" style={{ color: getStatusColor(item.status), fontWeight: '700' }}>
                        {item.status.replace('_', ' ')}
                    </Typography>
                </View>
                <Typography variant="caption" color={theme.colors.textSecondary}>{item.date}</Typography>
            </View>

            <Typography variant="h3" style={styles.cardTitle}>{item.title}</Typography>

            <View style={styles.cardFooter}>
                <Typography variant="caption" color={theme.colors.textSecondary}>Priority: </Typography>
                <Typography variant="caption" style={{ color: item.priority === 'CRITICAL' ? theme.colors.error : theme.colors.textPrimary, fontWeight: '600' }}>
                    {item.priority}
                </Typography>
            </View>
        </Card>
    );

    const renderEmpty = () => (
        <View style={styles.emptyContainer}>
            <Typography variant="h3" align="center" style={styles.emptyText}>No Incidents Found</Typography>
            <Typography variant="body" align="center" color={theme.colors.textSecondary}>
                You haven't reported any incidents yet.
            </Typography>
        </View>
    );

    return (
        <Layout>
            <View style={styles.header}>
                <Typography variant="h2">Incidents</Typography>
            </View>

            <FlatList
                data={incidents}
                renderItem={renderItem}
                keyExtractor={item => item.id.toString()}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={!loading ? renderEmpty : null}
            />
        </Layout>
    );
}

const styles = StyleSheet.create({
    header: {
        marginBottom: theme.spacing.md,
        marginTop: theme.spacing.md,
    },
    listContent: {
        paddingBottom: theme.spacing.xl,
    },
    card: {
        marginBottom: theme.spacing.md,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.sm,
    },
    cardTitle: {
        marginBottom: theme.spacing.sm,
    },
    statusBadge: {
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: 2,
        borderRadius: theme.borderRadius.sm,
    },
    cardFooter: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    emptyContainer: {
        marginTop: theme.spacing.xxl,
        alignItems: 'center',
        padding: theme.spacing.lg,
    },
    emptyText: {
        marginBottom: theme.spacing.sm,
    },
});
