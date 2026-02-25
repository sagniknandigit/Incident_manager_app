import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { VStack, Box, Center, HStack, Pressable } from '@gluestack-ui/themed';
import { registerApi } from '../../api/authApi';
import { loginSuccess } from '../../redux/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Layout } from '../../components/ui/Layout';
import { Typography } from '../../components/ui/Typography';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Header } from '../../components/ui/Header';
import { Card } from '../../components/ui/Card';
import { useTheme } from '../../hooks/useTheme';
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';

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
      <Header title="Create Account" showBack />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        >
          <VStack sx={{ gap: '$6', mt: '$4' }}>
            <Card variant="elevated" padding="lg" style={{ borderRadius: 20 }}>
              <VStack sx={{ gap: '$4' }}>
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

                <Box sx={{ mt: '$2' }}>
                  <Typography variant="caption" color={colors.textSecondary} style={{ fontWeight: '700', marginBottom: 8 }}>
                    SELECT ROLE
                  </Typography>
                  <HStack sx={{ gap: '$2' }}>
                    {(['REPORTER', 'ENGINEER', 'MANAGER'] as const).map((r) => (
                      <Pressable
                        key={r}
                        onPress={() => setRole(r)}
                        sx={{ flex: 1 }}
                      >
                        <Box
                          sx={{
                            p: '$2',
                            borderRadius: '$md',
                            borderWidth: 1,
                            borderColor: role === r ? colors.primary : colors.border,
                            bg: role === r ? colors.primary + '10' : 'transparent',
                            alignItems: 'center'
                          }}
                        >
                          <Typography
                            variant="caption"
                            style={{ fontWeight: role === r ? '700' : '400', color: role === r ? colors.primary : colors.textPrimary }}
                          >
                            {r}
                          </Typography>
                        </Box>
                      </Pressable>
                    ))}
                  </HStack>
                </Box>

                {error ? (
                  <Box sx={{ bg: colors.error + '15', p: '$3', borderRadius: '$md' }}>
                    <Typography variant="caption" color={colors.error} align="center">
                      {error}
                    </Typography>
                  </Box>
                ) : null}

                <Button
                  title="Sign Up"
                  onPress={handleRegister}
                  loading={loading}
                  style={{ marginTop: 8 }}
                />
              </VStack>
            </Card>

            <Center>
              <Pressable onPress={() => navigation.navigate('Login')}>
                <HStack sx={{ gap: '$2', alignItems: 'center' }}>
                  <Typography variant="caption" color={colors.textSecondary}>
                    Already have an account?
                  </Typography>
                  <Typography variant="caption" color={colors.primary} style={{ fontWeight: '700' }}>
                    Login
                  </Typography>
                </HStack>
              </Pressable>
            </Center>
          </VStack>
        </ScrollView>
      </KeyboardAvoidingView>
    </Layout>
  );
}