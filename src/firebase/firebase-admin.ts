
import * as admin from 'firebase-admin';
import serviceAccount from '../../serviceAccountKey.json';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  });
}

const firestore = admin.firestore();

export { admin, firestore };
