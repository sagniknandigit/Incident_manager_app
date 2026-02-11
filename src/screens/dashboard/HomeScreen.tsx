import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../redux/store';
import { logout } from '../../redux/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Layout } from '../../components/ui/Layout';
import { Typography } from '../../components/ui/Typography';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { theme } from '../../theme/theme';
import { useNavigation } from '@react-navigation/native';
import { Header } from '../../components/ui/Header';
import { useState } from 'react';

export default function HomeScreen() {
  const dispatch = useDispatch();
  const navigation = useNavigation<any>();
  const user = useSelector((state: RootState) => state.auth.user);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate refresh for now, or fetch fresh user data
    setTimeout(() => setRefreshing(false), 1000);
  };

  const checkToken = async () => {
    const token = await AsyncStorage.getItem('token');
    alert(token ? `Token found: ${token.substring(0, 10)}...` : 'NO TOKEN FOUND');
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    dispatch(logout());
  };

  const renderDashboardCard = (title: string, description: string, onPress?: () => void, variant: 'primary' | 'secondary' = 'primary') => (
    <Card
      style={[styles.card, variant === 'primary' ? styles.cardPrimary : undefined] as any}
      onPress={onPress}
      variant="elevated"
    >
      <View style={styles.cardContent}>
        <View style={{ flex: 1 }}>
          <Typography variant="h3" style={[styles.cardTitle, variant === 'primary' && { color: theme.colors.textInverse }]}>{title}</Typography>
          <Typography variant="body" color={variant === 'primary' ? theme.colors.textInverse : theme.colors.textSecondary} style={{ opacity: 0.9 }}>{description}</Typography>
        </View>
        <View style={[styles.arrowIcon, variant === 'primary' && { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
          <Typography variant="h3" color={variant === 'primary' ? theme.colors.textInverse : theme.colors.primary}>→</Typography>
        </View>
      </View>
    </Card>
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
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.colors.primary} />}
      >
        <View style={styles.welcomeSection}>
          <Typography variant="body" color={theme.colors.textSecondary}>Welcome back,</Typography>
          <Typography variant="h1" color={theme.colors.textPrimary} style={styles.userName}>{user?.name}</Typography>

          <View style={styles.roleBadge}>
            <Typography variant="caption" color={theme.colors.primary} style={styles.roleText}>
              {user?.role} ACCOUNT
            </Typography>
          </View>
        </View>

        <View style={styles.section}>
          <Typography variant="subtitle" color={theme.colors.textSecondary} style={styles.sectionTitle}>Overview</Typography>

          {user?.role === 'REPORTER' && (
            <>
              {renderDashboardCard('Report Incident', 'Create a new maintenance request', () => navigation.navigate('CreateIncident'), 'primary')}
              {renderDashboardCard('My Incidents', 'Track status of your reports', () => navigation.navigate('IncidentList'), 'secondary')}
            </>
          )}

          {user?.role === 'ENGINEER' && (
            <>
              {renderDashboardCard('Assigned Tasks', 'View tickets assigned to you', () => navigation.navigate('IncidentList'), 'primary')}
              {renderDashboardCard('Resolved History', 'View past completed work', () => navigation.navigate('IncidentList'), 'secondary')}
            </>
          )}

          {user?.role === 'MANAGER' && (
            <>
              {renderDashboardCard('All Incidents', 'Overview of all system activity', () => navigation.navigate('IncidentList'), 'primary')}
              {renderDashboardCard('Team Stats', 'Performance metrics', () => { }, 'secondary')}
            </>
          )}
        </View>

        {/* <View style={styles.footer}>
          <Button
            title="DEBUG: Check Token"
            onPress={checkToken}
            variant="ghost"
            style={styles.debugBtn}
          />
        </View> */}
      </ScrollView>
    </Layout>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: theme.spacing.xxl,
  },
  welcomeSection: {
    marginBottom: theme.spacing.xl,
    marginTop: theme.spacing.sm,
  },
  userName: {
    marginBottom: theme.spacing.sm,
  },
  roleBadge: {
    backgroundColor: theme.colors.surfaceHighlight,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.round,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  roleText: {
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  section: {
    marginBottom: theme.spacing.xl,
    flex: 1,
  },
  sectionTitle: {
    marginBottom: theme.spacing.md,
    marginLeft: theme.spacing.xs,
  },
  card: {
    marginBottom: theme.spacing.md,
    borderWidth: 0,
    backgroundColor: theme.colors.surface,
  },
  cardPrimary: {
    backgroundColor: theme.colors.primary,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardTitle: {
    marginBottom: theme.spacing.xs,
    color: theme.colors.textPrimary,
  },
  arrowIcon: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.round,
    backgroundColor: theme.colors.surfaceHighlight,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: theme.spacing.md,
  },
  footer: {
    marginTop: theme.spacing.xl,
  },
  debugBtn: {
    opacity: 0.5,
  }
});
