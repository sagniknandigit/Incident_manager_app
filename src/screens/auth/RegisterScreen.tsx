import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { registerApi } from '../../api/authApi';
import { useNavigation } from '@react-navigation/native';
import { Layout } from '../../components/ui/Layout';
import { Typography } from '../../components/ui/Typography';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { theme } from '../../theme/theme';

export default function RegisterScreen() {
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
      await registerApi(name, email, password, role);
      // alert('Registration successful'); // Replace with better feedback if possible
      navigation.navigate('Login');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
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
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Typography variant="h1" align="center" style={styles.title}>
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
            />

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
                    style={styles.roleButton}
                  />
                ))}
              </View>
            </View>

            {error ? (
              <Typography style={styles.error} color={theme.colors.error}>
                {error}
              </Typography>
            ) : null}

            <Button
              title="Register"
              onPress={handleRegister}
              loading={loading}
              style={styles.button}
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
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: theme.spacing.xl,
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
  roleContainer: {
    marginBottom: theme.spacing.md,
  },
  roleLabel: {
    marginBottom: theme.spacing.sm,
    marginLeft: theme.spacing.xs,
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