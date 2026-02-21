import { FlatList, View, StyleSheet } from 'react-native';
import { useEffect, useState } from 'react';
import { Layout } from '../../components/ui/Layout';
import { Typography } from '../../components/ui/Typography';
import { getMyIncidentsApi } from '../../api/incidentApi';
import { useTheme } from '../../hooks/useTheme';
import { Header } from '../../components/ui/Header';
import { Card } from '../../components/ui/Card';

export default function MyIncidentsScreen() {
    const [incidents, setIncidents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { colors, theme } = useTheme();

    useEffect(() => {
        fetchIncidents();
    }, []);

    const fetchIncidents = async () => {
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

    const renderStatusColor = (status: string) => {
        switch (status) {
            case 'OPEN':
                return colors.error;
            case 'IN_PROGRESS':
                return colors.warning;
            case 'RESOLVED':
                return colors.success;
            default:
                return colors.textSecondary;
        }
    };

    return (
        <Layout>
            <Header title="My Incidents" showBack />

            <FlatList
                data={incidents}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={{ padding: theme.spacing.md }}
                renderItem={({ item }) => (
                    <Card style={[styles.card, { backgroundColor: colors.surface, borderRadius: theme.borderRadius.md, marginBottom: theme.spacing.sm }] as any}>
                        <Typography variant='h3' color={colors.textPrimary}>{item.title}</Typography>
                        <Typography variant='caption' color={colors.textSecondary}>Priority: {item.priority}</Typography>
                        <Typography variant='caption' style={{ color: renderStatusColor(item.status), fontWeight: '600' }}>Status: {item.status}</Typography>
                        <Typography variant='caption' color={colors.textDisabled}>Assigned Engineer: {item.engineer?.name || 'Not Assigned'}</Typography>
                    </Card>
                )} />
        </Layout>
    );
}

const styles = StyleSheet.create({
    card: {
        padding: 16,
    },
});
