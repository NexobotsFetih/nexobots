import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCrwMgJ2Wxf5U8ViV6hWb_1VIrKIAN_q0o",
    authDomain: "nexobots.firebaseapp.com",
    projectId: "nexobots",
    storageBucket: "nexobots.firebasestorage.app",
    messagingSenderId: "919163349736",
    appId: "1:919163349736:web:f110196fbca1b9ba6fb75d",
    measurementId: "G-XMDW8SJN8D"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
