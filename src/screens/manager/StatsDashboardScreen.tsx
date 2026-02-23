import { View, StyleSheet, ActivityIndicator, ScrollView, Dimensions, Animated } from 'react-native';
import { useEffect, useState, useRef } from 'react';
import { Layout } from '../../components/ui/Layout';
import { Typography } from '../../components/ui/Typography';
import { Card } from '../../components/ui/Card';
import { Header } from '../../components/ui/Header';
import { useTheme } from '../../hooks/useTheme';
import { getIncidentStatsApi } from '../../api/incidentApi';
import { PieChart, BarChart } from 'react-native-chart-kit';

export default function StatsDashboardScreen() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const { colors, theme, isDark } = useTheme();
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
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            </Layout>
        );
    }

    const screenWidth = Dimensions.get('window').width;

    const pieData = [
        {
            name: 'Open',
            population: stats.OPEN,
            color: colors.error,
            legendFontColor: colors.textSecondary,
            legendFontSize: 12,
        },
        {
            name: 'Progress',
            population: stats.IN_PROGRESS,
            color: colors.warning,
            legendFontColor: colors.textSecondary,
            legendFontSize: 12,
        },
        {
            name: 'Resolved',
            population: stats.RESOLVED,
            color: colors.success,
            legendFontColor: colors.textSecondary,
            legendFontSize: 12,
        },
        {
            name: 'Closed',
            population: stats.CLOSED,
            color: colors.textDisabled,
            legendFontColor: colors.textSecondary,
            legendFontSize: 12,
        }
    ];

    const StatCard = ({ title, value, color, icon }: { title: string, value: number, color: string, icon: string }) => (
        <Card variant="glass" padding="md" style={styles.statCard as any}>
            <View style={[styles.iconContainer, { backgroundColor: color + '15' }]}>
                <Typography variant="h3">{icon}</Typography>
            </View>
            <View style={{ marginTop: 12 }}>
                <Typography variant="caption" color={colors.textSecondary} style={{ fontWeight: '700' }}>{title.toUpperCase()}</Typography>
                <Typography variant="h2" style={{ color: color }}>{value}</Typography>
            </View>
        </Card>
    );

    return (
        <Layout>
            <Header title="Mission Control" showBack />
            <ScrollView
                contentContainerStyle={[styles.scrollContent, { paddingBottom: theme.spacing.xxl }]}
                showsVerticalScrollIndicator={false}
            >
                <Animated.View style={{ opacity: fadeAnim }}>
                    <View style={styles.summaryGrid}>
                        <StatCard title="Total" value={stats.total} color={colors.primary} icon="📊" />
                        <StatCard title="Open" value={stats.OPEN} color={colors.error} icon="🚨" />
                        <StatCard title="Active" value={stats.IN_PROGRESS} color={colors.warning} icon="⚡" />
                        <StatCard title="Resolved" value={stats.RESOLVED} color={colors.success} icon="✅" />
                    </View>

                    <Card variant="elevated" padding="lg" style={styles.chartCard as any}>
                        <Typography variant="h3" style={{ marginBottom: 20 }}>Resolution Distribution</Typography>
                        <PieChart
                            data={pieData}
                            width={screenWidth - 64}
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

                    <Card variant="glass" padding="lg" style={styles.infoCard as any}>
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

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 8,
    },
    summaryGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 24,
    },
    statCard: {
        width: '48%',
        borderRadius: 24,
    },
    iconContainer: {
        width: 44,
        height: 44,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
    chartCard: {
        marginBottom: 24,
        borderRadius: 32,
    },
    infoCard: {
        borderRadius: 20,
        alignItems: 'center',
    },
});