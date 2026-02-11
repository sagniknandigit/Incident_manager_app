import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
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
import { theme } from '../../theme/theme';
import { Header } from '../../components/ui/Header';

export default function RegisterScreen() {
  const dispatch = useDispatch();
  const navigation = useNavigation<any>();

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
      <Header title="" showBack />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Typography variant="h1" align="center" style={styles.title} color={theme.colors.primary}>
              Create Account
            </Typography>
            <Typography variant="body" color={theme.colors.textSecondary} align="center">
              Join to report and manage incidents
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

            <View style={styles.roleContainer}>
              <Typography variant="caption" color={theme.colors.textSecondary} style={styles.roleLabel}>
                Select Role
              </Typography>
              <View style={styles.roleButtons}>
                {(['REPORTER', 'ENGINEER', 'MANAGER'] as const).map((r) => (
                  <Button
                    key={r}
                    title={r}
                    variant={role === r ? 'primary' : 'secondary'}
                    onPress={() => setRole(r)}
                    style={[styles.roleButton, role !== r ? { opacity: 0.7 } : undefined]}
                  />
                ))}
              </View>
            </View>

            {error ? (
              <Typography style={styles.error} color={theme.colors.error}>
                {error}
              </Typography>
            ) : null}

            <View style={styles.spacer} />

            <Button
              title="Sign Up"
              onPress={handleRegister}
              loading={loading}
              variant="primary"
            />

            <Button
              title="Already have an account? Sign In"
              onPress={() => navigation.navigate('Login')}
              variant="ghost"
              style={styles.secondaryButton}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Layout>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingBottom: theme.spacing.xxl,
  },
  header: {
    marginBottom: theme.spacing.xl,
  },
  title: {
    marginBottom: theme.spacing.sm,
  },
  form: {
    width: '100%',
  },
  error: {
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  spacer: {
    height: theme.spacing.md,
  },
  secondaryButton: {
    marginTop: theme.spacing.sm,
  },
  roleContainer: {
    marginBottom: theme.spacing.md,
  },
  roleLabel: {
    marginBottom: theme.spacing.sm,
    marginLeft: theme.spacing.xs,
    fontWeight: '600',
  },
  roleButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: theme.spacing.xs,
  },
  roleButton: {
    flex: 1,
    height: 40,
    paddingHorizontal: 0,
  },
});