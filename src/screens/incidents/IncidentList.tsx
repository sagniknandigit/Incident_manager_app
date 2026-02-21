import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { Layout } from '../../components/ui/Layout';
import { Typography } from '../../components/ui/Typography';
import { Card } from '../../components/ui/Card';
import { useState, useCallback } from 'react';
import { getIncidentsApi } from '../../api/incidentApi';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Header } from '../../components/ui/Header';
import { useTheme } from '../../hooks/useTheme';

export default function IncidentList() {
    const [incidents, setIncidents] = useState([]);
    const [loading, setLoading] = useState(true);
    const { colors, theme } = useTheme();

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
            case 'OPEN': return colors.error;
            case 'IN_PROGRESS': return colors.warning;
            case 'RESOLVED': return colors.success;
            default: return colors.textSecondary;
        }
    };

    const getStatusLabel = (status: string) => status.replace('_', ' ');

    const renderItem = ({ item }: { item: any }) => (
        <Card style={styles.card} onPress={() => navigation.navigate('IncidentDetails', { incident: item })}>
            <View style={styles.cardHeader}>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20', borderColor: getStatusColor(item.status) + '50', borderRadius: theme.borderRadius.sm }] as any}>
                    <Typography variant="caption" style={{ color: getStatusColor(item.status), fontWeight: '700', fontSize: 12 }}>
                        {getStatusLabel(item.status)}
                    </Typography>
                </View>
                <Typography variant="caption" color={colors.textSecondary} style={{ fontSize: 12 }}>{new Date(item.createdAt || Date.now()).toLocaleDateString()}</Typography>
            </View>

            <Typography variant="h3" style={[styles.cardTitle, { color: colors.textPrimary }]} numberOfLines={2}>{item.title}</Typography>

            <Typography variant="body" color={colors.textSecondary} numberOfLines={2} style={styles.description}>
                {item.description}
            </Typography>

            <View style={[styles.divider, { backgroundColor: colors.border }]} />

            <View style={styles.cardFooter}>
                <View style={styles.footerItem}>
                    <Typography variant="caption" color={colors.textDisabled}>Priority</Typography>
                    <Typography variant="body" style={{ color: item.priority === 'CRITICAL' ? colors.error : colors.textPrimary, fontWeight: '600', marginLeft: 4 }}>
                        {item.priority}
                    </Typography>
                </View>
            </View>
        </Card>
    );

    const renderEmpty = () => (
        <View style={[styles.emptyContainer, { marginTop: theme.spacing.xxl, padding: theme.spacing.lg }]}>
            <View style={[styles.emptyIcon, { borderRadius: theme.borderRadius.round, backgroundColor: colors.surfaceHighlight, marginBottom: theme.spacing.lg }]}>
                <Typography variant="h1">📋</Typography>
            </View>
            <Typography variant="h3" align="center" style={[styles.emptyText, { marginBottom: theme.spacing.sm }]}>No Incidents Found</Typography>
            <Typography variant="body" align="center" color={colors.textSecondary}>
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
                contentContainerStyle={[styles.listContent, { paddingBottom: theme.spacing.xl }]}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={!loading ? renderEmpty : null}
                refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchIncidents} tintColor={colors.primary} />}
            />
        </Layout>
    );
}

const styles = StyleSheet.create({
    listContent: {
    },
    card: {
        marginBottom: 16,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    cardTitle: {
        marginBottom: 4,
    },
    description: {
        marginBottom: 16,
        lineHeight: 22,
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderWidth: 1,
    },
    divider: {
        height: 1,
        marginBottom: 8,
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
        alignItems: 'center',
    },
    emptyIcon: {
        width: 80,
        height: 80,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
    },
});
