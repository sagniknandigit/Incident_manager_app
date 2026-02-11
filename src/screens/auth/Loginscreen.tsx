import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
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
import { Header } from '../../components/ui/Header';

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
      dispatch(loginSuccess({ user, token }));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Header title="" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.contentContainer}>
          <View style={styles.header}>
            <Typography variant="h1" align="center" style={styles.title} color={theme.colors.primary}>
              Welcome Back
            </Typography>
            <Typography variant="body" color={theme.colors.textSecondary} align="center">
              Sign in to manage your incidents
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
              <Typography style={styles.error} color={theme.colors.error}>
                {error}
              </Typography>
            ) : null}

            <View style={styles.spacer} />

            <Button
              title="Sign In"
              onPress={handleLogin}
              loading={loading}
              variant="primary"
            />

            <Button
              title="Create an Account"
              onPress={() => navigation.navigate('Register')}
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
});
