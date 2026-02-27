import admin from 'firebase-admin';
import path from 'path';
import fs from 'fs';

const serviceAccountPath = path.join(
  __dirname,
  './firebase-service-account.json'
);

let isFirebaseInitialized = false;

try {
  if (!admin.apps.length) {
    if (fs.existsSync(serviceAccountPath)) {
      const serviceAccount = JSON.parse(
        fs.readFileSync(serviceAccountPath, 'utf8')
      );

      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });

      isFirebaseInitialized = true;
      console.log('🔥 Firebase Admin initialized successfully.');
    } else {
      console.warn(
        '⚠️ Firebase service account file not found. Push disabled.'
      );
    }
  }
} catch (error) {
  console.error('❌ Failed to initialize Firebase Admin:', error);
}

export { isFirebaseInitialized };
export default admin;