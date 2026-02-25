import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { VStack, Box, Center, HStack, Pressable } from '@gluestack-ui/themed';
import { loginApi } from '../../api/authApi';
import { loginSuccess } from '../../redux/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Layout } from '../../components/ui/Layout';
import { Typography } from '../../components/ui/Typography';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { useTheme } from '../../hooks/useTheme';

const LoginScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation<any>();
  const { colors } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await loginApi(email, password);
      const { user, token } = response.data;

      // CRITICAL FIX: Save token to storage for API headers
      await AsyncStorage.setItem('token', token);

      dispatch(loginSuccess({ user, token }));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Center flex={1} px="$4">
        <VStack w="100%" maxWidth={400} sx={{ gap: '$6' }}>
          <Box alignItems="center">
            <Typography variant="h1" align="center" style={{ fontSize: 40, marginBottom: 8 }}>🛡️</Typography>
            <Typography variant="h1" align="center">Incident Manager</Typography>
            <Typography variant="body" color={colors.textSecondary} align="center">
              Sign in to continue
            </Typography>
          </Box>

          <Card variant="elevated" padding="lg" style={{ borderRadius: 20 }}>
            <VStack sx={{ gap: '$4' }}>
              <Input
                label="Email"
                placeholder="name@company.com"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />

              <Input
                label="Password"
                placeholder="••••••••"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />

              {error ? (
                <Box sx={{ bg: colors.error + '15', p: '$3', borderRadius: '$md' }}>
                  <Typography variant="caption" color={colors.error} align="center">
                    {error}
                  </Typography>
                </Box>
              ) : null}

              <Button
                title="Login"
                onPress={handleLogin}
                loading={loading}
                style={{ marginTop: 8 }}
              />

              <Box sx={{ mt: '$2' }} alignItems="center">
                <Pressable onPress={() => navigation.navigate('Register')}>
                  <HStack sx={{ gap: '$2', alignItems: 'center' }}>
                    <Typography variant="caption" color={colors.textSecondary}>
                      Don't have an account?
                    </Typography>
                    <Typography variant="caption" color={colors.primary} style={{ fontWeight: '700' }}>
                      Register
                    </Typography>
                  </HStack>
                </Pressable>
              </Box>
            </VStack>
          </Card>
        </VStack>
      </Center>
    </Layout>
  );
};

export default LoginScreen;