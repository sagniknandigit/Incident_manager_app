import { View, StyleSheet, ScrollView, Alert, Animated } from 'react-native';
import { useState, useRef, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Layout } from '../../components/ui/Layout';
import { Typography } from '../../components/ui/Typography';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Header } from '../../components/ui/Header';
import { Card } from '../../components/ui/Card';
import { useTheme } from '../../hooks/useTheme';
import { createIncidentApi } from '../../api/incidentApi';

export default function CreateIncident() {
  const navigation = useNavigation<any>();
  const { colors, theme } = useTheme();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'>('MEDIUM');
  const [loading, setLoading] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim()) {
      Alert.alert('Incomplete Report', 'Please provide both a title and details for the briefing.');
      return;
    }

    setLoading(true);
    try {
      await createIncidentApi({ title, description, priority });
      Alert.alert('Transmission Successful', 'The incident report has been dispatched to the fleet.');
      navigation.goBack();
    } catch (error: any) {
      Alert.alert('Transmission Failure', error.response?.data?.message || 'Failed to dispatch incident report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Header title="New Report" showBack />
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: theme.spacing.xxl }]}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
          <View style={styles.introHeader}>
            <Typography variant="h2" style={styles.mainTitle}>Incident Briefing</Typography>
            <Typography variant="body" color={colors.textSecondary} style={styles.subtitle}>
              SUBMIT DETAILED INTELLIGENCE FOR RAPID RESOLUTION
            </Typography>
          </View>

          <Card variant="glass" padding="lg" style={styles.formCard as any}>
            <Input
              label="Briefing Title"
              placeholder="e.g., Core API Latency Spike"
              value={title}
              onChangeText={setTitle}
            />

            <Input
              label="Detailed Intelligence"
              placeholder="Provide full context of the anomaly..."
              multiline
              numberOfLines={4}
              value={description}
              onChangeText={setDescription}
              style={styles.textArea}
            />

            <View style={styles.prioritySection}>
              <Typography variant="caption" color={colors.textDisabled} style={styles.priorityLabel}>
                SEVERITY LEVEL
              </Typography>
              <View style={styles.priorityGrid}>
                {(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] as const).map((p) => (
                  <Button
                    key={p}
                    title={p}
                    variant={priority === p ? (p === 'CRITICAL' ? 'danger' : 'primary') : 'secondary'}
                    onPress={() => setPriority(p)}
                    style={styles.priorityBtn}
                    fullWidth={false}
                  />
                ))}
              </View>
            </View>

            <View style={{ height: theme.spacing.lg }} />

            <Button
              title="Dispatch Report"
              onPress={handleSubmit}
              loading={loading}
              variant="primary"
            />
          </Card>
        </Animated.View>
      </ScrollView>
    </Layout>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  introHeader: {
    marginBottom: 24,
  },
  mainTitle: {
    fontWeight: '800',
    marginBottom: 4,
  },
  subtitle: {
    letterSpacing: 1,
    fontSize: 10,
    fontWeight: '700',
  },
  formCard: {
    borderRadius: 32,
  },
  textArea: {
    height: 120,
  },
  prioritySection: {
    marginTop: 12,
  },
  priorityLabel: {
    letterSpacing: 1.5,
    fontWeight: '800',
    marginBottom: 12,
    marginLeft: 4,
  },
  priorityGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  priorityBtn: {
    flex: 1,
    minWidth: '45%',
    height: 44,
    borderRadius: 14,
  },
});
