import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDUjaaZ2XEwidEgVdBrpXFDFnjtnRnZgbI",
  authDomain: "royal-expense.firebaseapp.com",
  projectId: "royal-expense",
  storageBucket: "royal-expense.firebasestorage.app",
  messagingSenderId: "394789304641",
  appId: "1:394789304641:web:eb4d23232f9ba9994e49c0",
  measurementId: "G-TV0JRGD11D",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
