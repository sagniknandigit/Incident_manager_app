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
import { Header } from '../../components/ui/Header';
import { useTheme } from '../../hooks/useTheme';

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
        <ScrollView contentContainerStyle={[styles.contentContainer, { paddingBottom: theme.spacing.xxl }]}>
          <View style={[styles.header, { marginBottom: theme.spacing.xl }]}>
            <Typography variant="h1" align="center" style={[styles.title, { marginBottom: theme.spacing.sm }]} color={colors.primary}>
              Welcome Back
            </Typography>
            <Typography variant="body" color={colors.textSecondary} align="center">
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
              <Typography style={[styles.error, { marginBottom: theme.spacing.md }]} color={colors.error}>
                {error}
              </Typography>
            ) : null}

            <View style={[styles.spacer, { height: theme.spacing.md }]} />

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
});
