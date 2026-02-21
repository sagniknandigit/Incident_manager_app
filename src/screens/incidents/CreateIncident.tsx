import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';

import { Layout } from '../../components/ui/Layout';
import { Typography } from '../../components/ui/Typography';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useTheme } from '../../hooks/useTheme';

import { createIncidentApi } from '../../api/incidentApi';

export default function CreateIncident() {
  const navigation = useNavigation<any>();
  const { colors, theme } = useTheme();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] =
    useState<'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'>('MEDIUM');

  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      await createIncidentApi({
        title,
        description,
        priority,
      });

      Alert.alert('Success', 'Incident reported successfully');
      navigation.goBack();
    } catch (error: any) {
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to report incident'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <ScrollView contentContainerStyle={[styles.content, { paddingVertical: theme.spacing.lg }]}>
        <View style={[styles.header, { marginBottom: theme.spacing.xl }]}>
          <Typography variant="h2" color={colors.textPrimary}>Report Incident</Typography>
          <Typography variant="body" color={colors.textSecondary}>
            Describe the issue in detail
          </Typography>
        </View>

        <View style={[styles.form, { backgroundColor: colors.surface, padding: theme.spacing.lg, borderRadius: theme.borderRadius.lg }]}>
          <Input
            label="Title"
            placeholder="e.g. Server Down"
            value={title}
            onChangeText={setTitle}
          />

          <Input
            label="Description"
            placeholder="Describe what happened..."
            multiline
            numberOfLines={4}
            value={description}
            onChangeText={setDescription}
            style={styles.textArea}
            textAlignVertical="top"
          />

          <View style={[styles.prioritySection, { marginBottom: theme.spacing.lg }]}>
            <Typography variant="caption" color={colors.textSecondary} style={[styles.label, { marginBottom: theme.spacing.sm, marginLeft: theme.spacing.xs }]}>
              Priority
            </Typography>

            <View style={[styles.priorityGrid, { gap: theme.spacing.sm }]}>
              {(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] as const).map(
                (p) => (
                  <Button
                    key={p}
                    title={p}
                    variant={
                      priority === p
                        ? p === 'CRITICAL'
                          ? 'danger'
                          : 'primary'
                        : 'secondary'
                    }
                    onPress={() => setPriority(p)}
                    style={styles.priorityBtn}
                  />
                )
              )}
            </View>
          </View>

          <Button
            title="Submit Report"
            onPress={handleSubmit}
            loading={loading}
            style={[styles.submitBtn, { marginTop: theme.spacing.md }] as any}
          />
        </View>
      </ScrollView>
    </Layout>
  );
}

const styles = StyleSheet.create({
  content: {
  },
  header: {
  },
  form: {
  },
  textArea: {
    minHeight: 100,
  },
  prioritySection: {
  },
  label: {
  },
  priorityGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  priorityBtn: {
    flex: 1,
    minWidth: '45%',
  },
  submitBtn: {
  },
});
