import * as admin from 'firebase-admin';
import serviceAccount from './beaura-1c358-firebase-adminsdk-aojmc-6620ef1e5b.json';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

export const firebaseAdmin = admin;
