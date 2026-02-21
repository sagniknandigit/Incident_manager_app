import { View, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Layout } from '../../components/ui/Layout';
import { Typography } from '../../components/ui/Typography';
import { Header } from '../../components/ui/Header';
import { Card } from '../../components/ui/Card';
import { IncidentStatusBadge, IncidentStatus } from '../../components/ui/IncidentStatusBadge';
import { updateIncidentStatusApi } from '../../api/incidentApi';
import { useState } from 'react';
import { useTheme } from '../../hooks/useTheme';

export default function UpdateIncidentStatusScreen() {
    const route = useRoute<any>();
    const navigation = useNavigation<any>();
    const { incidentId } = route.params;
    const [loading, setLoading] = useState(false);
    const { colors, theme } = useTheme();

    const updateStatus = async (status: string) => {
        try {
            setLoading(true);
            await updateIncidentStatusApi(incidentId, status);
            Alert.alert('Success', 'Status updated successfully');
            navigation.goBack();
        } catch {
            Alert.alert('Error', 'Failed to update status');
        } finally {
            setLoading(false);
        }
    };

    const StatusTile = ({ status, label, description }: { status: IncidentStatus, label: string, description: string }) => (
        <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => updateStatus(status)}
            disabled={loading}
        >
            <Card style={[styles.tile, { paddingVertical: theme.spacing.md }] as any}>
                <View style={styles.tileHeader}>
                    <IncidentStatusBadge status={status} />
                    <Typography variant="body" style={{ fontWeight: '700', color: colors.textPrimary }}>{label}</Typography>
                </View>
                <Typography variant="caption" color={colors.textSecondary}>{description}</Typography>
            </Card>
        </TouchableOpacity>
    );

    return (
        <Layout>
            <Header title="Update Status" showBack />
            <View style={styles.container}>
                <View style={[styles.headerSection, { marginBottom: theme.spacing.xl, backgroundColor: colors.surface, padding: theme.spacing.md, borderRadius: theme.borderRadius.md, borderColor: colors.border }]}>
                    <Typography variant="caption" color={colors.textSecondary}>INCIDENT ID</Typography>
                    <Typography variant="h2" color={colors.textPrimary}>#{incidentId}</Typography>
                </View>

                <Typography variant="subtitle" style={[styles.sectionTitle, { marginBottom: theme.spacing.md, paddingLeft: theme.spacing.xs }]}>Select New Status</Typography>

                <View style={[styles.tilesContainer, { gap: theme.spacing.md }]}>
                    <StatusTile
                        status="IN_PROGRESS"
                        label="In Progress"
                        description="Acknowledge and start working on the incident."
                    />
                    <StatusTile
                        status="RESOLVED"
                        label="Resolved"
                        description="Fix has been deployed or issue is no longer present."
                    />
                    <StatusTile
                        status="CLOSED"
                        label="Closed"
                        description="Final confirmation that the incident is fully handled."
                    />
                </View>
            </View>
        </Layout>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerSection: {
        borderWidth: 1,
    },
    sectionTitle: {
    },
    tilesContainer: {
    },
    tile: {
    },
    tileHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8,
    }
});