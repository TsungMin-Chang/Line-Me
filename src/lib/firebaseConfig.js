import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

import { privateEnv } from "@/lib/env/private";

const firebaseConfig = {
  apiKey: privateEnv.FIREBASE_API_KEY,
  authDomain: privateEnv.FIREBASE_AUTH_DOMAIN,
  projectId: privateEnv.FIREBASE_PROJECT_ID,
  storageBucket: privateEnv.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: privateEnv.FIREBASE_MESSAGING_SENDER_ID,
  appId: privateEnv.FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };
