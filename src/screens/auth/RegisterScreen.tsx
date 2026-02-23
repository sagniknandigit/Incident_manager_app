import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Image } from 'react-native';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { registerApi } from '../../api/authApi';
import { loginSuccess } from '../../redux/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { Layout } from '../../components/ui/Layout';
import { Typography } from '../../components/ui/Typography';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Header } from '../../components/ui/Header';
import { useTheme } from '../../hooks/useTheme';
import { Card } from '../../components/ui/Card';

export default function RegisterScreen() {
  const dispatch = useDispatch();
  const navigation = useNavigation<any>();
  const { colors, theme } = useTheme();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'REPORTER' | 'ENGINEER' | 'MANAGER'>('REPORTER');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await registerApi(name, email, password, role);
      const { token, user } = response.data;
      await AsyncStorage.setItem('token', token);
      dispatch(loginSuccess({ user, token }));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Header title="" showBack showThemeToggle />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={[styles.contentContainer, { paddingBottom: theme.spacing.xxl }]}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.brandingContainer}>
            <Typography variant="h1" align="center" style={styles.title} color={colors.textPrimary}>
              Create <Typography variant="h1" color={colors.primary}>Account</Typography>
            </Typography>
            <Typography variant="body" color={colors.textSecondary} align="center" style={styles.subtitle}>
              Join the team to report and resolve incidents quickly
            </Typography>
          </View>

          <View style={styles.form}>
            <Input
              label="Full Name"
              placeholder="John Doe"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />

            <Input
              label="Email Address"
              placeholder="name@company.com"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />

            <Input
              label="Password"
              placeholder="••••••••"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />

            <View style={styles.roleSection}>
              <Typography variant="caption" color={colors.textSecondary} style={styles.roleLabel}>
                SELECT YOUR ROLE
              </Typography>
              <Card variant="glass" padding="none" style={styles.roleCard as any}>
                <View style={styles.roleButtons}>
                  {(['REPORTER', 'ENGINEER', 'MANAGER'] as const).map((r) => (
                    <Button
                      key={r}
                      title={r}
                      variant={role === r ? 'primary' : 'ghost'}
                      onPress={() => setRole(r)}
                      style={styles.roleButton}
                      fullWidth={false}
                    />
                  ))}
                </View>
              </Card>
            </View>

            {error ? (
              <View style={[styles.errorContainer, { backgroundColor: colors.error + '10' }]}>
                <Typography variant="caption" color={colors.error} align="center">
                  {error}
                </Typography>
              </View>
            ) : null}

            <View style={{ height: theme.spacing.lg }} />

            <Button
              title="Verify & Create Account"
              onPress={handleRegister}
              loading={loading}
              variant="primary"
            />

            <View style={styles.footer}>
              <Typography variant="caption" color={colors.textSecondary}>
                Already have an account?{' '}
                <Typography
                  variant="caption"
                  color={colors.primary}
                  style={{ fontWeight: '700' }}
                  onPress={() => navigation.navigate('Login')}
                >
                  Sign In
                </Typography>
              </Typography>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Layout>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  brandingContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    marginBottom: 8,
  },
  subtitle: {
    opacity: 0.7,
    maxWidth: '85%',
  },
  form: {
    width: '100%',
  },
  roleSection: {
    marginBottom: 24,
  },
  roleLabel: {
    marginBottom: 12,
    marginLeft: 2,
    fontWeight: '700',
    letterSpacing: 1,
    fontSize: 11,
  },
  roleCard: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  roleButtons: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
    padding: 4,
  },
  roleButton: {
    flex: 1,
    height: 44,
    borderRadius: 12,
  },
  errorContainer: {
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  footer: {
    marginTop: 24,
    marginBottom: 40,
    alignItems: 'center',
  },
});