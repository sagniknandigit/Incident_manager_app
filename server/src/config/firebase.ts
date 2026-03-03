import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

let isFirebaseInitialized = false;

try {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });

    isFirebaseInitialized = true;
    console.log('🔥 Firebase Admin initialized securely from ENV.');
  }
} catch (error) {
  console.error('❌ Failed to initialize Firebase Admin:', error);
}

export { isFirebaseInitialized };
export default admin;