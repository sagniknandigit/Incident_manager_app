import { View, Alert, StyleSheet, ScrollView, Animated } from 'react-native';
import { useEffect, useState, useRef } from 'react';
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
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        fetchEngineers();
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
        }).start();
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
            Alert.alert('Assignment Confirmed', 'The engineer has been successfully assigned to this core incident.');
            navigation.goBack();
        } catch (err) {
            Alert.alert('Error', 'Failed to update incident assignment');
        } finally {
            setLoading(false);
        }
    };

    const StatusInfo = ({ label, value, color }: { label: string, value: string, color?: string }) => (
        <View style={styles.statusInfoItem}>
            <Typography variant="caption" color={colors.textDisabled} style={styles.infoLabel}>{label.toUpperCase()}</Typography>
            <Typography variant="body" style={{ color: color || colors.textPrimary, fontWeight: '700' }}>{value}</Typography>
        </View>
    );

    return (
        <Layout>
            <Header title="Mission Briefing" showBack />
            <ScrollView
                contentContainerStyle={[styles.scrollContent, { paddingBottom: theme.spacing.xxl }]}
                showsVerticalScrollIndicator={false}
            >
                <Animated.View style={{ opacity: fadeAnim }}>
                    <Card variant="elevated" padding="lg" style={styles.mainCard as any}>
                        <View style={styles.cardHeader}>
                            <IncidentStatusBadge status={incident.status} />
                            <Typography variant="caption" color={colors.textDisabled}>
                                {new Date(incident.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                            </Typography>
                        </View>

                        <Typography variant="h2" style={styles.title}>{incident.title}</Typography>
                        <Typography variant="body" color={colors.textSecondary} style={styles.description}>
                            {incident.description}
                        </Typography>

                        <View style={[styles.infoGrid, { backgroundColor: colors.surfaceHighlight, borderRadius: 16 }]}>
                            <StatusInfo
                                label="Priority Level"
                                value={incident.priority}
                                color={incident.priority === 'CRITICAL' ? colors.error : colors.primary}
                            />
                            <View style={[styles.verticalDivider, { backgroundColor: colors.border }]} />
                            <StatusInfo
                                label="Original Reporter"
                                value={incident.reporter?.name || 'Authorized User'}
                            />
                        </View>
                    </Card>

                    <View style={styles.actionHeader}>
                        <Typography variant="h3" style={{ fontWeight: '800' }}>Dispatch Engineer</Typography>
                        <Typography variant="caption" color={colors.textSecondary} style={styles.subtitle}>
                            SELECT A CERTIFIED SPECIALIST FOR RESOLUTION
                        </Typography>
                    </View>

                    <View style={styles.engineerList}>
                        {engineers.map((engineer: any) => (
                            <Card
                                key={engineer.id}
                                variant="glass"
                                padding="md"
                                style={styles.engineerCard as any}
                            >
                                <View style={styles.engineerMain}>
                                    <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
                                        <Typography variant="h3" color={colors.textInverse}>{engineer.name.charAt(0)}</Typography>
                                    </View>
                                    <View style={styles.engineerText}>
                                        <Typography variant="body" style={{ fontWeight: '700' }}>{engineer.name}</Typography>
                                        <Typography variant="caption" color={colors.textDisabled}>{engineer.email}</Typography>
                                    </View>
                                </View>
                                <Button
                                    title="Dispatch"
                                    onPress={() => handleAssign(engineer.id)}
                                    variant="primary"
                                    loading={loading}
                                    style={styles.dispatchBtn}
                                    fullWidth={false}
                                />
                            </Card>
                        ))}
                    </View>
                </Animated.View>
            </ScrollView>
        </Layout>
    );
}

const styles = StyleSheet.create({
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 16,
    },
    mainCard: {
        marginBottom: 32,
        borderRadius: 24,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        marginBottom: 12,
        fontWeight: '800',
    },
    description: {
        lineHeight: 24,
        marginBottom: 24,
        opacity: 0.8,
    },
    infoGrid: {
        flexDirection: 'row',
        padding: 16,
        alignItems: 'center',
    },
    statusInfoItem: {
        flex: 1,
        alignItems: 'center',
    },
    infoLabel: {
        fontSize: 10,
        letterSpacing: 1,
        marginBottom: 4,
        fontWeight: '700',
    },
    verticalDivider: {
        width: 1,
        height: 30,
        opacity: 0.3,
    },
    actionHeader: {
        marginBottom: 20,
        paddingLeft: 4,
    },
    subtitle: {
        letterSpacing: 1.5,
        marginTop: 4,
        fontWeight: '700',
    },
    engineerList: {
        gap: 12,
    },
    engineerCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: 20,
    },
    engineerMain: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    avatar: {
        width: 44,
        height: 44,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    engineerText: {
        flex: 1,
    },
    dispatchBtn: {
        height: 38,
        minWidth: 90,
        borderRadius: 12,
    },
});