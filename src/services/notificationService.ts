import messaging from '@react-native-firebase/messaging';
import { Alert, Platform, PermissionsAndroid } from 'react-native';

export const requestNotificationsPermission = async () => {
    if (Platform.OS === 'android' && Platform.Version >= 33) {
        await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
    }
    try {
        console.log('[FCM] Requesting permission...');
        const authStatus = await messaging().requestPermission();

        const enabled =
            authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
            authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        console.log('[FCM] Permission status:', authStatus);

        if (enabled) {
            console.log('[FCM] Getting token...');
            if (Platform.OS === 'ios') {
                await messaging().registerDeviceForRemoteMessages();
            }

            const token = await messaging().getToken();
            console.log('[FCM] Token retrieved:', token ? 'YES' : 'NO');
            return token;
        } else {
            console.warn('[FCM] Notification permission denied');
            return null;
        }
    } catch (error: any) {
        console.error('[FCM] Error in requestNotificationsPermission:', error);
        return null;
    }
}

// Handler for foreground messages
export const setupNotificationListeners = () => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
        console.log('[FCM] Foreground Message received:', JSON.stringify(remoteMessage));

        Alert.alert(
            remoteMessage.notification?.title || 'New Notification',
            remoteMessage.notification?.body || ''
        );
    });

    return unsubscribe;
};

// Handler for background/quit state messages
export const registerBackgroundHandler = () => {
    messaging().setBackgroundMessageHandler(async remoteMessage => {
        console.log('[FCM] Background Message handled:', remoteMessage.messageId);
    });
};