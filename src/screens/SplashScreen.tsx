import React, { useEffect } from 'react';
import { View, StyleSheet, Animated, Easing, Image } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { Typography } from '../components/ui/Typography';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

export default function SplashScreen() {
    const { colors, theme } = useTheme();
    const isAuth = useSelector((state: RootState) => state.auth.isAuthenticated);

    const fadeAnim = new Animated.Value(0);
    const scaleAnim = new Animated.Value(0.8);

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                friction: 4,
                useNativeDriver: true,
            })
        ]).start();

        const timer = setTimeout(() => {
            // Logic handled by AppNavigator's state, but we can trigger a transition here
            // if we weren't using the conditional stack approach.
            // Since we ARE using a conditional stack, the navigator will swap children
            // when the 'loading' state in AppNavigator changes.
            // However, to make it feel like a real splash, we want to stay here a bit.
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <Animated.View style={[
                styles.content,
                { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }
            ]}>
                <View style={[styles.logoContainer, { backgroundColor: colors.surface, borderColor: colors.primary + '20' }]}>
                    <Image
                        source={require('../assets/images/logo.png')}
                        style={styles.logo}
                    />
                </View>
                <Typography variant="h1" color={colors.primary} style={styles.title}>
                    Incident<Typography variant="h1" color={colors.textPrimary}>Manager</Typography>
                </Typography>
                <Typography variant="body" color={colors.textSecondary} style={styles.subtitle}>
                    Premium Safety Solutions
                </Typography>
            </Animated.View>

            <View style={styles.footer}>
                <Typography variant="caption" color={colors.textDisabled}>
                    v1.0.0 • Powered by Antigravity
                </Typography>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        alignItems: 'center',
    },
    logoContainer: {
        width: 120,
        height: 120,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
        borderWidth: 1,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 5,
        overflow: 'hidden',
    },
    logo: {
        width: '80%',
        height: '80%',
        resizeMode: 'contain',
    },
    title: {
        fontSize: 32,
        fontWeight: '800',
    },
    subtitle: {
        marginTop: 8,
        letterSpacing: 2,
        textTransform: 'uppercase',
        fontSize: 12,
        fontWeight: '600',
    },
    footer: {
        position: 'absolute',
        bottom: 40,
    }
});
