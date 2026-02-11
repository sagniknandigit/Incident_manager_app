import { View, FlatList, Alert } from 'react-native';
import { useEffect, useState } from 'react';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { Layout } from '../../components/ui/Layout';
import { Typography } from '../../components/ui/Typography';
import { Button } from '../../components/ui/Button';
import { Header } from '../../components/ui/Header';
import { getEngineersApi } from '../../api/userApi';
import { assignEngineerApi } from '../../api/incidentApi';

interface RouteParams {
    incident: any;
}

export default function IncidentDetailsScreen() {
    const route = useRoute<RouteProp<{ params: RouteParams }, 'params'>>();
    const navigation = useNavigation();
    const { incident } = route.params;
    const [engineers, setEngineers] = useState<any>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchEngineers();
    }, []);

    const fetchEngineers = async () => {
        try {
            const res = await getEngineersApi();
            setEngineers(res.data);
        }
        catch (err) {
            console.log(err);
        }
    };

    const handleAssign = async (engineerId: number) => {
        try {
            setLoading(true);
            await assignEngineerApi(incident.id, engineerId);
            Alert.alert('Success', 'Engineer assigned');
            navigation.goBack();
        }
        catch (err) {
            Alert.alert('Error', 'Failed toassign engineer');
        }
        finally {
            setLoading(false);
        }
    }

    return (
        <Layout>
            <Header title="Incident Details" showBack />
            <Typography variant='h2'>{incident.title}</Typography>
            <Typography variant='body'>{incident.description}</Typography>

            <Typography variant='h3' style={{ marginTop: 20 }}>Assign Engineer</Typography>
            <FlatList data={engineers} keyExtractor={(item) => item.id.toString()} renderItem={({ item }) => (
                <Button title={item.name} onPress={() => handleAssign(item.id)} loading={loading} style={{ marginVertical: 5 }} />
            )} />
        </Layout>
    );
}