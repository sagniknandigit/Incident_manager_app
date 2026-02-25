import React, { useState } from 'react';
import { ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Layout } from '../../components/ui/Layout';
import { Typography } from '../../components/ui/Typography';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Header } from '../../components/ui/Header';
import { createIncidentApi } from '../../api/incidentApi';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../hooks/useTheme';
import { VStack, HStack, Box, Pressable } from '@gluestack-ui/themed';
import { Card } from '../../components/ui/Card';

export default function CreateIncidentScreen() {
    const navigation = useNavigation<any>();
    const { colors } = useTheme();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'>('MEDIUM');
    const [loading, setLoading] = useState(false);

    const priorities: ('LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL')[] = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];

    const getPriorityColor = (p: string) => {
        switch (p) {
            case 'CRITICAL': return colors.error;
            case 'HIGH': return colors.warning;
            case 'MEDIUM': return colors.primary;
            case 'LOW': return colors.success;
            default: return colors.primary;
        }
    };

    const handleSubmit = async () => {
        if (!title.trim() || !description.trim()) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        setLoading(true);
        try {
            // FIX: Pass data as an object
            await createIncidentApi({ title, description, priority });
            Alert.alert('Success', 'Incident reported successfully');
            navigation.goBack();
        } catch (error) {
            Alert.alert('Error', 'Failed to report incident');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <Header title="New Incident" showBack />
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
                                    label="Title"
                                    placeholder="Brief summary of the issue"
                                    value={title}
                                    onChangeText={setTitle}
                                />

                                <Input
                                    label="Description"
                                    placeholder="Provide more details..."
                                    value={description}
                                    onChangeText={setDescription}
                                    multiline
                                    style={{ height: 100, textAlignVertical: 'top' }}
                                />

                                <VStack sx={{ gap: '$2' }}>
                                    <Typography variant="caption" color={colors.textSecondary} style={{ fontWeight: '700' }}>
                                        PRIORITY
                                    </Typography>
                                    <HStack sx={{ flexWrap: 'wrap', gap: '$2' }}>
                                        {priorities.map((p) => {
                                            const isSelected = priority === p;
                                            const pColor = getPriorityColor(p);
                                            return (
                                                <Pressable
                                                    key={p}
                                                    onPress={() => setPriority(p)}
                                                    sx={{ flex: 1, minWidth: '45%' }}
                                                >
                                                    <Box
                                                        sx={{
                                                            p: '$2',
                                                            borderRadius: '$md',
                                                            borderWidth: 1,
                                                            borderColor: isSelected ? pColor : colors.border,
                                                            bg: isSelected ? pColor + '10' : 'transparent',
                                                            alignItems: 'center'
                                                        }}
                                                    >
                                                        <Typography
                                                            variant="caption"
                                                            style={{ fontWeight: isSelected ? '700' : '400', color: isSelected ? pColor : colors.textPrimary }}
                                                        >
                                                            {p}
                                                        </Typography>
                                                    </Box>
                                                </Pressable>
                                            );
                                        })}
                                    </HStack>
                                </VStack>

                                <Button
                                    title="Submit Report"
                                    onPress={handleSubmit}
                                    loading={loading}
                                    style={{ marginTop: 12 }}
                                />
                            </VStack>
                        </Card>
                    </VStack>
                </ScrollView>
            </KeyboardAvoidingView>
        </Layout>
    );
}
