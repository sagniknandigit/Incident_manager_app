import messaging from '@react-native-firebase/messaging';
import { Alert, Platform } from 'react-native';

export const requestNotificationsPermission = async () => {
    try {
        console.log('[FCM] Requesting permission...');
        const authStatus = await messaging().requestPermission();

        const enabled =
            authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
            authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        console.log('[FCM] Permission status:', authStatus);

        if (enabled) {
            console.log('[FCM] Getting token...');
            // On iOS, we need to register for remote notifications first
            if (Platform.OS === 'ios') {
                await messaging().registerDeviceForRemoteMessages();
            }

            const token = await messaging().getToken();
            console.log('[FCM] Token retrieved:', token ? 'YES (Length: ' + token.length + ')' : 'NO (NULL)');

            if (!token) {
                console.warn('[FCM] Token is null. Ensure Google Play Services are available and you are signed in.');
            }

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