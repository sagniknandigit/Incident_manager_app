import { View, StyleSheet, ScrollView } from 'react-native';
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

export default function HomeScreen() {
  const dispatch = useDispatch();
  const navigation = useNavigation<any>();
  const user = useSelector((state: RootState) => state.auth.user);

  const checkToken = async () => {
    const token = await AsyncStorage.getItem('token');
    alert(token ? `Token found: ${token.substring(0, 10)}...` : 'NO TOKEN FOUND');
  };

  const handleLogout = async () => {
    const token = await AsyncStorage.getItem('token');
    alert(token ? `Token found: ${token.substring(0, 10)}...` : 'NO TOKEN FOUND');
    await AsyncStorage.removeItem('token');
    dispatch(logout());
  };

  const renderDashboardCard = (title: string, description: string, onPress?: () => void) => (
    <Card style={styles.card} onPress={onPress}>
      <Typography variant="h3" style={styles.cardTitle}>{title}</Typography>
      <Typography variant="body" color={theme.colors.textSecondary}>{description}</Typography>
    </Card>
  );

  return (
    <Layout>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View>
            <Typography variant="caption" color={theme.colors.textSecondary}>Welcome back,</Typography>
            <Typography variant="h2">{user?.name}</Typography>
          </View>
          <View style={styles.roleBadge}>
            <Typography variant="caption" color={theme.colors.primary} style={styles.roleText}>
              {user?.role}
            </Typography>
          </View>
        </View>

        <View style={styles.section}>
          <Typography variant="h3" style={styles.sectionTitle}>Overview</Typography>

          {user?.role === 'REPORTER' && (
            <>
              {renderDashboardCard('Report Incident', 'Create a new maintenance request', () => navigation.navigate('CreateIncident'))}
              {renderDashboardCard('My Incidents', 'Track status of your reports', () => navigation.navigate('IncidentList'))}
            </>
          )}

          {user?.role === 'ENGINEER' && (
            <>
              {renderDashboardCard('Assigned Tasks', 'View tickets assigned to you', () => navigation.navigate('IncidentList'))}
              {renderDashboardCard('Resolved History', 'View past completed work', () => navigation.navigate('IncidentList'))}
            </>
          )}

          {user?.role === 'MANAGER' && (
            <>
              {renderDashboardCard('All Incidents', 'Overview of all system activity', () => navigation.navigate('IncidentList'))}
              {renderDashboardCard('Team Stats', 'Performance metrics', () => { })}
            </>
          )}
        </View>

        <View style={styles.footer}>
          <Button
            title="DEBUG: Check Token"
            onPress={checkToken}
            variant="secondary"
            style={[styles.logoutBtn, { marginBottom: 10 }]}
          />
          <Button
            title="Sign Out"
            onPress={handleLogout}
            variant="ghost"
            style={styles.logoutBtn}
          />
        </View>
      </ScrollView>
    </Layout>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingVertical: theme.spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  roleBadge: {
    backgroundColor: theme.colors.surfaceHighlight,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: 999,
  },
  roleText: {
    fontWeight: '600',
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    marginBottom: theme.spacing.md,
  },
  card: {
    marginBottom: theme.spacing.md,
  },
  cardTitle: {
    marginBottom: theme.spacing.xs,
    color: theme.colors.primary,
  },
  footer: {
    marginTop: 'auto',
  },
  logoutBtn: {
    alignSelf: 'center',
  },
});
