import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { Layout } from '../../components/ui/Layout';
import { Typography } from '../../components/ui/Typography';
import { Card } from '../../components/ui/Card';
import { theme } from '../../theme/theme';
import { useState, useCallback } from 'react';
import { getIncidentsApi } from '../../api/incidentApi';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Header } from '../../components/ui/Header';

export default function IncidentList() {
    const [incidents, setIncidents] = useState([]);
    const [loading, setLoading] = useState(true);

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

    const navigation = useNavigation<any>();

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'OPEN': return theme.colors.error;
            case 'IN_PROGRESS': return theme.colors.warning;
            case 'RESOLVED': return theme.colors.success;
            default: return theme.colors.textSecondary;
        }
    };

    const getStatusLabel = (status: string) => status.replace('_', ' ');

    const renderItem = ({ item }: { item: any }) => (
        <Card style={styles.card} onPress={() => navigation.navigate('IncidentDetails', { incident: item })}>
            <View style={styles.cardHeader}>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20', borderColor: getStatusColor(item.status) + '50' }]}>
                    <Typography variant="caption" style={{ color: getStatusColor(item.status), fontWeight: '700', fontSize: 12 }}>
                        {getStatusLabel(item.status)}
                    </Typography>
                </View>
                <Typography variant="caption" color={theme.colors.textSecondary} style={{ fontSize: 12 }}>{new Date(item.createdAt || Date.now()).toLocaleDateString()}</Typography>
            </View>

            <Typography variant="h3" style={styles.cardTitle} numberOfLines={2}>{item.title}</Typography>

            <Typography variant="body" color={theme.colors.textSecondary} numberOfLines={2} style={styles.description}>
                {item.description}
            </Typography>

            <View style={styles.divider} />

            <View style={styles.cardFooter}>
                <View style={styles.footerItem}>
                    <Typography variant="caption" color={theme.colors.textDisabled}>Priority</Typography>
                    <Typography variant="body" style={{ color: item.priority === 'CRITICAL' ? theme.colors.error : theme.colors.textPrimary, fontWeight: '600', marginLeft: 4 }}>
                        {item.priority}
                    </Typography>
                </View>
            </View>
        </Card>
    );

    const renderEmpty = () => (
        <View style={styles.emptyContainer}>
            <View style={styles.emptyIcon}>
                <Typography variant="h1">📋</Typography>
            </View>
            <Typography variant="h3" align="center" style={styles.emptyText}>No Incidents Found</Typography>
            <Typography variant="body" align="center" color={theme.colors.textSecondary}>
                You haven't reported any incidents yet.
            </Typography>
        </View>
    );

    return (
        <Layout>
            <Header title="Incidents" showBack />
            <FlatList
                data={incidents}
                renderItem={renderItem}
                keyExtractor={item => item.id.toString()}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={!loading ? renderEmpty : null}
                refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchIncidents} tintColor={theme.colors.primary} />}
            />
        </Layout>
    );
}

const styles = StyleSheet.create({
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
        marginBottom: theme.spacing.xs,
        color: theme.colors.textPrimary,
    },
    description: {
        marginBottom: theme.spacing.md,
        lineHeight: 22,
    },
    statusBadge: {
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: 4,
        borderRadius: theme.borderRadius.sm,
        borderWidth: 1,
    },
    divider: {
        height: 1,
        backgroundColor: theme.colors.border,
        marginBottom: theme.spacing.sm,
        opacity: 0.5,
    },
    cardFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    footerItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    emptyContainer: {
        marginTop: theme.spacing.xxl,
        alignItems: 'center',
        padding: theme.spacing.lg,
    },
    emptyIcon: {
        width: 80,
        height: 80,
        borderRadius: theme.borderRadius.round,
        backgroundColor: theme.colors.surfaceHighlight,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: theme.spacing.lg,
    },
    emptyText: {
        marginBottom: theme.spacing.sm,
    },
});
