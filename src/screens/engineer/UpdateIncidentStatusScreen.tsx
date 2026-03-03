import { View, Alert, ScrollView, Image } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Layout } from '../../components/ui/Layout';
import { Typography } from '../../components/ui/Typography';
import { Header } from '../../components/ui/Header';
import { Card } from '../../components/ui/Card';
import { IncidentStatusBadge, IncidentStatus } from '../../components/ui/IncidentStatusBadge';
import { updateIncidentStatusApi } from '../../api/incidentApi';
import { useState } from 'react';
import { useTheme } from '../../hooks/useTheme';
import { VStack, Box, Pressable, HStack } from '@gluestack-ui/themed';

export default function UpdateIncidentStatusScreen() {
    const route = useRoute<any>();
    const navigation = useNavigation<any>();
    const { incidentId, incident } = route.params;
    const [loading, setLoading] = useState(false);
    const { colors } = useTheme();

    const updateStatus = async (status: string) => {
        try {
            setLoading(true);
            await updateIncidentStatusApi(incidentId, status);
            Alert.alert('Success', 'Status updated successfully');
            navigation.goBack();
        } catch {
            Alert.alert('Error', 'Failed to update status');
        } finally {
            setLoading(false);
        }
    };

    const StatusTile = ({ status, label, description }: { status: IncidentStatus, label: string, description: string }) => (
        <Pressable
            onPress={() => updateStatus(status)}
            disabled={loading}
            style={({ pressed }) => ({
                opacity: pressed ? 0.7 : 1,
                transform: [{ scale: pressed ? 0.98 : 1 }]
            })}
        >
            <Card variant="glass" padding="md" style={{ borderRadius: 20 }}>
                <HStack style={{ alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                    <IncidentStatusBadge status={status} />
                    <Typography variant="body" style={{ fontWeight: '700', color: colors.textPrimary }}>{label}</Typography>
                </HStack>
                <Typography variant="caption" color={colors.textSecondary}>{description}</Typography>
            </Card>
        </Pressable>
    );

    return (
        <Layout>
            <Header title="Update Status" showBack />
            <VStack style={{ flex: 1, padding: 20, gap: 24 }}>
                <Box
                    style={{
                        padding: 16,
                        borderRadius: 12,
                        backgroundColor: colors.surface,
                        borderWidth: 1,
                        borderColor: colors.border
                    }}
                >
                    <Typography variant="caption" color={colors.textSecondary} style={{ fontWeight: '700', letterSpacing: 1 }}>INCIDENT ID</Typography>
                    <Typography variant="h2" color={colors.textPrimary}>#{incidentId}</Typography>
                </Box>

                <VStack style={{ gap: 12 }}>
                    <Typography variant="subtitle" style={{ fontWeight: '700', paddingLeft: 4 }}>
                        {incident.description}
                    </Typography>

                    {incident.imageUrl && (
                        <Box style={{ marginBottom: 20, borderRadius: 12, overflow: 'hidden' }}>
                            <Image
                                source={{ uri: incident.imageUrl }}
                                style={{ width: '100%', height: 200, borderRadius: 12 }}
                                resizeMode="cover"
                            />
                        </Box>
                    )}

                    <Box style={{ height: 1, backgroundColor: colors.border, marginBottom: 16, opacity: 0.5 }} />

                    <VStack style={{ gap: 16 }}>
                        <StatusTile
                            status="IN_PROGRESS"
                            label="In Progress"
                            description="Acknowledge and start working on the incident."
                        />
                        <StatusTile
                            status="RESOLVED"
                            label="Resolved"
                            description="Fix has been deployed or issue is no longer present."
                        />
                        <StatusTile
                            status="CLOSED"
                            label="Closed"
                            description="Final confirmation that the incident is fully handled."
                        />
                    </VStack>
                </VStack>
            </VStack>
        </Layout>
    );
}