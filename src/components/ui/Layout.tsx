import React from 'react';
import { StatusBar, StatusBarStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Box } from '@gluestack-ui/themed';
import { useTheme } from '../../hooks/useTheme';

interface LayoutProps {
    children: React.ReactNode;
    style?: any;
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
        <Box flex={1} bg={colors.background}>
            <StatusBar
                barStyle={barStyle || (isDark ? 'light-content' : 'dark-content')}
                backgroundColor="transparent"
                translucent
            />
            <SafeAreaView
                style={[
                    { flex: 1, paddingHorizontal: theme.spacing.lg },
                    style
                ]}
                edges={safeAreaEdges}
            >
                {children}
            </SafeAreaView>
        </Box>
    );
};
