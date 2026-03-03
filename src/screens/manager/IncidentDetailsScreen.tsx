import { View, Alert, ScrollView, Image } from 'react-native';
import { useEffect, useState } from 'react';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { Layout } from '../../components/ui/Layout';
import { Typography } from '../../components/ui/Typography';
import { Button } from '../../components/ui/Button';
import { Header } from '../../components/ui/Header';
import { Card } from '../../components/ui/Card';
import { IncidentStatusBadge } from '../../components/ui/IncidentStatusBadge';
import { getEngineersApi } from '../../api/userApi';
import { assignEngineerApi } from '../../api/incidentApi';
import { useTheme } from '../../hooks/useTheme';
import { VStack, HStack, Box, Center, Avatar, AvatarFallbackText } from '@gluestack-ui/themed';

interface RouteParams {
    incident: any;
}

export default function IncidentDetailsScreen() {
    const route = useRoute<RouteProp<{ params: RouteParams }, 'params'>>();
    const navigation = useNavigation<any>();
    const { incident } = route.params;
    const [engineers, setEngineers] = useState<any>([]);
    const [loading, setLoading] = useState(false);
    const { colors } = useTheme();

    useEffect(() => {
        fetchEngineers();
    }, []);

    const fetchEngineers = async () => {
        try {
            const res = await getEngineersApi();
            setEngineers(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    const handleAssign = async (engineerId: number) => {
        try {
            setLoading(true);
            await assignEngineerApi(incident.id, engineerId);
            Alert.alert('Success', 'Engineer assigned successfully');
            navigation.goBack();
        } catch (err) {
            Alert.alert('Error', 'Failed to assign engineer');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <Header title="Incident Details" showBack />
            <ScrollView
                contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 40 }}
                showsVerticalScrollIndicator={false}
            >
                <Card variant="elevated" padding="lg" style={{ marginBottom: 24, borderRadius: 20 }}>
                    <HStack style={{ justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                        <IncidentStatusBadge status={incident.status} />
                        <Typography variant="caption" color={colors.textDisabled}>
                            {new Date(incident.createdAt).toLocaleDateString()}
                        </Typography>
                    </HStack>

                    <Typography variant="h2" style={{ marginBottom: 8 }}>{incident.title}</Typography>
                    <Typography variant="body" color={colors.textSecondary} style={{ marginBottom: 20 }}>
                        {incident.description}
                    </Typography>

                    {incident.imageUrl && (
                        <Box style={{ marginBottom: 20, borderRadius: 16, overflow: 'hidden' }}>
                            <Image
                                source={{ uri: incident.imageUrl }}
                                style={{ width: '100%', height: 250, borderRadius: 16 }}
                                resizeMode="cover"
                            />
                        </Box>
                    )}

                    <Box style={{ height: 1, backgroundColor: colors.border, marginBottom: 16, opacity: 0.5 }} />

                    <HStack sx={{ justifyContent: 'space-between' }}>
                        <VStack>
                            <Typography variant="caption" color={colors.textDisabled}>PRIORITY</Typography>
                            <Typography variant="body" style={{ color: incident.priority === 'CRITICAL' ? colors.error : colors.primary, fontWeight: '700' }}>
                                {incident.priority}
                            </Typography>
                        </VStack>
                        <VStack sx={{ alignItems: 'flex-end' }}>
                            <Typography variant="caption" color={colors.textDisabled}>REPORTER</Typography>
                            <Typography variant="body" style={{ fontWeight: '700' }}>
                                {incident.reporter?.name || 'User'}
                            </Typography>
                        </VStack>
                    </HStack>
                </Card>

                <Typography variant="subtitle" style={{ fontWeight: '700', marginBottom: 12, paddingLeft: 4 }}>
                    Assign Engineer
                </Typography>

                <VStack style={{ gap: 12 }}>
                    {engineers.map((engineer: any) => (
                        <Card key={engineer.id} variant="elevated" padding="md" style={{ borderRadius: 16 }}>
                            <HStack style={{ alignItems: 'center', justifyContent: 'space-between' }}>
                                <HStack style={{ alignItems: 'center', gap: 12, flex: 1 }}>
                                    <Avatar borderRadius="$full" style={{ width: 32, height: 32, backgroundColor: colors.primary }}>
                                        <AvatarFallbackText>{engineer.name}</AvatarFallbackText>
                                    </Avatar>
                                    <VStack>
                                        <Typography variant="body" style={{ fontWeight: '600' }}>{engineer.name}</Typography>
                                        <Typography variant="caption" color={colors.textSecondary}>{engineer.email}</Typography>
                                    </VStack>
                                </HStack>
                                <Button
                                    title="Assign"
                                    onPress={() => handleAssign(engineer.id)}
                                    loading={loading}
                                    style={{ height: 36, minWidth: 80 }}
                                    fullWidth={false}
                                />
                            </HStack>
                        </Card>
                    ))}
                </VStack>
            </ScrollView>
        </Layout>
    );
}