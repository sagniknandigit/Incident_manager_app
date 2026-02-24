import messaging from '@react-native-firebase/messaging';

export const requestNotificationsPermission=async()=>{
    await messaging().requestPermission();

    const token =await messaging().getToken();
    console.log('FCM Token:',token);

    return token;
}