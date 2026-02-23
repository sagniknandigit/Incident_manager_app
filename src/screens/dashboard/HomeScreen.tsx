import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../redux/store';
import { logout } from '../../redux/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Layout } from '../../components/ui/Layout';
import { Typography } from '../../components/ui/Typography';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useNavigation } from '@react-navigation/native';
import { Header } from '../../components/ui/Header';
import { useState } from 'react';
import { useTheme } from '../../hooks/useTheme';

export default function HomeScreen() {
  const dispatch = useDispatch();
  const navigation = useNavigation<any>();
  const user = useSelector((state: RootState) => state.auth.user);
  const [refreshing, setRefreshing] = useState(false);
  const { colors, theme } = useTheme();

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    dispatch(logout());
  };

  const renderDashboardCard = (title: string, description: string, icon: string, onPress?: () => void, variant: 'primary' | 'secondary' = 'primary') => (
    <Card
      style={styles.card as any}
      onPress={onPress}
      variant={variant === 'primary' ? 'elevated' : 'glass'}
      padding="lg"
    >
      <View style={styles.cardContent}>
        <View style={[styles.iconContainer, { backgroundColor: variant === 'primary' ? 'rgba(255,255,255,0.15)' : colors.primary + '10' }]}>
          <Typography variant="h2">{icon}</Typography>
        </View>
        <View style={{ flex: 1, marginLeft: 16 }}>
          <Typography
            variant="h3"
            style={{ color: variant === 'primary' ? colors.textInverse : colors.textPrimary, marginBottom: 4 }}
          >
            {title}
          </Typography>
          <Typography
            variant="caption"
            color={variant === 'primary' ? colors.textInverse : colors.textSecondary}
            style={{ opacity: 0.8 }}
          >
            {description}
          </Typography>
        </View>
        <Typography
          variant="h3"
          color={variant === 'primary' ? colors.textInverse : colors.primary}
          style={{ opacity: 0.5 }}
        >
          →
        </Typography>
      </View>
    </Card>
  );

  const renderQuickStats = () => (
    <View style={styles.statsContainer}>
      <Card variant="elevated" padding="none" style={{ borderRadius: 24 } as any}>
        <View style={[styles.statsRow, { backgroundColor: colors.surface }]}>
          <View style={styles.statItem}>
            <Typography variant="h2" color={colors.primary}>12</Typography>
            <Typography variant="caption" color={colors.textSecondary}>TOTAL</Typography>
          </View>
          <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
          <View style={styles.statItem}>
            <Typography variant="h2" color={colors.warning}>4</Typography>
            <Typography variant="caption" color={colors.textSecondary}>PENDING</Typography>
          </View>
          <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
          <View style={styles.statItem}>
            <Typography variant="h2" color={colors.success}>8</Typography>
            <Typography variant="caption" color={colors.textSecondary}>RESOLVED</Typography>
          </View>
        </View>
      </Card>
    </View>
  );

  return (
    <Layout>
      <Header
        title="Command Center"
        rightAction={
          <Button
            title="Logout"
            variant="ghost"
            onPress={handleLogout}
            style={{ height: 36, paddingHorizontal: 0 }}
            fullWidth={false}
          />
        }
      />
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: theme.spacing.xxl }]}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.welcomeSection}>
          <View>
            <Typography variant="body" color={colors.textSecondary} style={{ letterSpacing: 1, fontWeight: '600' }}>
              GOOD MORNING,
            </Typography>
            <Typography variant="h1" color={colors.textPrimary} style={styles.userName}>
              {user?.name.split(' ')[0]}
            </Typography>
          </View>
          <View style={[styles.roleBadge, { backgroundColor: colors.primary, borderColor: colors.primary }]}>
            <Typography variant="caption" color={colors.textInverse} style={styles.roleText}>
              {user?.role}
            </Typography>
          </View>
        </View>

        {renderQuickStats()}

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Typography variant="subtitle" color={colors.textPrimary} style={{ fontWeight: '700' }}>Quick Actions</Typography>
          </View>

          {user?.role === 'REPORTER' && (
            <>
              {renderDashboardCard('Report Incident', 'Create a new maintenance request', '📢', () => navigation.navigate('CreateIncident'), 'primary')}
              {renderDashboardCard('My Reports', 'Track status of your submissions', '📁', () => navigation.navigate('MyIncidents'), 'secondary')}
            </>
          )}

          {user?.role === 'ENGINEER' && (
            <>
              {renderDashboardCard('Assigned Tasks', 'View tickets assigned to you', '🛠️', () => navigation.navigate('AssignedIncidents'), 'primary')}
              {renderDashboardCard('Work History', 'Check your completed activities', '📜', () => navigation.navigate('IncidentList'), 'secondary')}
            </>
          )}

          {user?.role === 'MANAGER' && (
            <>
              {renderDashboardCard('Incident Feed', 'Real-time overview of system activity', '📡', () => navigation.navigate('IncidentList'), 'primary')}
              {renderDashboardCard('Analytics', 'Performance and trend analysis', '📊', () => navigation.navigate('StatsDashboard'), 'secondary')}
            </>
          )}
        </View>

        <Card variant="glass" style={styles.infoBox as any}>
          <Typography variant="caption" color={colors.textSecondary} align="center">
            Need help? Contact the support desk at ext. 404
          </Typography>
        </Card>
      </ScrollView>
    </Layout>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 4,
  },
  welcomeSection: {
    marginBottom: 32,
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  userName: {
    marginTop: 4,
  },
  roleBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  roleText: {
    fontWeight: '800',
    letterSpacing: 1,
    fontSize: 10,
  },
  statsContainer: {
    marginBottom: 32,
    paddingHorizontal: 8,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: 30,
    opacity: 0.5,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  section: {
    marginBottom: 32,
    paddingHorizontal: 8,
  },
  sectionHeader: {
    marginBottom: 20,
    paddingLeft: 4,
  },
  card: {
    marginBottom: 16,
    borderRadius: 24,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 54,
    height: 54,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoBox: {
    marginHorizontal: 8,
    paddingVertical: 12,
    borderRadius: 16,
    marginTop: 8,
  }
});

