import React from 'react';
import { View, StyleSheet, StatusBar, ViewStyle, StatusBarStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../hooks/useTheme';

interface LayoutProps {
    children: React.ReactNode;
    style?: ViewStyle;
    barStyle?: StatusBarStyle;
    safeAreaEdges?: ('top' | 'right' | 'bottom' | 'left')[];
}

export const Layout: React.FC<LayoutProps> = ({
    children,
    style,
    barStyle,
    safeAreaEdges = ['top', 'left', 'right']
}) => {
    const { colors, theme, isDark } = useTheme();

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar
                barStyle={barStyle || (isDark ? 'light-content' : 'dark-content')}
                backgroundColor="transparent"
                translucent
            />
            <SafeAreaView
                style={[
                    styles.safeArea,
                    { paddingHorizontal: theme.spacing.lg },
                    style
                ]}
                edges={safeAreaEdges}
            >
                {children}
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    safeArea: {
        flex: 1,
    },
});
