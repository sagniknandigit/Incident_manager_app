import { FlatList, RefreshControl } from 'react-native';
import { useEffect, useState, useCallback } from 'react';
import { Layout } from '../../components/ui/Layout';
import { getIncidentsApi } from '../../api/incidentApi';
import { useTheme } from '../../hooks/useTheme';
import { Header } from '../../components/ui/Header';
import { EmptyState } from '../../components/ui/EmptyState';
import IncidentCard from './IncidentCard';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Center, Spinner } from '@gluestack-ui/themed';

export default function IncidentListScreen() {
    const [incidents, setIncidents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { colors } = useTheme();
    const navigation = useNavigation<any>();

    const fetchIncidents = async () => {
        setLoading(true);
        try {
            const res = await getIncidentsApi();
            setIncidents(res.data);
        } catch (error) {
            console.log('Failed to fetch incidents', error);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchIncidents();
        }, [])
    );

    return (
        <Layout>
            <Header title="Incident Feed" showBack />
            <FlatList
                data={incidents}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 40, flexGrow: 1 }}
                renderItem={({ item }) => (
                    <IncidentCard
                        title={item.title}
                        status={item.status}
                        priority={item.priority}
                        reporter={item.reporter?.name || 'User'}
                        onPress={() => navigation.navigate('IncidentDetails', { incident: item })}
                    />
                )}
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
                        title="No Incidents Found"
                        description="The system is currently stable and no incidents have been reported."
                        icon="✅"
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