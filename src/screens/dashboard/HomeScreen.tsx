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

  const renderDashboardCard = (title: string, description: string, onPress?: () => void, variant: 'primary' | 'secondary' = 'primary') => (
    <Card
      style={[
        styles.card,
        { backgroundColor: variant === 'primary' ? colors.primary : colors.surface }
      ] as any}
      onPress={onPress}
      variant="elevated"
    >
      <View style={styles.cardContent}>
        <View style={{ flex: 1 }}>
          <Typography variant="h3" style={[styles.cardTitle, { color: variant === 'primary' ? colors.textInverse : colors.textPrimary }]}>{title}</Typography>
          <Typography variant="body" color={variant === 'primary' ? colors.textInverse : colors.textSecondary} style={{ opacity: 0.9 }}>{description}</Typography>
        </View>
        <View style={[styles.arrowIcon, { backgroundColor: variant === 'primary' ? 'rgba(255,255,255,0.2)' : colors.surfaceHighlight }]}>
          <Typography variant="h3" color={variant === 'primary' ? colors.textInverse : colors.primary}>→</Typography>
        </View>
      </View>
    </Card>
  );

  const renderQuickStats = () => (
    <View style={[styles.statsRow, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={styles.statItem}>
        <Typography variant="h2" color={colors.primary}>12</Typography>
        <Typography variant="caption" color={colors.textSecondary}>Total</Typography>
      </View>
      <View style={styles.statItem}>
        <Typography variant="h2" color={colors.warning}>4</Typography>
        <Typography variant="caption" color={colors.textSecondary}>Pending</Typography>
      </View>
      <View style={styles.statItem}>
        <Typography variant="h2" color={colors.success}>8</Typography>
        <Typography variant="caption" color={colors.textSecondary}>Resolved</Typography>
      </View>
    </View>
  );

  return (
    <Layout>
      <Header
        title="Dashboard"
        rightAction={
          <Button
            title="Logout"
            variant="ghost"
            onPress={handleLogout}
            style={{ height: 36, paddingHorizontal: 0 }}
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
            <Typography variant="body" color={colors.textSecondary}>Welcome back,</Typography>
            <Typography variant="h1" color={colors.textPrimary} style={styles.userName}>{user?.name}</Typography>
          </View>
          <View style={[styles.roleBadge, { backgroundColor: colors.primary + '15', borderColor: colors.primary + '30' }]}>
            <Typography variant="caption" color={colors.primary} style={styles.roleText}>
              {user?.role}
            </Typography>
          </View>
        </View>

        {renderQuickStats()}

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Typography variant="subtitle" color={colors.textPrimary}>Quick Actions</Typography>
          </View>

          {user?.role === 'REPORTER' && (
            <>
              {renderDashboardCard('Report Incident', 'Create a new maintenance request', () => navigation.navigate('CreateIncident'), 'primary')}
              {renderDashboardCard('My Incidents', 'Track status of your reports', () => navigation.navigate('MyIncidents'), 'secondary')}
            </>
          )}

          {user?.role === 'ENGINEER' && (
            <>
              {renderDashboardCard('Assigned Tasks', 'View tickets assigned to you', () => navigation.navigate('AssignedIncidents'), 'primary')}
              {renderDashboardCard('Work History', 'View past completed work', () => navigation.navigate('IncidentList'), 'secondary')}
            </>
          )}

          {user?.role === 'MANAGER' && (
            <>
              {renderDashboardCard('All Incidents', 'Overview of all system activity', () => navigation.navigate('IncidentList'), 'primary')}
              {renderDashboardCard('Engineer Directory', 'Performance and availability', () => { }, 'secondary')}
            </>
          )}
        </View>
      </ScrollView>
    </Layout>
  );
}

const styles = StyleSheet.create({
  content: {
    // paddingBottom set dynamically
  },
  welcomeSection: {
    marginBottom: 24,
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userName: {
    marginTop: 2,
  },
  roleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
  },
  roleText: {
    fontWeight: '800',
    letterSpacing: 1,
    fontSize: 10,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 16,
    marginBottom: 32,
    borderWidth: 1,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  section: {
    marginBottom: 32,
    flex: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingLeft: 4,
  },
  card: {
    marginBottom: 16,
    borderWidth: 0,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardTitle: {
    marginBottom: 4,
  },
  arrowIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 16,
  },
});

