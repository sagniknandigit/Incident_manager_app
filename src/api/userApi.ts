import apiClient from "./apiClient";
export const getEngineersApi = () => {
    return apiClient.get('/users?role=ENGINEER');
};

export const saveFcmTokenApi = (fcmtoken: string) => {
    return apiClient.post('/users/save-fcm-token', { fcmtoken });
};

