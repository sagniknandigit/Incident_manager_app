import React, { useState } from 'react';
import { ScrollView, RefreshControl } from 'react-native';
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
import { useTheme } from '../../hooks/useTheme';
import { VStack, Box, HStack } from '@gluestack-ui/themed';

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

  const renderDashboardCard = (title: string, description: string, icon: string, onPress?: () => void) => (
    <Card
      onPress={onPress}
      variant="elevated"
      padding="md"
      style={{ marginBottom: 12, borderRadius: 16 }}
    >
      <HStack sx={{ alignItems: 'center', gap: '$4' }}>
        <Box
          sx={{
            w: 50,
            h: 50,
            borderRadius: '$md',
            justifyContent: 'center',
            alignItems: 'center',
            bg: colors.primary + '10'
          } as any}
        >
          <Typography variant="h2" style={{ fontSize: 24 }}>{icon}</Typography>
        </Box>
        <VStack sx={{ flex: 1, gap: '$1' }}>
          <Typography variant="h3" color={colors.textPrimary}>{title}</Typography>
          <Typography variant="caption" color={colors.textSecondary}>{description}</Typography>
        </VStack>
        <Typography variant="h3" color={colors.primary} style={{ opacity: 0.5 }}>→</Typography>
      </HStack>
    </Card>
  );

  const renderQuickStats = () => (
    <Card variant="elevated" padding="none" style={{ borderRadius: 16, marginBottom: 24 }}>
      <HStack sx={{ py: '$4', px: '$2', justifyContent: 'space-around', alignItems: 'center' } as any}>
        <VStack sx={{ alignItems: 'center' }}>
          <Typography variant="h2" color={colors.primary}>12</Typography>
          <Typography variant="caption" color={colors.textSecondary}>TOTAL</Typography>
        </VStack>
        <Box sx={{ w: 1, h: 30, bg: colors.border } as any} />
        <VStack sx={{ alignItems: 'center' }}>
          <Typography variant="h2" color={colors.warning}>4</Typography>
          <Typography variant="caption" color={colors.textSecondary}>PENDING</Typography>
        </VStack>
        <Box sx={{ w: 1, h: 30, bg: colors.border } as any} />
        <VStack sx={{ alignItems: 'center' }}>
          <Typography variant="h2" color={colors.success}>8</Typography>
          <Typography variant="caption" color={colors.textSecondary}>RESOLVED</Typography>
        </VStack>
      </HStack>
    </Card>
  );

  return (
    <Layout>
      <Header
        title="Incident Manager"
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
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
        showsVerticalScrollIndicator={false}
      >
        <VStack sx={{ mt: '$5', mb: '$6', gap: '$1' } as any}>
          <Typography variant="body" color={colors.textSecondary} style={{ fontWeight: '600' }}>
            WELCOME BACK,
          </Typography>
          <HStack sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h1" color={colors.textPrimary}>
              {user?.name.split(' ')[0]}
            </Typography>
            <Box sx={{ px: '$3', py: '$1', borderRadius: '$full', bg: colors.primary + '20' } as any}>
              <Typography variant="caption" color={colors.primary} style={{ fontWeight: '700' }}>
                {user?.role}
              </Typography>
            </Box>
          </HStack>
        </VStack>

        {renderQuickStats()}

        <VStack sx={{ gap: '$4' }}>
          <Typography variant="subtitle" color={colors.textPrimary} style={{ fontWeight: '700' }}>
            Quick Actions
          </Typography>

          <VStack>
            {user?.role === 'REPORTER' && (
              <>
                {renderDashboardCard('Report Incident', 'Create a new maintenance request', '📢', () => navigation.navigate('CreateIncident'))}
                {renderDashboardCard('My Reports', 'Track status of your submissions', '📁', () => navigation.navigate('MyIncidents'))}
              </>
            )}

            {user?.role === 'ENGINEER' && (
              <>
                {renderDashboardCard('Assigned Tasks', 'View tickets assigned to you', '🛠️', () => navigation.navigate('AssignedIncidents'))}
                {renderDashboardCard('Work History', 'Check your completed activities', '📜', () => navigation.navigate('IncidentList'))}
              </>
            )}

            {user?.role === 'MANAGER' && (
              <>
                {renderDashboardCard('Incident Feed', 'Real-time overview of system activity', '📡', () => navigation.navigate('IncidentList'))}
                {renderDashboardCard('Analytics', 'Performance and trend analysis', '📊', () => navigation.navigate('StatsDashboard'))}
              </>
            )}
          </VStack>
        </VStack>

        <Box sx={{ mt: '$6', p: '$4', borderRadius: '$md', bg: colors.surfaceHighlight, alignItems: 'center' } as any}>
          <Typography variant="caption" color={colors.textSecondary} align="center">
            Need help? Contact support at ext. 404
          </Typography>
        </Box>
      </ScrollView>
    </Layout>
  );
}
