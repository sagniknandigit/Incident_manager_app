import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
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
import { theme } from '../../theme/theme';

export default function LoginScreen() {
  const dispatch = useDispatch();
  const navigation = useNavigation<any>();

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
      dispatch(loginSuccess(user));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <View style={styles.header}>
          <Typography variant="h1" align="center" style={styles.title}>
            Welcome Back
          </Typography>
          <Typography variant="body" color={theme.colors.textSecondary} align="center">
            Sign in to manage incidents
          </Typography>
        </View>

        <View style={styles.form}>
          <Input
            label="Email"
            placeholder="enter@email.com"
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
            <Typography style={styles.error} color={theme.colors.error}>
              {error}
            </Typography>
          ) : null}

          <Button
            title="Sign In"
            onPress={handleLogin}
            loading={loading}
            style={styles.button}
          />

          <Button
            title="Don't have an account? Sign Up"
            onPress={() => navigation.navigate('Register')}
            variant="ghost"
            style={styles.secondaryButton}
          />
        </View>
      </KeyboardAvoidingView>
    </Layout>
  );
}

const styles = StyleSheet.create({
  keyboardAvoid: {
    flex: 1,
    justifyContent: 'center',
  },
  header: {
    marginBottom: theme.spacing.xl,
  },
  title: {
    marginBottom: theme.spacing.sm,
  },
  form: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.xl,
    ...theme.shadows.md,
  },
  error: {
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  button: {
    marginTop: theme.spacing.md,
  },
  secondaryButton: {
    marginTop: theme.spacing.sm,
  },
});
