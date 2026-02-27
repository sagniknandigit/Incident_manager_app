import admin, { isFirebaseInitialized } from '../config/firebase';

export const sendPushNotification = async (token: string, title: string, body: string) => {
    if (!isFirebaseInitialized) {
        console.warn('Push notification skipped: Firebase not initialized.');
        return;
    }

    try {
        const response=await admin.messaging().send({
            token,
            notification: {
                title,
                body,
            },
        });
        console.log('FCM response',response);
    } catch (error) {
        console.log('Push notification failed:', error);
    }
};