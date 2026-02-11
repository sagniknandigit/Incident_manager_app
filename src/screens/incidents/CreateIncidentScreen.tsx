import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Layout } from '../../components/ui/Layout';
import { Typography } from '../../components/ui/Typography';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Header } from '../../components/ui/Header';
import { theme } from '../../theme/theme';
import { createIncidentApi } from '../../api/incidentApi';
import { useNavigation } from '@react-navigation/native';

export default function CreateIncidentScreen() {
    const navigation = useNavigation<any>();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'>('MEDIUM');
    const [loading, setLoading] = useState(false);

    const priorities: ('LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL')[] = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];

    const handleSubmit = async () => {
        if (!title.trim() || !description.trim()) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        setLoading(true);
        try {
            await createIncidentApi(title, description, priority);
            Alert.alert('Success', 'Incident reported successfully', [
                { text: 'OK', onPress: () => navigation.goBack() }
            ]);
        } catch (error) {
            Alert.alert('Error', 'Failed to report incident');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <Header title="Report Incident" showBack />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.content}>
                    <View style={styles.formSection}>
                        <Input
                            label="Incident Title"
                            placeholder="e.g., Server Outage in Region East"
                            value={title}
                            onChangeText={setTitle}
                        />

                        <Input
                            label="Description"
                            placeholder="Describe the issue in detail..."
                            value={description}
                            onChangeText={setDescription}
                            multiline
                            numberOfLines={4}
                            style={{ height: 120, textAlignVertical: 'top' }}
                        />

                        <View style={styles.prioritySection}>
                            <Typography variant="caption" color={theme.colors.textSecondary} style={styles.label}>
                                Priority Level
                            </Typography>
                            <View style={styles.priorityGrid}>
                                {priorities.map((p) => (
                                    <Button
                                        key={p}
                                        title={p}
                                        onPress={() => setPriority(p)}
                                        variant={priority === p ? (p === 'CRITICAL' ? 'danger' : 'primary') : 'secondary'}
                                        style={styles.priorityBtn}
                                    />
                                ))}
                            </View>
                        </View>
                    </View>

                    <Button
                        title="Submit Report"
                        onPress={handleSubmit}
                        loading={loading}
                        style={styles.submitBtn}
                    />
                </ScrollView>
            </KeyboardAvoidingView>
        </Layout>
    );
}

const styles = StyleSheet.create({
    content: {
        paddingBottom: theme.spacing.xxl,
    },
    formSection: {
        marginBottom: theme.spacing.xl,
    },
    label: {
        marginBottom: theme.spacing.sm,
        marginLeft: theme.spacing.xs,
        fontWeight: '600',
    },
    prioritySection: {
        marginTop: theme.spacing.sm,
    },
    priorityGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: theme.spacing.xs,
    },
    priorityBtn: {
        flexGrow: 1,
        minWidth: '45%',
        height: 44,
    },
    submitBtn: {
        marginTop: theme.spacing.lg,
    },
});
