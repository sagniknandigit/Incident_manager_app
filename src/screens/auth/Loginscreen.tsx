import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Image } from 'react-native';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginApi } from '../../api/authApi';
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

export default function LoginScreen() {
  const dispatch = useDispatch();
  const navigation = useNavigation<any>();
  const { colors, theme } = useTheme();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await loginApi(email, password);
      const { token, user } = response.data;
      await AsyncStorage.setItem('token', token);
      dispatch(loginSuccess({ user, token }));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Header title="" showThemeToggle />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={[styles.contentContainer, { paddingBottom: theme.spacing.xxl }]}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.brandingContainer}>
            <Card variant="glass" padding="none" style={styles.logoWrapper as any}>
              <Image
                source={require('../../assets/images/logo.png')}
                style={styles.logo}
              />
            </Card>
            <Typography variant="h1" align="center" style={styles.title} color={colors.textPrimary}>
              Welcome <Typography variant="h1" color={colors.primary}>Back</Typography>
            </Typography>
            <Typography variant="body" color={colors.textSecondary} align="center" style={styles.subtitle}>
              Secure access to the Incident Management portal
            </Typography>
          </View>

          <View style={styles.form}>
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

            {error ? (
              <View style={[styles.errorContainer, { backgroundColor: colors.error + '10' }]}>
                <Typography variant="caption" color={colors.error} align="center">
                  {error}
                </Typography>
              </View>
            ) : null}

            <View style={{ height: theme.spacing.lg }} />

            <Button
              title="Sign In"
              onPress={handleLogin}
              loading={loading}
              variant="primary"
            />

            <View style={styles.footer}>
              <Typography variant="caption" color={colors.textSecondary}>
                Don't have an account?{' '}
                <Typography
                  variant="caption"
                  color={colors.primary}
                  style={{ fontWeight: '700' }}
                  onPress={() => navigation.navigate('Register')}
                >
                  Create one
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
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  brandingContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logoWrapper: {
    width: 80,
    height: 80,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  logo: {
    width: '60%',
    height: '60%',
    resizeMode: 'contain',
  },
  title: {
    fontSize: 28,
    marginBottom: 8,
  },
  subtitle: {
    opacity: 0.7,
    maxWidth: '80%',
  },
  form: {
    width: '100%',
  },
  errorContainer: {
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  footer: {
    marginTop: 24,
    alignItems: 'center',
  },
});
