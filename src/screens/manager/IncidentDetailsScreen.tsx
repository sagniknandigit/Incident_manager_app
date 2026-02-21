import { View, Alert, StyleSheet, ScrollView } from 'react-native';
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

interface RouteParams {
    incident: any;
}

export default function IncidentDetailsScreen() {
    const route = useRoute<RouteProp<{ params: RouteParams }, 'params'>>();
    const navigation = useNavigation();
    const { incident } = route.params;
    const [engineers, setEngineers] = useState<any>([]);
    const [loading, setLoading] = useState(false);
    const { colors, theme } = useTheme();

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
            Alert.alert('Success', 'Engineer assigned');
            navigation.goBack();
        } catch (err) {
            Alert.alert('Error', 'Failed to assign engineer');
        } finally {
            setLoading(false);
        }
    };

    const DetailRow = ({ label, value, color }: { label: string, value: string, color?: string }) => (
        <View style={styles.detailRow}>
            <Typography variant="caption" color={colors.textSecondary}>{label}</Typography>
            <Typography variant="body" style={{ color: color || colors.textPrimary, fontWeight: '600' }}>{value}</Typography>
        </View>
    );

    return (
        <Layout>
            <Header title="Incident Details" showBack />
            <ScrollView contentContainerStyle={[styles.container, { paddingBottom: theme.spacing.xxl }]} showsVerticalScrollIndicator={false}>
                <Card style={[styles.mainCard, { marginBottom: theme.spacing.xl }] as any}>
                    <View style={[styles.cardHeader, { marginBottom: theme.spacing.md }] as any}>
                        <IncidentStatusBadge status={incident.status} />
                        <Typography variant="caption" color={colors.textSecondary}>
                            {new Date(incident.createdAt).toLocaleDateString()}
                        </Typography>
                    </View>

                    <Typography variant="h2" style={[styles.title, { marginBottom: theme.spacing.sm }]}>{incident.title}</Typography>
                    <Typography variant="body" color={colors.textSecondary} style={[styles.description, { marginBottom: theme.spacing.lg }]}>
                        {incident.description}
                    </Typography>

                    <View style={[styles.divider, { backgroundColor: colors.border, marginBottom: theme.spacing.md }]} />

                    <View style={styles.detailsGrid}>
                        <DetailRow
                            label="Priority"
                            value={incident.priority}
                            color={incident.priority === 'CRITICAL' ? colors.error : colors.textPrimary}
                        />
                        <DetailRow label="Reporter" value={incident.reporter?.name || 'Unknown'} />
                    </View>
                </Card>

                <Typography variant="h3" style={styles.sectionTitle}>Assign Engineer</Typography>
                <Typography variant="caption" color={colors.textSecondary} style={[styles.sectionSubtitle, { marginBottom: theme.spacing.md }]}>
                    Select an available engineer to handle this incident
                </Typography>

                <View style={[styles.engineerList, { gap: theme.spacing.md }]}>
                    {engineers.map((engineer: any) => (
                        <Card key={engineer.id} style={[styles.engineerCard, { paddingVertical: theme.spacing.sm }] as any}>
                            <View style={styles.engineerInfo}>
                                <View style={[styles.avatar, { backgroundColor: colors.primary + '15', marginRight: theme.spacing.md }]}>
                                    <Typography variant="h3" color={colors.primary}>{engineer.name.charAt(0)}</Typography>
                                </View>
                                <View>
                                    <Typography variant="body" style={{ fontWeight: '600' }}>{engineer.name}</Typography>
                                    <Typography variant="caption" color={colors.textSecondary}>{engineer.email}</Typography>
                                </View>
                            </View>
                            <Button
                                title="Assign"
                                onPress={() => handleAssign(engineer.id)}
                                variant="primary"
                                loading={loading}
                                style={[styles.assignBtn, { paddingHorizontal: theme.spacing.md }] as any}
                            />
                        </Card>
                    ))}
                </View>
            </ScrollView>
        </Layout>
    );
}

const styles = StyleSheet.create({
    container: {
    },
    mainCard: {
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
    },
    description: {
        lineHeight: 24,
    },
    divider: {
        height: 1,
        opacity: 0.5,
    },
    detailsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    detailRow: {
        flex: 1,
    },
    sectionTitle: {
        marginBottom: 4,
    },
    sectionSubtitle: {
    },
    engineerList: {
    },
    engineerCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    engineerInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    assignBtn: {
        height: 36,
    }
});