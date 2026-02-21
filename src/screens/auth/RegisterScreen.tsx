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
import { Header } from '../../components/ui/Header';
import { useTheme } from '../../hooks/useTheme';

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
        <ScrollView contentContainerStyle={[styles.contentContainer, { paddingBottom: theme.spacing.xxl }]} showsVerticalScrollIndicator={false}>
          <View style={[styles.header, { marginBottom: theme.spacing.xl }]}>
            <Typography variant="h1" align="center" style={[styles.title, { marginBottom: theme.spacing.sm }]} color={colors.primary}>
              Create Account
            </Typography>
            <Typography variant="body" color={colors.textSecondary} align="center">
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

            <View style={[styles.roleContainer, { marginBottom: theme.spacing.md }]}>
              <Typography variant="caption" color={colors.textSecondary} style={[styles.roleLabel, { marginBottom: theme.spacing.sm, marginLeft: theme.spacing.xs }]}>
                Select Role
              </Typography>
              <View style={[styles.roleButtons, { gap: theme.spacing.xs }]}>
                {(['REPORTER', 'ENGINEER', 'MANAGER'] as const).map((r) => (
                  <Button
                    key={r}
                    title={r}
                    variant={role === r ? 'primary' : 'secondary'}
                    onPress={() => setRole(r)}
                    style={[styles.roleButton, role !== r ? { opacity: 0.7 } : undefined] as any}
                  />
                ))}
              </View>
            </View>

            {error ? (
              <Typography style={[styles.error, { marginBottom: theme.spacing.md }]} color={colors.error}>
                {error}
              </Typography>
            ) : null}

            <View style={[styles.spacer, { height: theme.spacing.md }]} />

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
              style={[styles.secondaryButton, { marginTop: theme.spacing.sm }] as any}
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
  },
  header: {
  },
  title: {
  },
  form: {
    width: '100%',
  },
  error: {
    textAlign: 'center',
  },
  spacer: {
  },
  secondaryButton: {
  },
  roleContainer: {
  },
  roleLabel: {
    fontWeight: '600',
  },
  roleButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  roleButton: {
    flex: 1,
    height: 40,
    paddingHorizontal: 0,
  },
});