import { View, StyleSheet, FlatList, RefreshControl, Pressable, ActivityIndicator } from 'react-native';
import { Layout } from '../../components/ui/Layout';
import { Typography } from '../../components/ui/Typography';
import { Card } from '../../components/ui/Card';
import { EmptyState } from '../../components/ui/EmptyState';
import { IncidentStatusBadge } from '../../components/ui/IncidentStatusBadge';
import { useState, useCallback, useEffect } from 'react';
import { getIncidentsApi } from '../../api/incidentApi';
import { getEngineersApi } from '../../api/userApi';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Header } from '../../components/ui/Header';
import { useTheme } from '../../hooks/useTheme';
import { Filter } from 'lucide-react-native';
import {
    HStack,
    Box,
    VStack,
    Actionsheet,
    ActionsheetBackdrop,
    ActionsheetContent,
    ActionsheetDragIndicator,
    ActionsheetDragIndicatorWrapper,
    Button,
    ButtonText,
    ScrollView
} from '@gluestack-ui/themed';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

export default function IncidentList() {
    const [incidents, setIncidents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    // Pagination state
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Global Filter state (Applied filters)
    const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
    const [priorityFilter, setPriorityFilter] = useState<string | undefined>(undefined);
    const [engineerFilter, setEngineerFilter] = useState<number | undefined>(undefined);

    // Temporary Filter state (Inside Sheet)
    const [tempStatus, setTempStatus] = useState<string | undefined>(undefined);
    const [tempPriority, setTempPriority] = useState<string | undefined>(undefined);
    const [tempEngineer, setTempEngineer] = useState<number | undefined>(undefined);

    const [engineers, setEngineers] = useState<any[]>([]);
    const [isSheetOpen, setIsSheetOpen] = useState(false);

    const { colors, theme } = useTheme();
    const navigation = useNavigation<any>();
    const user = useSelector((state: RootState) => state.auth.user);

    const activeFilterCount = [statusFilter, priorityFilter, engineerFilter].filter(Boolean).length;

    const fetchIncidents = async (pageNum = 1, shouldAppend = false) => {
        if (pageNum === 1) setLoading(true);
        else setLoadingMore(true);

        try {
            const response = await getIncidentsApi({
                page: pageNum,
                limit: 10,
                status: statusFilter,
                priority: priorityFilter,
                engineerId: engineerFilter,
            });

            const { incidents: newIncidents, totalPages: total } = response.data;

            if (shouldAppend) {
                setIncidents(prev => [...prev, ...newIncidents]);
            } else {
                setIncidents(newIncidents);
            }

            setTotalPages(total);
            setPage(pageNum);
        } catch (error) {
            console.error('Fetch error:', error);
        } finally {
            setLoading(false);
            setLoadingMore(false);
            setRefreshing(false);
        }
    };

    const fetchEngineers = async () => {
        if (user?.role === 'MANAGER') {
            try {
                const res = await getEngineersApi();
                setEngineers(res.data);
            } catch (err) {
                console.error('Failed to fetch engineers for filter', err);
            }
        }
    };

    useEffect(() => {
        fetchEngineers();
    }, []);

    useFocusEffect(
        useCallback(() => {
            fetchIncidents(1, false);
        }, [statusFilter, priorityFilter, engineerFilter])
    );

    const handleRefresh = () => {
        setRefreshing(true);
        fetchIncidents(1, false);
    };

    const handleLoadMore = () => {
        if (page < totalPages && !loadingMore) {
            fetchIncidents(page + 1, true);
        }
    };

    const openFilterSheet = () => {
        setTempStatus(statusFilter);
        setTempPriority(priorityFilter);
        setTempEngineer(engineerFilter);
        setIsSheetOpen(true);
    };

    const applyFilters = () => {
        setStatusFilter(tempStatus);
        setPriorityFilter(tempPriority);
        setEngineerFilter(tempEngineer);
        setIsSheetOpen(false);
    };

    const resetFilters = () => {
        setTempStatus(undefined);
        setTempPriority(undefined);
        setTempEngineer(undefined);
        setStatusFilter(undefined);
        setPriorityFilter(undefined);
        setEngineerFilter(undefined);
        setIsSheetOpen(false);
    };

    const FilterChip = ({ label, isSelected, onPress }: { label: string, isSelected: boolean, onPress: () => void }) => (
        <Pressable
            onPress={onPress}
            style={[
                styles.filterChip,
                {
                    backgroundColor: isSelected ? colors.primary : colors.surfaceHighlight,
                    borderColor: isSelected ? colors.primary : colors.border
                }
            ]}
        >
            <Typography
                variant="caption"
                style={{ color: isSelected ? 'white' : colors.textSecondary, fontWeight: '700' }}
            >
                {label.toUpperCase()}
            </Typography>
        </Pressable>
    );

    const renderHeader = () => {
        const FilterTrigger = (
            <Pressable onPress={openFilterSheet} style={styles.filterTrigger}>
                <Box style={[styles.filterIconBox, { backgroundColor: activeFilterCount > 0 ? colors.primary : colors.surfaceHighlight }]}>
                    <Filter
                        size={20}
                        color={activeFilterCount > 0 ? 'white' : colors.textSecondary}
                        strokeWidth={2.5}
                    />
                    {activeFilterCount > 0 && (
                        <View style={[styles.badge, { backgroundColor: colors.error }]}>
                            <Typography style={styles.badgeText}>{activeFilterCount}</Typography>
                        </View>
                    )}
                </Box>
                <Typography variant="caption" style={{ fontWeight: '700', color: activeFilterCount > 0 ? colors.primary : colors.textSecondary }}>
                    FILTER
                </Typography>
            </Pressable>
        );

        return <Header title="Incident Feed" showBack={true} rightAction={FilterTrigger} />;
    };

    const renderItem = ({ item }: { item: any }) => {
        return (
            <Card style={styles.card as any} onPress={() => navigation.navigate('IncidentDetails', { incident: item })}>
                <View style={styles.cardHeader}>
                    <IncidentStatusBadge status={item.status} />
                    <Typography variant="caption" color={colors.textDisabled}>
                        {new Date(item.createdAt || Date.now()).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </Typography>
                </View>

                <Typography variant="h3" style={styles.cardTitle} numberOfLines={1}>{item.title}</Typography>

                <Typography variant="body" color={colors.textSecondary} numberOfLines={2} style={styles.description}>
                    {item.description}
                </Typography>

                <View style={[styles.footer, { borderTopColor: colors.border }]}>
                    <View style={styles.priorityContainer}>
                        <View style={[
                            styles.priorityDot,
                            { backgroundColor: item.priority === 'CRITICAL' ? colors.error : (item.priority === 'HIGH' ? colors.warning : colors.primaryLight) }
                        ]} />
                        <Typography variant="caption" color={colors.textSecondary} style={{ fontWeight: '600' }}>
                            {item.priority}
                        </Typography>
                    </View>
                    <Typography variant="caption" color={colors.primary} style={{ fontWeight: '700' }}>
                        VIEW DETAILS →
                    </Typography>
                </View>
            </Card>
        );
    };

    return (
        <Layout style={{ paddingHorizontal: 0 }}>
            {renderHeader()}

            <FlatList
                data={incidents}
                renderItem={renderItem}
                keyExtractor={item => item.id.toString()}
                contentContainerStyle={[styles.listContent, { paddingBottom: theme.spacing.xl }]}
                showsVerticalScrollIndicator={false}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.5}
                ListFooterComponent={loadingMore ? (
                    <View style={styles.loaderFooter}>
                        <ActivityIndicator color={colors.primary} />
                    </View>
                ) : null}
                ListEmptyComponent={!loading ? (
                    <EmptyState
                        title="No Incidents Matched"
                        description="Adjust your filters to scan a different sector of the fleet operations."
                        icon="🛰️"
                        actionLabel="Clear All Filters"
                        onAction={resetFilters}
                    />
                ) : (
                    <View style={styles.centerLoader}>
                        <ActivityIndicator size="large" color={colors.primary} />
                    </View>
                )}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                        tintColor={colors.primary}
                        colors={[colors.primary]}
                    />
                }
            />

            {/* Filter Bottom Sheet */}
            <Actionsheet isOpen={isSheetOpen} onClose={() => setIsSheetOpen(false)}>
                <ActionsheetBackdrop />
                <ActionsheetContent sx={{ bg: colors.background, paddingBottom: 40 } as any}>
                    <ActionsheetDragIndicatorWrapper>
                        <ActionsheetDragIndicator />
                    </ActionsheetDragIndicatorWrapper>

                    <VStack style={styles.sheetHeader}>
                        <Typography variant="h3" style={{ fontWeight: '900' }}>Tactical Filters</Typography>
                        <Typography variant="caption" color={colors.textSecondary}>Refine your operational intelligence feed.</Typography>
                    </VStack>

                    <ScrollView style={{ width: '100%', maxHeight: 400 }}>
                        <VStack style={styles.sheetBody}>
                            {/* Status Section */}
                            <Typography variant="subtitle" style={styles.sectionTitle}>STATUS SECTOR</Typography>
                            <HStack style={styles.chipRow}>
                                {['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'].map(s => (
                                    <FilterChip
                                        key={s}
                                        label={s.replace('_', ' ')}
                                        isSelected={tempStatus === s}
                                        onPress={() => setTempStatus(tempStatus === s ? undefined : s)}
                                    />
                                ))}
                            </HStack>

                            {/* Priority Section */}
                            <Typography variant="subtitle" style={styles.sectionTitle}>SEVERITY LEVEL</Typography>
                            <HStack style={styles.chipRow}>
                                {['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].map(p => (
                                    <FilterChip
                                        key={p}
                                        label={p}
                                        isSelected={tempPriority === p}
                                        onPress={() => setTempPriority(tempPriority === p ? undefined : p)}
                                    />
                                ))}
                            </HStack>

                            {/* Engineer Section (Managers only) */}
                            {user?.role === 'MANAGER' && engineers.length > 0 && (
                                <>
                                    <Typography variant="subtitle" style={styles.sectionTitle}>ASSIGNED UNIT</Typography>
                                    <HStack style={styles.chipRow}>
                                        {engineers.map(e => (
                                            <FilterChip
                                                key={e.id}
                                                label={e.name}
                                                isSelected={tempEngineer === e.id}
                                                onPress={() => setTempEngineer(tempEngineer === e.id ? undefined : e.id)}
                                            />
                                        ))}
                                    </HStack>
                                </>
                            )}
                        </VStack>
                    </ScrollView>

                    <HStack style={styles.sheetFooter}>
                        <Button
                            variant="outline"
                            onPress={resetFilters}
                            style={{ flex: 1, marginRight: 12, borderColor: colors.border, borderRadius: 12 }}
                        >
                            <ButtonText style={{ color: colors.textSecondary }}>RESET</ButtonText>
                        </Button>
                        <Button
                            onPress={applyFilters}
                            style={{ flex: 2, backgroundColor: colors.primary, borderRadius: 12 }}
                        >
                            <ButtonText color="white">APPLY FILTERS</ButtonText>
                        </Button>
                    </HStack>
                </ActionsheetContent>
            </Actionsheet>
        </Layout>
    );
}

const styles = StyleSheet.create({
    mainHeader: {
        px: 16,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.05)',
        backgroundColor: 'transparent',
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingBottom: 12,
    },
    filterTrigger: {
        alignItems: 'center',
        paddingLeft: 12,
    },
    filterIconBox: {
        width: 44,
        height: 44,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 4,
        position: 'relative',
    },
    badge: {
        position: 'absolute',
        top: -4,
        right: -4,
        minWidth: 18,
        height: 18,
        borderRadius: 9,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 4,
        borderWidth: 2,
        borderColor: 'white',
    },
    badgeText: {
        color: 'white',
        fontSize: 10,
        fontWeight: '900',
    },
    filterChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 12,
        borderWidth: 1,
        marginRight: 8,
        marginBottom: 8,
    },
    listContent: {
        paddingHorizontal: 16,
        paddingTop: 16,
        flexGrow: 1,
    },
    card: {
        marginBottom: 16,
        borderRadius: 24,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    cardTitle: {
        marginBottom: 6,
        fontWeight: '700',
    },
    description: {
        marginBottom: 16,
        lineHeight: 20,
        fontSize: 14,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 12,
        borderTopWidth: 1,
    },
    priorityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    priorityDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 6,
    },
    centerLoader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 100, // Adjusted for empty state centering
    },
    loaderFooter: {
        paddingVertical: 20,
    },
    sheetHeader: {
        width: '100%',
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 20,
    },
    sheetBody: {
        width: '100%',
        paddingHorizontal: 20,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: '800',
        letterSpacing: 1,
        marginBottom: 12,
        marginTop: 16,
        opacity: 0.6,
    },
    chipRow: {
        flexWrap: 'wrap',
        marginBottom: 8,
    },
    sheetFooter: {
        width: '100%',
        paddingHorizontal: 20,
        paddingTop: 24,
        paddingBottom: 20,
    }
});
