// src/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFunctions } from "firebase/functions";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBmNUbboKFgFprMAduPJ4gtDLeH87u-pvM",
  authDomain: "hack-u-2025-85e6b.firebaseapp.com",
  projectId: "hack-u-2025-85e6b",
  storageBucket: "hack-u-2025-85e6b.firebasestorage.app",
  messagingSenderId: "498366952976",
  appId: "1:498366952976:web:d342891464241320c17c95",
  measurementId: "G-VKNLY9PXFB"
};

// 重複初期化を避けつつ初期化
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const functions = getFunctions(app, "us-central1");