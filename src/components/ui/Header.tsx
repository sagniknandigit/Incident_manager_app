import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../hooks/useTheme';
import { Typography } from './Typography';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../../redux/themeSlice';
import { RootState } from '../../redux/store';

interface HeaderProps {
    title: string;
    showBack?: boolean;
    rightAction?: React.ReactNode;
    showThemeToggle?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
    title,
    showBack = false,
    rightAction,
    showThemeToggle = true
}) => {
    const navigation = useNavigation();
    const { colors, theme, isDark } = useTheme();
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.auth.user);

    const getProfileImage = () => {
        if (!user) return null;
        switch (user.role) {
            case 'MANAGER':
                return require('../../assets/images/manager.png');
            case 'ENGINEER':
                return require('../../assets/images/engineer.png');
            case 'REPORTER':
                return require('../../assets/images/reporter.png');
            default:
                return null;
        }
    };

    const profileImg = getProfileImage();

    return (
        <View style={styles.container}>
            <View style={styles.leftContainer}>
                {showBack && (
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        style={[styles.backButton, { backgroundColor: colors.surfaceHighlight }]}
                        activeOpacity={0.7}
                    >
                        <Typography variant="h3" color={colors.textPrimary}>{'<'}</Typography>
                    </TouchableOpacity>
                )}
            </View>

            <View style={styles.titleContainer}>
                <Typography variant="h3" align="center" style={styles.title} color={colors.textPrimary}>
                    {title}
                </Typography>
            </View>

            <View style={styles.rightContainer}>
                {showThemeToggle && (
                    <TouchableOpacity
                        onPress={() => dispatch(toggleTheme())}
                        style={[styles.themeToggle, { backgroundColor: colors.surfaceHighlight }]}
                        activeOpacity={0.7}
                    >
                        <Typography variant="caption">{isDark ? '🌙' : '☀️'}</Typography>
                    </TouchableOpacity>
                )}
                {profileImg && (
                    <View style={[styles.profileContainer, { borderColor: colors.primary + '30' }]}>
                        <Image source={profileImg} style={styles.profileImage} />
                    </View>
                )}
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
        backgroundColor: 'transparent',
        marginBottom: 12,
        paddingHorizontal: 4,
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
        minWidth: 50,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    backButton: {
        padding: 8,
        borderRadius: 20,
    },
    themeToggle: {
        padding: 8,
        borderRadius: 20,
        marginRight: 8,
    },
    profileContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        borderWidth: 2,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    title: {
        textTransform: 'capitalize',
    }
});
