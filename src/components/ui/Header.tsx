import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Animated } from 'react-native';
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
    const scrollY = useRef(new Animated.Value(0)).current;

    // Animations
    const avatarScale = useRef(new Animated.Value(0)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        // Entry animation
        Animated.spring(avatarScale, {
            toValue: 1,
            useNativeDriver: true,
            tension: 50,
            friction: 7,
        }).start();

        // Subtle pulse loop
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.05,
                    duration: 2000,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 2000,
                    useNativeDriver: true,
                })
            ])
        ).start();
    }, [user]);

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

    const renderHeaderButton = (onPress: () => void, content: React.ReactNode, style?: any) => (
        <TouchableOpacity
            onPress={onPress}
            style={[styles.headerButton, { backgroundColor: colors.surfaceHighlight }, style]}
            activeOpacity={0.7}
        >
            {content}
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.leftContainer}>
                {showBack && renderHeaderButton(() => navigation.goBack(),
                    <Typography variant="h3" color={colors.textPrimary}>{'<'}</Typography>,
                    styles.backButton
                )}
            </View>

            <View style={styles.titleContainer}>
                <Typography variant="h3" align="center" style={styles.title} color={colors.textPrimary}>
                    {title}
                </Typography>
            </View>

            <View style={styles.rightContainer}>
                {showThemeToggle && renderHeaderButton(() => dispatch(toggleTheme()),
                    <Typography variant="caption">{isDark ? '🌙' : '☀️'}</Typography>,
                    styles.themeToggle
                )}
                {profileImg && (
                    <Animated.View style={[
                        styles.profileContainer,
                        {
                            borderColor: colors.primary + '40',
                            transform: [
                                { scale: Animated.multiply(avatarScale, pulseAnim) }
                            ],
                            opacity: avatarScale
                        }
                    ]}>
                        <Image source={profileImg} style={styles.profileImage as any} />
                    </Animated.View>
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
    headerButton: {
        padding: 8,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backButton: {
        // specific back button styles if needed
    },
    themeToggle: {
        marginRight: 8,
    },
    profileContainer: {
        width: 38,
        height: 38,
        borderRadius: 19,
        borderWidth: 2,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.05)',
    },
    profileImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    title: {
        textTransform: 'capitalize',
        fontWeight: '700',
    }
});
