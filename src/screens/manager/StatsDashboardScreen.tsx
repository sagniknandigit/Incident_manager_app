import { View, StyleSheet, ScrollView, Dimensions, Animated } from 'react-native';
import { useEffect, useState, useRef } from 'react';
import { Layout } from '../../components/ui/Layout';
import { Typography } from '../../components/ui/Typography';
import { Card } from '../../components/ui/Card';
import { Header } from '../../components/ui/Header';
import { useTheme } from '../../hooks/useTheme';
import { getIncidentStatsApi } from '../../api/incidentApi';
import { PieChart } from 'react-native-chart-kit';
import { VStack, HStack, Box, Center, Spinner } from '@gluestack-ui/themed';

export default function StatsDashboardScreen() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const { colors, theme } = useTheme();
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const res = await getIncidentStatsApi();
            setStats(res.data);
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }).start();
        } catch (error) {
            console.log('Failed to fetch stats', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Layout>
                <Header title="Analytics" showBack />
                <Center flex={1}>
                    <Spinner size="large" color={colors.primary} />
                </Center>
            </Layout>
        );
    }

    const screenWidth = Dimensions.get('window').width;

    const pieData = [
        {
            name: 'Open',
            population: stats.OPEN || 0,
            color: colors.error,
            legendFontColor: colors.textSecondary,
            legendFontSize: 12,
        },
        {
            name: 'Progress',
            population: stats.IN_PROGRESS || 0,
            color: colors.warning,
            legendFontColor: colors.textSecondary,
            legendFontSize: 12,
        },
        {
            name: 'Resolved',
            population: stats.RESOLVED || 0,
            color: colors.success,
            legendFontColor: colors.textSecondary,
            legendFontSize: 12,
        },
        {
            name: 'Closed',
            population: stats.CLOSED || 0,
            color: colors.textDisabled,
            legendFontColor: colors.textSecondary,
            legendFontSize: 12,
        }
    ];

    const StatCard = ({ title, value, color, icon }: { title: string, value: number, color: string, icon: string }) => (
        <Card variant="glass" padding="md" style={{ width: '48%', borderRadius: 24 }}>
            <Box
                sx={{
                    width: 44,
                    height: 44,
                    borderRadius: 14,
                    justifyContent: 'center',
                    alignItems: 'center',
                    bg: color + '15'
                } as any}
            >
                <Typography variant="h3">{icon}</Typography>
            </Box>
            <VStack sx={{ mt: '$3' } as any}>
                <Typography variant="caption" color={colors.textSecondary} style={{ fontWeight: '700', letterSpacing: 0.5 }}>
                    {title.toUpperCase()}
                </Typography>
                <Typography variant="h2" style={{ color: color, fontSize: 24 }}>{value}</Typography>
            </VStack>
        </Card >
    );

    return (
        <Layout>
            <Header title="Mission Control" showBack />
            <ScrollView
                contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 40 }}
                showsVerticalScrollIndicator={false}
            >
                <Animated.View style={{ opacity: fadeAnim }}>
                    <HStack sx={{ flexWrap: 'wrap', gap: '$3', mb: '$6' } as any}>
                        <StatCard title="Total" value={stats.total} color={colors.primary} icon="📊" />
                        <StatCard title="Open" value={stats.OPEN} color={colors.error} icon="🚨" />
                        <StatCard title="Active" value={stats.IN_PROGRESS} color={colors.warning} icon="⚡" />
                        <StatCard title="Resolved" value={stats.RESOLVED} color={colors.success} icon="✅" />
                    </HStack>

                    <Card variant="elevated" padding="lg" style={{ marginBottom: 24, borderRadius: 32, overflow: 'hidden' }}>
                        <Typography variant="h3" style={{ marginBottom: 20, fontWeight: '700' }}>Resolution Distribution</Typography>
                        <PieChart
                            data={pieData}
                            width={screenWidth - 72}
                            height={220}
                            chartConfig={{
                                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                labelColor: (opacity = 1) => colors.textPrimary,
                            }}
                            accessor="population"
                            backgroundColor="transparent"
                            paddingLeft="15"
                            absolute
                        />
                    </Card>

                    <Card variant="glass" padding="lg" style={{ borderRadius: 20, alignItems: 'center' }}>
                        <Typography variant="body" color={colors.textSecondary}>
                            System Health: <Typography variant="body" style={{ color: colors.success, fontWeight: '700' }}>
                                {((stats.RESOLVED / (stats.total || 1)) * 100).toFixed(1)}% Efficiency
                            </Typography>
                        </Typography>
                    </Card>
                </Animated.View>
            </ScrollView>
        </Layout>
    );
}