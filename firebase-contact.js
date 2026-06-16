import { initializeApp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";
import {
  addDoc,
  collection,
  getFirestore,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAMPs9fwLa3lCY6AnxnYo-1GXXeCMCVllA",
  authDomain: "portfolio-aagash.firebaseapp.com",
  projectId: "portfolio-aagash",
  storageBucket: "portfolio-aagash.firebasestorage.app",
  messagingSenderId: "65859568127",
  appId: "1:65859568127:web:1c367f8cdcf416314ea7ca",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

window.saveContactMessage = async ({ name, email, message }) => {
  return addDoc(collection(db, "contactMessages"), {
    name,
    email,
    message,
    recipientEmail: "aagashhari5@gmail.com",
    createdAt: serverTimestamp(),
  });
};
