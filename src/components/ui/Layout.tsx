import React from 'react';
import { View, StyleSheet, StatusBar, ViewStyle, StatusBarStyle, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../../theme/theme';

interface LayoutProps {
    children: React.ReactNode;
    style?: ViewStyle;
    barStyle?: StatusBarStyle;
    safeAreaEdges?: ('top' | 'right' | 'bottom' | 'left')[];
}

export const Layout: React.FC<LayoutProps> = ({
    children,
    style,
    barStyle = 'light-content',
    safeAreaEdges = ['top', 'left', 'right']
}) => {
    return (
        <View style={styles.container}>
            <StatusBar
                barStyle={barStyle}
                backgroundColor="transparent"
                translucent
            />
            <SafeAreaView
                style={[styles.safeArea, style]}
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
        backgroundColor: theme.colors.background,
    },
    safeArea: {
        flex: 1,
        paddingHorizontal: theme.spacing.lg,
    },
});
