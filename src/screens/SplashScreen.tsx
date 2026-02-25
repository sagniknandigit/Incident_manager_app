import React, { useEffect, useRef } from 'react';
import { StyleSheet, Animated, Easing, Image } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { Typography } from '../components/ui/Typography';
import { Box, Center, VStack } from '@gluestack-ui/themed';

export default function SplashScreen() {
    const { colors } = useTheme();

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.8)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        // Entry animation
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

        // Continuous pulse animation
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.05,
                    duration: 1500,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 1500,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                })
            ])
        ).start();
    }, []);

    return (
        <Center flex={1} bg={colors.background}>
            <Animated.View style={{
                alignItems: 'center',
                opacity: fadeAnim,
                transform: [
                    { scale: Animated.multiply(scaleAnim, pulseAnim) }
                ]
            }}>
                <Box
                    sx={{
                        width: 120,
                        height: 120,
                        borderRadius: 30,
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginBottom: 24,
                        borderWidth: 1,
                        borderColor: colors.primary + '20',
                        bg: colors.surface,
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 10 },
                        shadowOpacity: 0.1,
                        shadowRadius: 20,
                        elevation: 5,
                        overflow: 'hidden',
                    }}
                >
                    <Image
                        source={require('../assets/images/logo.png')}
                        style={{ width: '80%', height: '80%', resizeMode: 'contain' }}
                    />
                </Box>
                <VStack sx={{ alignItems: 'center' }}>
                    <Typography variant="h1" color={colors.primary} style={{ fontSize: 32, fontWeight: '800' }}>
                        Incident<Typography variant="h1" color={colors.textPrimary} style={{ fontSize: 32, fontWeight: '800' }}>Manager</Typography>
                    </Typography>
                    <Typography
                        variant="body"
                        color={colors.textSecondary}
                        style={{
                            marginTop: 8,
                            letterSpacing: 2,
                            textTransform: 'uppercase',
                            fontSize: 12,
                            fontWeight: '600'
                        }}
                    >
                        Premium Safety Solutions
                    </Typography>
                </VStack>
            </Animated.View>

            <Box sx={{ position: 'absolute', bottom: 40 }}>
                <Typography variant="caption" color={colors.textDisabled}>
                    v1.0.0 • Powered by Antigravity
                </Typography>
            </Box>
        </Center>
    );
}
