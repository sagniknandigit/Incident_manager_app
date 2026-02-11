import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../../theme/theme';
import { Typography } from './Typography';
// Using a simple text character for back icon if no vector icons library is available yet
// ideally replace with feather/ionic icons later

interface HeaderProps {
    title: string;
    showBack?: boolean;
    rightAction?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({
    title,
    showBack = false,
    rightAction
}) => {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <View style={styles.leftContainer}>
                {showBack && (
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        style={styles.backButton}
                        activeOpacity={0.7}
                    >
                        <Typography variant="h3" color={theme.colors.textPrimary}>{'<'}</Typography>
                    </TouchableOpacity>
                )}
            </View>

            <View style={styles.titleContainer}>
                <Typography variant="h3" align="center" style={styles.title}>
                    {title}
                </Typography>
            </View>

            <View style={styles.rightContainer}>
                {rightAction}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 56,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: theme.spacing.md,
        backgroundColor: 'transparent', // Transparent to let gradient/bg show through
        marginBottom: theme.spacing.sm,
    },
    leftContainer: {
        width: 50,
        alignItems: 'flex-start',
    },
    titleContainer: {
        flex: 1,
        alignItems: 'center',
    },
    rightContainer: {
        width: 40,
        alignItems: 'flex-end',
    },
    backButton: {
        padding: theme.spacing.sm,
        borderRadius: theme.borderRadius.round,
        backgroundColor: theme.colors.surfaceHighlight,
    },
    title: {
        textTransform: 'capitalize',
    }
});
