// src/firebase/client.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAI, GoogleAIBackend, getGenerativeModel } from "firebase/ai";
import { firebaseConfig } from "./config";

// Ensure we don’t initialize Firebase twice (Next.js hot reload safe)
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Core clients
export const auth = getAuth(app);
export const db = getFirestore(app);

// Gemini AI Logic setup
const ai = getAI(app, {
backend: new GoogleAIBackend(), // This points AI Logic → Gemini Developer API
});

// Pick your AI Studio model
export const geminiModel = getGenerativeModel(ai, {
  model: "gemini-2.0-flash", // Change to whatever AI Studio uses
});

