import { initializeApp, getApps } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence, browserLocalPersistence } from 'firebase/auth';
import { getFirestore, initializeFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getFunctions } from 'firebase/functions';
import { Platform } from 'react-native';

/**
 * Firebase Configuration
 */
const firebaseConfig = {
  apiKey: "AIzaSyC0Q2XXte-AhP8h6veB5jpa0tu_Egnu-d4",
  authDomain: "moova-ff8e6.firebaseapp.com",
  projectId: "moova-ff8e6",
  storageBucket: "moova-ff8e6.firebasestorage.app",
  messagingSenderId: "304560983590",
  appId: "1:304560983590:web:4ada43a30146c30280e0e7",
  measurementId: "G-GXRM9JRVDG"
};

// Initialize Firebase - singleton pattern
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Firebase Auth with platform-specific persistence
let auth;
if (Platform.OS === 'web') {
  // Web uses browser persistence
  auth = initializeAuth(app, {
    persistence: browserLocalPersistence
  });
} else {
  // React Native uses AsyncStorage persistence
  const ReactNativeAsyncStorage = require('@react-native-async-storage/async-storage').default;
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
  });
}

export { auth };

// On Android/iOS: force long polling. WebChannel (WebSockets) often fails on
// Android (10s timeout, "Could not reach Cloud Firestore backend"). Long polling
// avoids that. Max request timeout is 30s (SDK limit).
const db = (Platform.OS === 'android' || Platform.OS === 'ios')
  ? initializeFirestore(app, {
      experimentalForceLongPolling: true,
      experimentalLongPollingOptions: { timeoutSeconds: 30 },
    })
  : getFirestore(app);
export { db };
export const storage = getStorage(app);
export const functions = getFunctions(app);

export default app;
