import React, { useEffect, useRef } from 'react';
import { Image, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
    Box,
    HStack,
    VStack,
    Pressable,
    Icon,
    ChevronLeftIcon,
} from '@gluestack-ui/themed';
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
    const { colors, isDark } = useTheme();
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.auth.user);

    const avatarScale = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.spring(avatarScale, {
            toValue: 1,
            useNativeDriver: true,
            tension: 50,
            friction: 7,
        }).start();
    }, [user]);

    const getProfileImage = () => {
        if (!user) return null;
        switch (user.role) {
            case 'MANAGER': return require('../../assets/images/manager.png');
            case 'ENGINEER': return require('../../assets/images/engineer.png');
            case 'REPORTER': return require('../../assets/images/reporter.png');
            default: return null;
        }
    };

    const profileImg = getProfileImage();

    return (
        <Box sx={{ w: '100%', minHeight: 60, justifyContent: 'center', bg: 'transparent', py: '$2' } as any}>
            <HStack sx={{ w: '100%', alignItems: 'center', justifyContent: 'space-between', px: '$1' } as any}>

                {/* Left Section: Branding */}
                <HStack alignItems="center" sx={{ gap: '$3', flexShrink: 0 } as any}>
                    {showBack && (
                        <Pressable
                            onPress={() => navigation.goBack()}
                            sx={{
                                w: 34,
                                h: 34,
                                borderRadius: '$full',
                                bg: (colors.surfaceHighlight || '#F1F5F9') as any,
                                justifyContent: 'center',
                                alignItems: 'center',
                                ':active': { opacity: 0.7 }
                            } as any}
                        >
                            <Icon as={ChevronLeftIcon as any} color={colors.textPrimary} size="md" />
                        </Pressable>
                    )}
                    <Typography
                        variant="h3"
                        style={{ fontWeight: '900', fontSize: 18, letterSpacing: -0.5 }}
                        numberOfLines={1}
                    >
                        {title}
                    </Typography>
                </HStack>

                {/* Right Section: Multi-line Stacked Actions */}
                <VStack alignItems="flex-end" sx={{ gap: '$2', ml: '$2' } as any}>
                    {/* Top Row: Toggle + Profile Icon (Rightmost) */}
                    <HStack alignItems="center" sx={{ gap: '$3' } as any}>
                        {showThemeToggle && (
                            <Pressable
                                onPress={() => dispatch(toggleTheme())}
                                sx={{
                                    w: 30,
                                    h: 30,
                                    borderRadius: '$full',
                                    bg: (colors.surfaceHighlight || '#F1F5F9') as any,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    ':active': { opacity: 0.7 }
                                } as any}
                            >
                                <Typography style={{ fontSize: 14 }}>{isDark ? '🌙' : '☀️'}</Typography>
                            </Pressable>
                        )}

                        {profileImg && (
                            <Animated.View style={{
                                width: 30,
                                height: 30,
                                borderRadius: 15,
                                borderWidth: 1.5,
                                borderColor: (colors.primary || '#4F46E5') + '30',
                                overflow: 'hidden',
                                transform: [{ scale: avatarScale as any }],
                                opacity: (avatarScale as any)
                            }}>
                                <Image source={profileImg} style={{ width: '100%', height: '100%' }} />
                            </Animated.View>
                        )}
                    </HStack>

                    {/* Bottom Row: Right Action (Logout Option) */}
                    {rightAction && (
                        <Box sx={{ mt: '$0' } as any}>
                            {rightAction}
                        </Box>
                    )}
                </VStack>
            </HStack>
        </Box>
    );
};
