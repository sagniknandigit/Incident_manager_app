import React from 'react';
import { View, StyleSheet, StatusBar, SafeAreaView, ViewStyle, StatusBarStyle } from 'react-native';
import { theme } from '../../theme/theme';

interface LayoutProps {
    children: React.ReactNode;
    style?: ViewStyle;
    barStyle?: StatusBarStyle;
}

export const Layout: React.FC<LayoutProps> = ({
    children,
    style,
    barStyle = 'light-content'
}) => {
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar
                barStyle={barStyle}
                backgroundColor={theme.colors.background}
            />
            <View style={[styles.content, style]}>
                {children}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    content: {
        flex: 1,
        paddingHorizontal: theme.spacing.lg,
    },
});
