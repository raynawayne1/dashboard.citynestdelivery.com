import admin from 'firebase-admin';

// Initialize Firebase Admin
if (!admin.apps.length) {
  try {
    // 1. Check for Environment Variables (Works on Vercel)
    if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_PRIVATE_KEY) {
      console.log("Initializing Firebase Admin via Environment Variables...");
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          // Handle potential newline issues in environment variables
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        }),
      });
    } 
    // 2. Fallback to local JSON file (Works on your local computer)
    else {
      console.log("Initializing Firebase Admin via local JSON file...");
      // Using require() is cleaner for JSON than fs.readFileSync
      const serviceAccount = require('./firebase-service-account.json');
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    }
  } catch (error) {
    console.error('Error initializing Firebase Admin SDK:', error);
    // Note: Do not use process.exit(1) in a Next.js environment as it can crash the build worker
  }
}

const db = admin.firestore();
const auth = admin.auth();

export { db, auth };