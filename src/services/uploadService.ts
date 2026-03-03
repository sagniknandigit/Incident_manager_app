import storage from '@react-native-firebase/storage';
import { Platform } from 'react-native';

/**
 * Uploads a file to Firebase Storage and returns the download URL.
 * @param uri The local URI of the file to upload.
 * @param fileName The desired name for the file in storage.
 * @returns The download URL of the uploaded file.
 */
export const uploadImageToStorage = async (uri: string, fileName: string): Promise<string> => {
    try {
        const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
        const reference = storage().ref(`incidents/${fileName}`);

        console.log('[Upload] Starting upload for:', fileName);
        await reference.putFile(uploadUri);

        const url = await reference.getDownloadURL();
        console.log('[Upload] Upload complete. URL:', url);

        return url;
    } catch (error) {
        console.error('[Upload] Error uploading image:', error);
        throw error;
    }
};
